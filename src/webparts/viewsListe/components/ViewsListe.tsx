import * as React from "react";
import { IViewsListeProps } from "./IViewsListeProps";
import styles from "./ViewsListe.module.scss";

const ViewsListe: React.FC<IViewsListeProps> = (props) => {
  const { apps, openInNewTab } = props;

  return (
    <div className={styles.container}>
      {apps.length === 0 ? (
        <div className={styles.emptyMessage}>
          <p>Aucune application disponible.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {apps.map((item) => (
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
    </div>
  );
};

export default ViewsListe;

