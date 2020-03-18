export default class BottomNavigatorButtonViewModel {
  text = '';

  value = '';

  icon = '';

  click: () => void;

  constructor(text: string, value: string, icon: string, click: () => void) {
    this.text = text;
    this.value = value;
    this.icon = icon;
    this.click = click;
  }
}
