import * as React from "react";
import * as ReactDom from "react-dom";
import { useState } from "react";
import {
  IPropertyPaneField,
  PropertyPaneFieldType,
  IPropertyPaneCustomFieldProps,
} from "@microsoft/sp-property-pane";
import { IAppItem } from "./IAppItem";

const generateId = (): string =>
  `app_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

interface IAppManagerProps {
  apps: IAppItem[];
  onChange: (apps: IAppItem[]) => void;
}

const AppManager: React.FC<IAppManagerProps> = ({ apps, onChange }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [theme, setTheme] = useState<"Blue" | "Pink">("Blue");

  const handleAdd = (): void => {
    if (!title) return;
    const newApp: IAppItem = {
      id: generateId(),
      title,
      url,
      description,
      iconUrl,
      theme,
      order: apps.length + 1,
    };
    onChange([...apps, newApp]);
    setTitle("");
    setUrl("");
    setDescription("");
    setIconUrl("");
    setTheme("Blue");
  };

  const handleRemove = (id: string): void => {
    onChange(apps.filter((a) => a.id !== id));
  };

  const fieldStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    marginBottom: 10,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: "#323130",
    fontFamily: '"Segoe UI", sans-serif',
  };

  const inputStyle: React.CSSProperties = {
    padding: "6px 8px",
    border: "1px solid #c8c6c4",
    borderRadius: 2,
    fontSize: 13,
    fontFamily: '"Segoe UI", sans-serif',
    color: "#323130",
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    background: "#ffffff",
    cursor: "pointer",
  };

  const addButtonStyle: React.CSSProperties = {
    padding: "7px 16px",
    background: "#0078d4",
    color: "#ffffff",
    border: "none",
    borderRadius: 2,
    fontSize: 13,
    fontWeight: 600,
    cursor: title ? "pointer" : "not-allowed",
    opacity: title ? 1 : 0.5,
    fontFamily: '"Segoe UI", sans-serif',
    marginTop: 4,
  };

  const removeButtonStyle: React.CSSProperties = {
    background: "none",
    border: "1px solid #d13438",
    borderRadius: 2,
    color: "#d13438",
    fontSize: 12,
    padding: "2px 8px",
    cursor: "pointer",
    fontFamily: '"Segoe UI", sans-serif',
    flexShrink: 0,
  };

  const sectionTitleStyle: React.CSSProperties = {
    margin: "0 0 8px",
    fontSize: 13,
    fontWeight: 600,
    color: "#323130",
    fontFamily: '"Segoe UI", sans-serif',
  };

  const dividerStyle: React.CSSProperties = {
    borderTop: "1px solid #edebe9",
    margin: "16px 0",
  };

  return (
    <div style={{ padding: "4px 0" }}>
      {/* App list */}
      <p style={sectionTitleStyle}>Applications ({apps.length})</p>
      {apps.length === 0 ? (
        <p style={{ fontSize: 12, color: "#605e5c", margin: "0 0 8px", fontFamily: '"Segoe UI", sans-serif' }}>
          Aucune application ajoutée.
        </p>
      ) : (
        <ul style={{ listStyle: "none", margin: "0 0 8px", padding: 0 }}>
          {apps.map((app) => (
            <li
              key={app.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                background: "#f3f2f1",
                borderRadius: 4,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: app.theme === "Pink" ? "#c239b3" : "#0078d4",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  flex: 1,
                  fontSize: 13,
                  color: "#323130",
                  fontFamily: '"Segoe UI", sans-serif',
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {app.title}
              </span>
              <button style={removeButtonStyle} onClick={() => handleRemove(app.id)}>
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}

      <div style={dividerStyle} />

      {/* Add form */}
      <p style={sectionTitleStyle}>Ajouter une application</p>
      <div style={fieldStyle}>
        <label style={labelStyle}>Titre *</label>
        <input
          style={inputStyle}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nom de l'application"
        />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>URL</label>
        <input
          style={inputStyle}
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Description</label>
        <input
          style={inputStyle}
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Courte description"
        />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>URL de l&apos;icône</label>
        <input
          style={inputStyle}
          type="text"
          value={iconUrl}
          onChange={(e) => setIconUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Thème</label>
        <select
          style={selectStyle}
          value={theme}
          onChange={(e) => setTheme(e.target.value as "Blue" | "Pink")}
        >
          <option value="Blue">Bleu</option>
          <option value="Pink">Rose</option>
        </select>
      </div>
      <button style={addButtonStyle} onClick={handleAdd} disabled={!title}>
        + Ajouter
      </button>
    </div>
  );
};

export interface IAppManagerPropertyPaneFieldProps {
  apps: IAppItem[];
  onChange: (apps: IAppItem[]) => void;
}

export function PropertyPaneAppManager(
  targetProperty: string,
  props: IAppManagerPropertyPaneFieldProps
): IPropertyPaneField<IPropertyPaneCustomFieldProps> {
  return {
    type: PropertyPaneFieldType.Custom,
    targetProperty,
    shouldFocus: false,
    properties: {
      key: "AppManager",
      onRender: (domElement: HTMLElement) => {
        ReactDom.render(
          React.createElement(AppManager, {
            apps: props.apps,
            onChange: props.onChange,
          }),
          domElement
        );
      },
      onDispose: (domElement: HTMLElement) => {
        ReactDom.unmountComponentAtNode(domElement);
      },
    },
  };
}
