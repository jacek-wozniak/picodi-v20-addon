class TabFetcher {
  public getActive(): Promise<string> {
    return new Promise((resolve) => {
      chrome.tabs.query({'active': true, 'currentWindow': true, 'url': '*://*/*'}, (tabs) => {
        if (Object.keys(tabs).length !== 0 && !!tabs[0].url) {
          resolve(tabs[0].url);
        }
      });
    });
  }

  public getCurrentTab(): Promise<Object> {
    return new Promise((resolve) => {
      chrome.tabs.query({'active': true, 'currentWindow': true, 'url': '*://*/*'}, (tabs) => {
        if (Object.keys(tabs).length) {
          resolve(tabs[0]);
        }
      });
    });
  }
}

export default new TabFetcher();