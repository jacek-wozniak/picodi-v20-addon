import forEach from "lodash/forEach";
import ParameterManager from "../../modules/ParameterManager";

export default class SiteDeterminer {
	private readonly url: string;
	private readonly dom: HTMLDocument;
	private readonly picodiUrls: string[];

	constructor(url: string, dom: HTMLDocument) {
		this.url = url;
		this.dom = dom;
	//	this.picodiUrls = parameterManager.get('picodi.urls');
	}

	public getUrlLocale(): string | null {
		let path = this.getPath();
		if (path !== null) {
			let pathParts = path.split('/');
			return pathParts[0];
		}
		return null;
	}

	public getPath(): string | null {
		let urlBeginning = this.findUrlBeginning();
		if (urlBeginning !== null) {
			return this.url.replace(urlBeginning, '');
		}
		return null;
	}

	private findUrlBeginning(): string | null {
		let urlBeginning = null;
		// forEach(this.picodiUrls, (url) => {
		// 	if (this.url.indexOf(url) === 0) {
		// 		urlBeginning = url;
		// 		return false;
		// 	}
		// });
		return urlBeginning;
	}

	public getSection(): string {
		let bodyElement = this.dom.querySelector('body');
		if (!bodyElement) {
			throw new Error('Unable to find element body!');
		}
		if (!bodyElement.dataset.hasOwnProperty('section')) {
			throw new Error('Unable to get data-section from body!');
		}
		return bodyElement.dataset.section;
	}
}
