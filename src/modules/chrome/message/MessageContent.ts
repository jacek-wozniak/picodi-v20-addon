import Message from "./Message"
import MessageRequest from "./structures/MessageRequest";

class MessageContent extends Message {
  send(requestCallback: Function): void {
    let messageRequest = new MessageRequest();
    requestCallback(messageRequest);
    chrome.runtime.sendMessage(messageRequest, messageRequest.getResponseCallback());
  }
}

export default new MessageContent()
