import { DisplayMode } from "@microsoft/sp-core-library";
import { IAppItem } from "./IAppItem";

export interface IViewsListeProps {
  apps: IAppItem[];
  openInNewTab: boolean;
  displayMode: DisplayMode;
  onAppsChanged: (apps: IAppItem[]) => void;
}
