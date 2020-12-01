import StorageSync from "../modules/chrome/storage/StorageSync";

export default class User {
  public initializeInstallationId(): Promise<any> {
    return new Promise((resolve, reject) => {
      StorageSync.get('installationId').then(installationId => {
        if (typeof installationId === 'undefined') {
          resolve(this.setInstallationId());
        } else if (installationId) {
          resolve();
        } else {
          reject();
        }
      })
    })
  }

  private setInstallationId(): any {
    const installationId = this.getRandom();
    StorageSync.set({'installationId': installationId});

    return installationId;
  }

  private getRandom(): string {
    return Math.random().toString(16).substr(2);
  }
}