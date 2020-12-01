import isFunction from "lodash/isFunction";
import CreateProperties = chrome.tabs.CreateProperties;
import Tab = chrome.tabs.Tab;

class TabBuilder {
  private properties: CreateProperties = {};

  public setUrl(url: string): TabBuilder {
    this.properties.url = url;
    return this;
  }

	public setWindowId(windowId: number): TabBuilder {
    this.properties.windowId = windowId;
		return this;
	}

	public setIndex(index: number): TabBuilder {
    this.properties.index = index;
		return this;
	}

	public setActive(active: boolean): TabBuilder {
    this.properties.active = active;
		return this;
	}

	public setPinned(pinned: boolean): TabBuilder {
    this.properties.pinned = pinned;
		return this;
	}

	public setOpenerTabId(tabId: number): TabBuilder {
    this.properties.openerTabId = tabId;
		return this;
	}

	/**
	 * @deprecated since Chrome 33, use setActive
	 */
	public setSelected(selected: boolean): TabBuilder {
    this.properties.selected = selected;
		return this;
	}

	public createTab(callback: Function = null): Promise<Tab> {
		return new Promise((resolve) => {
		  chrome.tabs.create(this.properties, (tab: Tab) => {
        if (isFunction(callback)) {
        	callback(tab);
				}
				resolve(tab);
      });
		});
  }
}

export default TabBuilder
