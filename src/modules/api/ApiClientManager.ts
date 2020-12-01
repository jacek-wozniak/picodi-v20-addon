import ApiClient from "./ApiClient";
import CockpitRouter from "../CockpitRouter";
import ParameterManager from "../ParameterManager";

export default class ApiClientManager {
	private parameterManager: ParameterManager;
	private clients: { [key: string]: ApiClient };

	public constructor(parameterManager: ParameterManager) {
		this.parameterManager = parameterManager;
		this.clients = {};
	}

	public getClient(locale: string): ApiClient {
		if (!this.hasClient(locale)) {
			const cockpitRouter = new CockpitRouter('pl', this.parameterManager);
			const client = new ApiClient(cockpitRouter, '477c21b9ee5d27c5acf4e01ea5ca7083ab6943615e38174f56c0dab0d546631f');
			//const client = new ApiClient(cockpitRouter, this.parameterManager.get('cockpit.authorization'));
			this.setClient(locale, client);
		}
		return this.clients[locale];
	}

	private hasClient(locale: string): boolean {
		return this.clients.hasOwnProperty(locale);
	}

	private setClient(locale: string, client: ApiClient): void {
		this.clients[locale] = client;
	}
}
