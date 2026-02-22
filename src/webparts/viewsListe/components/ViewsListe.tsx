import * as React from "react";
import { useState } from "react";
import { DisplayMode } from "@microsoft/sp-core-library";
import { IViewsListeProps } from "./IViewsListeProps";
import { IAppItem } from "./IAppItem";
import styles from "./ViewsListe.module.scss";

const generateId = (): string => `app_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

const EMPTY_FORM: Partial<IAppItem> = {
  title: "",
  url: "",
  description: "",
  iconUrl: "",
  theme: "Blue",
};

const ViewsListe: React.FC<IViewsListeProps> = (props) => {
  const { apps, openInNewTab, displayMode, onAppsChanged } = props;
  const isEditMode = displayMode === DisplayMode.Edit;

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [newApp, setNewApp] = useState<Partial<IAppItem>>(EMPTY_FORM);

  const handleRemoveApp = (id: string): void => {
    onAppsChanged(apps.filter((a) => a.id !== id));
  };

  const handleAddApp = (): void => {
    if (!newApp.title) return;
    const app: IAppItem = {
      id: generateId(),
      title: newApp.title || "",
      description: newApp.description || "",
      url: newApp.url || "",
      iconUrl: newApp.iconUrl || "",
      theme: newApp.theme || "Blue",
      order: apps.length + 1,
    };
    onAppsChanged([...apps, app]);
    setNewApp(EMPTY_FORM);
  };

  return (
    <div className={styles.container}>
      {isEditMode && (
        <div className={styles.editBar}>
          <button className={styles.manageButton} onClick={() => setIsPanelOpen(true)}>
            ⚙️ Gérer les applications
          </button>
        </div>
      )}

      {apps.length === 0 ? (
        <div className={styles.emptyMessage}>
          <p>
            {isEditMode
              ? 'Cliquez sur "Gérer les applications" pour ajouter des applications.'
              : "Aucune application disponible."}
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {apps.map((item) => (
            <div
              key={item.id}
              className={`${styles.card} ${item.theme === "Pink" ? styles.cardPink : styles.cardBlue}`}
            >
              {isEditMode && (
                <button
                  className={styles.cardRemoveButton}
                  onClick={() => handleRemoveApp(item.id)}
                  title="Supprimer"
                >
                  ✕
                </button>
              )}
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
                    target={openInNewTab ? "_blank" : "_self"}
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
      )}

      {isPanelOpen && (
        <div className={styles.panelOverlay} onClick={() => setIsPanelOpen(false)}>
          <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Gérer les applications</h2>
              <button className={styles.panelClose} onClick={() => setIsPanelOpen(false)}>
                ✕
              </button>
            </div>
            <div className={styles.panelContent}>
              <h3 className={styles.panelSectionTitle}>Applications ({apps.length})</h3>
              {apps.length === 0 ? (
                <p className={styles.panelEmpty}>Aucune application ajoutée.</p>
              ) : (
                <ul className={styles.appList}>
                  {apps.map((app) => (
                    <li key={app.id} className={styles.appListItem}>
                      <div className={`${styles.appListDot} ${app.theme === "Pink" ? styles.appListDotPink : styles.appListDotBlue}`} />
                      <span className={styles.appListName}>{app.title}</span>
                      <button
                        className={styles.appListRemove}
                        onClick={() => handleRemoveApp(app.id)}
                      >
                        Supprimer
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className={styles.panelDivider} />

              <h3 className={styles.panelSectionTitle}>Ajouter une application</h3>
              <div className={styles.addForm}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Titre *</label>
                  <input
                    className={styles.formInput}
                    type="text"
                    value={newApp.title}
                    onChange={(e) => setNewApp({ ...newApp, title: e.target.value })}
                    placeholder="Nom de l'application"
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>URL</label>
                  <input
                    className={styles.formInput}
                    type="text"
                    value={newApp.url}
                    onChange={(e) => setNewApp({ ...newApp, url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Description</label>
                  <input
                    className={styles.formInput}
                    type="text"
                    value={newApp.description}
                    onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                    placeholder="Courte description"
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>URL de l&apos;icône</label>
                  <input
                    className={styles.formInput}
                    type="text"
                    value={newApp.iconUrl}
                    onChange={(e) => setNewApp({ ...newApp, iconUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Thème</label>
                  <select
                    className={styles.formSelect}
                    value={newApp.theme}
                    onChange={(e) =>
                      setNewApp({ ...newApp, theme: e.target.value as "Blue" | "Pink" })
                    }
                  >
                    <option value="Blue">Bleu</option>
                    <option value="Pink">Rose</option>
                  </select>
                </div>
                <button
                  className={styles.addButton}
                  onClick={handleAddApp}
                  disabled={!newApp.title}
                >
                  + Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewsListe;

