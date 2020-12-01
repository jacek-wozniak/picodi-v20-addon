class FileManager {
  public open(filepath: string, json: boolean = false): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch(filepath)
        .then((response) => {
          if (response.status !== 200) {
            reject(`Cannot find file: ${filepath}`);
            return;
          }
          if (json) {
            response.json().then(resolve);
          } else {
            response.text().then(resolve);
          }
        })
        .catch(reject);
    });
  }
}

export default new FileManager()
