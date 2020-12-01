import Vue from 'vue';
import AbstractSection from './abstract/AbstractSection';
import Popup from '../components/Popup';
import PopupHelper from "../service/dom-helper/PopupHelper";

export default class PopupSection extends AbstractSection {
  private PopupHelper: PopupHelper;

  public render(): void {
    this.PopupHelper = new PopupHelper(this.getDom());
    this.renderOfferTileToolboxes();
  }

  private renderOfferTileToolboxes(): void {
    this.PopupHelper.addElement('popup');
    new Vue({
      el: '#popup',
      render: (h: Function) => h(Popup, {
        props: {
          locale: this.getLocale()
        }
      })
    });
  }

  public static isMatched(dataSection: string): boolean {
    return 'home' === dataSection;
  }
}
