import FileManager from './FileManager';

class Config {
  public get(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const filepath = this.getFilepath(name);
      FileManager.open(filepath)
        .then((data) => {
          let parsed = JSON.parse(data);
          if (this.hasImports(parsed)) {
            Promise.all(this.getImportPromises(parsed))
              .then((importDataList) => {
                importDataList.forEach((importData) => {
                  parsed = Object.assign(parsed, importData);
                });
                resolve(parsed);
              });
          } else {
            resolve(parsed);
          }
        })
        .catch(reject);
    });
  }

  private hasImports(data: any): boolean {
    return data.hasOwnProperty('imports') && Array.isArray(data.imports) && data.imports.length;
  }

  private getImportPromises(data: any): Array<Promise> {
    const importPromises = [];
    data.imports.forEach((importFile) => {
      importPromises.push(this.get(importFile));
    });
    return importPromises;
  }

  private getFilepath(name) {
    return `../config/${name}.json`;
  }
}

export default new Config()
