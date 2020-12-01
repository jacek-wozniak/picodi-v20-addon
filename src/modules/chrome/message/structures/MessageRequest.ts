import HttpResponse from "../../../api/structures/HttpResponseContent";
import HttpResponseInterface from "../../../api/structures/HttpResponseInterface";
import Tab = chrome.tabs.Tab;

class MessageRequest {
	protected type: string;
	protected async: boolean = false;
	protected tab: Tab = null;
	protected values: any = {};
	protected responseCallback: Function = null;

	public getType(): string {
		return this.type;
	}

  public setType(type: string): MessageRequest {
    this.type = type;
    return this;
  }

	public isAsync(): boolean {
		return this.async;
	}

  public setAsync(async: boolean): MessageRequest {
    this.async = async;
    return this;
  }

	public getTab(): Tab {
		return this.tab;
	}

  public setTab(tab: Tab): MessageRequest {
    this.tab = tab;
    return this;
  }

  public setValue(key: string, value: any): MessageRequest {
    this.values[key] = value;
    return this;
  }

  public setValues(values: any): MessageRequest {
    this.values = values;
    return this;
  }

	public getResponseCallback(): null|Function {
		return this.responseCallback;
	}

  public setResponseCallback(responseCallback: Function): MessageRequest {
    this.responseCallback = responseCallback;
    return this;
  }

  public setHttpResponseCallback(responseCallback: Function): MessageRequest {
		this.responseCallback = (httpResponseData: HttpResponseInterface) => {
			const httpResponse = new HttpResponse(httpResponseData);
			responseCallback(httpResponse);
		};
		return this;
	}
}

export default MessageRequest