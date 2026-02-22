import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneToggle,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import ViewsListe from "./components/ViewsListe";
import { IViewsListeProps } from "./components/IViewsListeProps";
import { IAppItem } from "./components/IAppItem";

export interface IViewsListeWebPartProps {
  apps: string; // JSON array of IAppItem
  openInNewTab: boolean;
}

export default class ViewsListeWebPart extends BaseClientSideWebPart<IViewsListeWebPartProps> {
  public render(): void {
    let apps: IAppItem[] = [];
    try {
      apps = this.properties.apps ? JSON.parse(this.properties.apps) : [];
    } catch (e) {
      console.warn("ViewsListe: Failed to parse apps property", e);
      apps = [];
    }

    const element: React.ReactElement<IViewsListeProps> = React.createElement(ViewsListe, {
      apps,
      openInNewTab: this.properties.openInNewTab !== false,
      displayMode: this.displayMode,
      onAppsChanged: (newApps: IAppItem[]) => {
        this.properties.apps = JSON.stringify(newApps);
        this.render();
      },
    });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Configuration du webpart ViewsListe",
          },
          groups: [
            {
              groupName: "Paramètres",
              groupFields: [
                PropertyPaneToggle("openInNewTab", {
                  label: "Ouvrir les liens dans un nouvel onglet",
                  onText: "Oui",
                  offText: "Non",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}

