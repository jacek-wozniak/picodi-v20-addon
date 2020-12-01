import isUndefined from "lodash/isUndefined";
import TabListenerInterface from "./interfaces/TabListenerInterface";
import TabActiveInfo = chrome.tabs.TabActiveInfo;
import TabChangeInfo = chrome.tabs.TabChangeInfo;
import Tab = chrome.tabs.Tab;

class TabListener {
  private activated: TabListenerInterface[] = [];
  private replaced: TabListenerInterface[] = [];
  private updated: TabListenerInterface[] = [];

  constructor () {
    chrome.tabs.onActivated.addListener((info: TabActiveInfo) => this.onActivatedListener(info));
    chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: TabChangeInfo, tab: Tab) => this.onUpdatedListener(tabId, changeInfo, tab));
    chrome.tabs.onReplaced.addListener((tabId: number) => this.onReplacedListener(tabId));
  }

  public addCallbackOnActivated(callback: Function, complete: boolean): void {
    this.activated.push({callback, complete});
  }

  public addCallbackOnReplaced(callback: Function, complete: boolean): void {
    this.replaced.push({callback, complete});
  }

  public addCallbackOnUpdated(callback: Function, complete: boolean): void {
    this.updated.push({callback, complete});
  }

  private onActivatedListener(info: TabActiveInfo): void {
    chrome.tabs.get(info.tabId, (tab: Tab) => {
      this.activated.forEach((listener: TabListenerInterface) => {
        if (!this.isCompleteOption(listener) || this.isCompleteStatus(tab)) {
          listener.callback(tab);
        }
      });
    });
  }

  private onReplacedListener(tabId: number): void {
    chrome.tabs.get(tabId, (tab: Tab) => this.onReplacedTab(tab));
  }

  private onReplacedTab(tab: Tab): void {
    this.replaced.forEach((listener: TabListenerInterface) => {
      if (!this.isCompleteOption(listener) || this.isCompleteStatus(tab)) {
        listener.callback(tab);
      }
    });
  }

  private onUpdatedListener(tabId: number, changeInfo: TabChangeInfo, tab: Tab): void {
    this.updated.forEach((listener: TabListenerInterface) => {
      if (!this.isCompleteOption(listener) || this.isCompleteStatus(tab, changeInfo)) {
        listener.callback(tab, changeInfo);
      }
    });
  }

  private isCompleteOption(listener: TabListenerInterface): boolean {
    return listener.hasOwnProperty('complete') && listener.complete;
  }

  private isCompleteStatus(tab: Tab, changeInfo: TabChangeInfo = null): boolean {
    if (!tab.hasOwnProperty('status') || tab.status !== 'complete') {
      return false;
    }
    if (!isUndefined(changeInfo) && changeInfo.status !== 'complete') {
      return false;
    }
    return true;
  }
}

export default new TabListener()
