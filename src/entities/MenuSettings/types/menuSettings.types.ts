export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  visible: boolean;
  order: number;
}

export interface MenuSettingsState {
  menuItems: MenuItem[];
  openKeys: string[];
}
