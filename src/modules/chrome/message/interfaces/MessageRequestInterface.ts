import Tab = chrome.tabs.Tab;

export default interface MessageRequestInterface {
  type: string;
  async: boolean;
  tab: Tab;
  values: any;
  responseCallback: Function;
}