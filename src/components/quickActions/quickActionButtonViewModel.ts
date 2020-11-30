export default class QuickActionsButtonViewModel {
  text: string;

  icon: string;

  onClick: () => void;

  constructor(text: string, icon: string, onClick: () => void) {
    this.text = text;
    this.icon = icon;
    this.onClick = onClick;
  }
}
