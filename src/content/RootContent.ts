import forEach from 'lodash/forEach';
import Message from '../modules/chrome/message/MessageContent';
import ParameterManager from '../modules/ParameterManager';
import SiteDeterminer from './service/SiteDeterminer';
import PopupSection from './sections/PopupSection';
import AbstractSection from "./sections/abstract/AbstractSection";
import MessageRequestResponse from '../modules/chrome/message/structures/MessageRequestResponse';
import Tab = chrome.tabs.Tab;

class RootContent {
  private dom: HTMLDocument;
  private tab: Tab;
  private parameterManager: ParameterManager;
  private siteDeterminer: SiteDeterminer;
  private locale: string;
  private sectionName: string;
  private sectionContent: AbstractSection;

  public constructor() {
    this.initializeBackgroundData().then((messageRequest: MessageRequestResponse) => {
      this.dom = document;
      this.tab = messageRequest.getTab();
      // this.parameterManager = new ParameterManager(messageRequest.getValue('configs'));
       this.siteDeterminer = new SiteDeterminer(this.tab.url, this.dom);
       this.locale = this.siteDeterminer.getUrlLocale();
      // this.sectionName = this.siteDeterminer.getSection();
       this.sectionContent = this.getSectionContent();

      if (this.sectionContent) {
        this.sectionContent.render();
      }

      Message.addListener('click.popup', (messageResponse: MessageRequestResponse) => {
        const app = document.getElementById('picodi-app');
        app.style.display = app.style.display === 'none' ? 'block' : 'none';
      })

    });
  }

  public getDom(): HTMLDocument {
    return this.dom;
  }

  public getTab(): Tab {
    return this.tab;
  }

  public getParameterManager(): ParameterManager {
    return this.parameterManager;
  }

  public getLocale(): string {
    return this.locale;
  }

  private initializeBackgroundData(): Promise<MessageRequestResponse> {
    return new Promise(resolve => {
      Message.addListener('initialize.popup', resolve);
    });
  }

  private getSectionContent(): AbstractSection | null {
    let section = null;
		const sections = [PopupSection];
    forEach(sections, (Section: any) => {


    	//if (Section.isMatched(this.sectionName)) {
				section = new Section(this);
      return false;
			//}
    });
    return section;
  }
}

export default RootContent;
