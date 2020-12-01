import LazyLoader from "../../LazyLoader";

export default abstract class AbstractDomHelper {
	protected readonly dom: HTMLDocument;

	public constructor(dom: HTMLDocument) {
		this.dom = dom;
	}

	public observeLazyLoad(selector: string): void {
		const lazyLoader = new LazyLoader(selector);
		lazyLoader.observe();
	}

	protected getUnique(classPrefix: string, places: number): string {
		let unique: string;
		let element: HTMLElement|null;
		do {
			unique = this.getRandom(places);
			element = this.dom.querySelector(`.${classPrefix}-${unique}`);
		} while(element != null);

		return unique;
	}

	protected getRandom(places: number): string {
		return Math.random().toString(36).substr(2, places);
	}
}
