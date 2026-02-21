import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import ViewsListe from "./components/ViewsListe";
import { IViewsListeProps } from "./components/IViewsListeProps";

export interface IViewsListeWebPartProps {
  listName: string;
  openInNewTab: boolean;
  filterActive: boolean;
}

export default class ViewsListeWebPart extends BaseClientSideWebPart<IViewsListeWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IViewsListeProps> = React.createElement(ViewsListe, {
      listName: this.properties.listName || "Applications",
      openInNewTab: this.properties.openInNewTab !== false,
      filterActive: this.properties.filterActive !== false,
      context: this.context,
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
              groupName: "Paramètres de la liste",
              groupFields: [
                PropertyPaneTextField("listName", {
                  label: "Nom de la liste SharePoint",
                  description:
                    'Nom de la liste contenant les applications (par défaut : "Applications")',
                  value: this.properties.listName || "Applications",
                }),
                PropertyPaneToggle("openInNewTab", {
                  label: "Ouvrir les liens dans un nouvel onglet",
                  onText: "Oui",
                  offText: "Non",
                }),
                PropertyPaneToggle("filterActive", {
                  label: "Afficher uniquement les applications actives",
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
