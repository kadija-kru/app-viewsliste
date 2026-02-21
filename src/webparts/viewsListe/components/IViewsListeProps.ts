import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IViewsListeProps {
  listName: string;
  openInNewTab: boolean;
  filterActive: boolean;
  context: WebPartContext;
}
