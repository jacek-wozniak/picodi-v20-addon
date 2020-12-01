import Message from './Message'
import MessageRequest from "../message/structures/MessageRequest";

class MessageBackground extends Message {
  send(requestCallback: Function): void {
    const messageRequest = new MessageRequest();
    requestCallback(messageRequest);
    chrome.tabs.sendMessage(messageRequest.getTab().id, messageRequest, messageRequest.getResponseCallback());
  }
}

export default new MessageBackground()
