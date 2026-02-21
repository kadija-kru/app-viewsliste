import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { IViewsListeProps } from "./IViewsListeProps";
import { IAppItem } from "./IAppItem";
import styles from "./ViewsListe.module.scss";

interface IViewsListeState {
  items: IAppItem[];
  isLoading: boolean;
  error: string | null;
}

const ViewsListe: React.FC<IViewsListeProps> = (props) => {
  const [state, setState] = useState<IViewsListeState>({
    items: [],
    isLoading: true,
    error: null,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapHyperlinkField = (field: any): string => {
    if (!field) return "";
    if (typeof field === "string") return field;
    if (typeof field === "object") {
      return field.Url || field.url || field.Description || "";
    }
    return "";
  };

  const loadItems = useCallback((): void => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const siteUrl: string = props.context.pageContext.web.absoluteUrl;
    const listName: string = encodeURIComponent(props.listName || "Applications");

    let filter = "";
    if (props.filterActive) {
      filter = "&$filter=IsActive eq 1";
    }

    const url: string =
      `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items` +
      `?$select=Id,Title,Description,Url,IconUrl,Theme,Order0,IsActive` +
      `&$orderby=Order0 asc` +
      `&$top=500` +
      filter;

    props.context.spHttpClient
      .get(url, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(
              `La liste "${props.listName}" est introuvable. Vérifiez le nom de la liste dans le Property Pane.`
            );
          }
          throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: { value: any[] }) => {
        if (!data || !data.value) {
          setState({ items: [], isLoading: false, error: null });
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items: IAppItem[] = data.value.map((item: any) => ({
          id: item.Id,
          title: item.Title || "",
          description: item.Description || "",
          url: mapHyperlinkField(item.Url),
          iconUrl: mapHyperlinkField(item.IconUrl),
          theme: (item.Theme as "Blue" | "Pink") || "Blue",
          order: item.Order0 || 0,
          isActive: item.IsActive !== false,
        }));
        setState({ items, isLoading: false, error: null });
      })
      .catch((err: Error) => {
        setState({ items: [], isLoading: false, error: err.message });
      });
  }, [props.listName, props.filterActive, props.context]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const { items, isLoading, error } = state;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Chargement des applications...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyMessage}>
          <p>Aucune application disponible dans la liste &laquo;{props.listName}&raquo;.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {items.map((item) => (
          <div
            key={item.id}
            className={`${styles.card} ${item.theme === "Pink" ? styles.cardPink : styles.cardBlue}`}
          >
            <div className={styles.cardHeader}>
              {item.iconUrl ? (
                <img
                  src={item.iconUrl}
                  alt={item.title}
                  className={styles.cardIcon}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className={styles.cardIconPlaceholder}>
                  {item.title ? item.title.charAt(0).toUpperCase() : "A"}
                </div>
              )}
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              {item.description && (
                <p className={styles.cardDescription}>{item.description}</p>
              )}
            </div>
            <div className={styles.cardFooter}>
              {item.url ? (
                <a
                  href={item.url}
                  target={props.openInNewTab ? "_blank" : "_self"}
                  rel="noreferrer"
                  className={styles.cardButton}
                >
                  Ouvrir
                </a>
              ) : (
                <span className={`${styles.cardButton} ${styles.cardButtonDisabled}`}>
                  Ouvrir
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewsListe;
