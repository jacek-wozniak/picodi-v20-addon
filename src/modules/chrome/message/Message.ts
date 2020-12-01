import MessageRequestInterface from "./interfaces/MessageRequestInterface";
import MessageSender = chrome.runtime.MessageSender;
import MessageRequestResponse from "./structures/MessageRequestResponse";

abstract class Message {
  private callbacks: { [key: string]: Function } = {};

  constructor() {
    chrome.runtime.onMessage.addListener((request: MessageRequestInterface, sender: MessageSender, sendResponse: Function) => {
      const messageRequest = new MessageRequestResponse(request, sendResponse);
			this.onMessageListener(messageRequest, sender, sendResponse);
			return messageRequest.isAsync();
    });
  }

  public addListener(type: string, callback: Function): void {
    this.callbacks[type] = callback;
  }

  private onMessageListener(request: MessageRequestResponse, sender: any, sendResponse: Function) {
    const callbackType = request.getType();
    if (this.hasCallback(callbackType)) {
      this.runCallback(callbackType, request, sender, sendResponse);
    }
  }

  private hasCallback(type: string): boolean {
    if (type === null) {
      return false;
    }
    return this.callbacks.hasOwnProperty(type);
  }

  private runCallback(type: string, request: MessageRequestResponse, sender: MessageSender, sendResponse: Function): void {
    this.callbacks[type](request, sendResponse, sender);
  }
}

export default Message
