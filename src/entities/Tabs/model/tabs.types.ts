export interface TabItem {
  key: string;
  label: string;
  closable: boolean;
}

export interface TabsState {
  panes: TabItem[];
  activeKey: string;
}
