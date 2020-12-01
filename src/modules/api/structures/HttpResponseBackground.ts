import { AxiosResponse, AxiosError } from "axios/index";

export default class HttpResponseBackground {
	private response: AxiosResponse;
	private error: AxiosError;

	public setResponse(response: AxiosResponse): void {
		this.response = response;
	}

	public setError(error: AxiosError): void {
		this.error = error;
	}
}
