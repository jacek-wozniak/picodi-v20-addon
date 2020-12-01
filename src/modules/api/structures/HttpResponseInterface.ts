import { AxiosResponse, AxiosError } from "axios/index";

export default interface HttpResponseInterface {
	response: AxiosResponse;
	error: AxiosError;
}
