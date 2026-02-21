export interface IAppItem {
  id: number;
  title: string;
  description: string;
  url: string;
  iconUrl: string;
  theme: "Blue" | "Pink";
  order: number;
  isActive: boolean;
}
