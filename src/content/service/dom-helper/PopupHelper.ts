import AbstractDomHelper from "./abstract/AbstractDomHelper";

export default class PopupHelper extends AbstractDomHelper {
  public addElement(id: string): void {
    const bodyElement: HTMLElement = this.dom.querySelector('body');
    const toolboxElement: HTMLElement = this.dom.createElement('div');
    toolboxElement.id = id;
    bodyElement.appendChild(toolboxElement);
  }
}