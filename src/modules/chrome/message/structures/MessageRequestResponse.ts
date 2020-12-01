import isUndefined from "lodash/isUndefined";
import MessageRequestInterface from "../interfaces/MessageRequestInterface";
import Tab = chrome.tabs.Tab;

class MessageRequestResponse {
  protected type: string;
  protected async: boolean = false;
  protected tab: Tab = null;
  protected values: any = {};
  protected responseSender: Function;

  constructor (request: MessageRequestInterface, responseSender: Function) {
		this.type = request.type;
		this.tab = request.tab;
		this.values = request.values;
		this.async = request.async;
		this.responseSender = responseSender;
  }

  public getType(): string {
    return this.type;
  }

  public isAsync(): boolean {
    return this.async;
  }

  public getTab(): Tab {
    return this.tab;
  }

  public getValue(key: string, defaultValue: any = undefined): any {
    if (!this.values.hasOwnProperty(key)) {
    	if (isUndefined(defaultValue)) {
				throw new Error(`Unable to find key "${key}" and default value is not defined!`);
			}
      return defaultValue;
    }
    return this.values[key];
  }

  public getValues(): any {
    return this.values;
  }

  public sendResponse(data: any): void {
    this.responseSender(data);
  }
}

export default MessageRequestResponse