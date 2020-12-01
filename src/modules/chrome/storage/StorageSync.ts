class StorageSync {
  public get(key: string) {
    return new Promise<any | string>((resolve, reject) => {
      chrome.storage.sync.get(key, (items: any) => {
        if (chrome.runtime.lastError) {

          reject(chrome.runtime.lastError.message);
        } else {

          resolve(items[key]);
        }
      });
    });
  }

  public set(object: object) {
    chrome.storage.sync.set(object);
  }


  public getCollection(keys: string[]) {
    return new Promise<any[]>((resolve, reject) => {
      chrome.storage.sync.get(keys, (items: any[]) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve(items);
        }
      });
    });
  }
}

export default new StorageSync();