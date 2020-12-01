import ApiClient from "../modules/api/ApiClient";
import ApiClientManager from "../modules/api/ApiClientManager";
import HttpResponse from "../modules/api/structures/HttpResponseBackground";
import Message from "../modules/chrome/message/MessageBackground";
import ParameterManager from "../modules/ParameterManager";
import TabListener from "../modules/chrome/tab/TabListener";
import MessageRequest from "../modules/chrome/message/structures/MessageRequest";
import MessageRequestResponse from "../modules/chrome/message/structures/MessageRequestResponse";
import Tab = chrome.tabs.Tab;
import TabFetcher from "../modules/chrome/tab/TabFetcher";
import User from "./User";
import TabBuilder from "../modules/chrome/tab/TabBuilder";

class Background {
  private apiClientManager: ApiClientManager;
  private parameterManager: ParameterManager;
  private user: User;

  public constructor() {
    this.user = new User();
  }

  public initialize(): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.user.initializeInstallationId().then((installationId) => {
        this.initializeApiClientManger();
        this.initalizeTabListeners();
        this.initializeContentListeners();
        this.sendInstallationId(installationId);
        resolve();
      }).catch(reject);

    });
  }

  private initializeApiClientManger(): void {
    this.apiClientManager = new ApiClientManager(this.parameterManager);
  }

  private initalizeTabListeners(): void {
    TabListener.addCallbackOnUpdated((tab: Tab) => this.initializePopup(tab), true);
   // TabListener.addCallbackOnReplaced((tab: Tab) => this.initializePopup(tab), true);
  }

  private initializePopup(tab: Tab): void {
    Message.send((messageRequest: MessageRequest) => {
      messageRequest
        .setType('initialize.popup')
        .setTab(tab)
        .setAsync(true)
      //.setValue('configs', this.parameterManager.getConfigs());
    });
  }

  private sendInstallationId(installationId: string): void {
    if(typeof installationId !== 'undefined'){
      const apiClient: ApiClient = this.apiClientManager.getClient('pl');
      apiClient.addonInstall(installationId)
        .then((httpResponse: HttpResponse) => {
          apiClient.showResponse(httpResponse);
        })
        .catch((httpResponse: HttpResponse) => {
          apiClient.showResponse(httpResponse);
        });
    }
  }

  private initializeContentListeners(): void {
    Message.addListener('api.recognize', (messageResponse: MessageRequestResponse) => {
      TabFetcher.getActive().then((domain) => {
        const apiClient: ApiClient = this.apiClientManager.getClient('pl');
        apiClient.getOffersList(domain)
          .then((httpResponse: HttpResponse) => {
            messageResponse.sendResponse(httpResponse);
          })
          .catch((httpResponse: HttpResponse) => {
            messageResponse.sendResponse(httpResponse);
          });
      })
    });

    Message.addListener('tab.create', (messageResponse: MessageRequestResponse) => {
      new TabBuilder()
        .setUrl(messageResponse.getValue('url'))
        .setActive(messageResponse.getValue('active', true))
        .createTab();
    });

    Message.addListener('offers.counter', (messageResponse: MessageRequestResponse) => {
      TabFetcher.getCurrentTab().then((tab: Tab) => {
        chrome.browserAction.setBadgeBackgroundColor({color: [59, 181, 74, 1]});
        chrome.browserAction.setBadgeText({text: messageResponse.getValue('offersCount').toString(), tabId: tab.id});
      });
    });

    chrome.browserAction.onClicked.addListener(() => {
      TabFetcher.getCurrentTab().then((tab: Tab) => {
        Message.send((messageRequest: MessageRequest) => {
          messageRequest
            .setType('click.popup')
            .setTab(tab)
        });
      });
    });

  }
}

export default Background
