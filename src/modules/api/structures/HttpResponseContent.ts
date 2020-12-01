import { AxiosResponse, AxiosError } from "axios/index";
import HttpResponseInterface from "./HttpResponseInterface";

export default class HttpResponseContent {
	private response: AxiosResponse;
	private error: AxiosError = null;

	public constructor(httpResponse: HttpResponseInterface) {
		this.response = httpResponse.response;
		if (httpResponse.error) {
			this.error = httpResponse.error;
			this.response = httpResponse.error.response;
		}
	}

	public getResponse(): AxiosResponse {
		return this.response;
	}

	public getError(): null|AxiosError {
		return this.error;
	}

	public isSuccessful(): boolean {
		return this.error === null;
	}

	public isFailed(): boolean {
		return this.error !== null;
	}
}
