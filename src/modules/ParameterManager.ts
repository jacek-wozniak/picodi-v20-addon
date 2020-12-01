class ParameterManager {
	private configs: any;

	constructor(configs: any) {
		this.configs = configs;
	}

	public get(key: string): any {
		const keyParts = key.split('.');
		let value = this.configs;
		keyParts.forEach((keyPart) => {
			value = value[keyPart];
		});
		return value;
	}

	public getConfigs(): any {
		return this.configs;
	}
}

export default ParameterManager
