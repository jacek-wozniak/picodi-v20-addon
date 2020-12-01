import RootContent from "../../RootContent";
import Tab = chrome.tabs.Tab;

export default abstract class AbstractSection {
	readonly rootContent: RootContent;

	public constructor(content: RootContent) {
		this.rootContent = content;
	}

	public static isMatched(dataSection: string): boolean {
		throw new Error(`Declare static isMatched method in ${this.name}`);
	}

	public getRoot(): RootContent {
		return this.rootContent;
	}

	public getDom(): HTMLDocument {
		return this.rootContent.getDom();
	}

	public getLocale(): string {
		return this.rootContent.getLocale();
	}

	public getTab(): Tab {
		return this.rootContent.getTab();
	}

	public abstract render(): void;
}
