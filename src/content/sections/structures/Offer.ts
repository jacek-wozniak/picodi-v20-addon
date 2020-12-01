class Offer {
	static TYPE_CODE = 'CODE';
	static TYPE_COUPON = 'COUPON';
	static TYPE_GIFTCARD = 'GIFTCARD';
	static TYPE_PROMO = 'PROMO';

	public id: number;
	public type: string;
	public title: string;
	public buttonLabel: string;
	public customBlockLabel: string;
	public code: string;
	public currency: string;
	public discount: string;
	public discountType: string;
	public description: string;
	public shopUrlName: string;

	constructor(data: any) {
		this.id = data.id;
		this.type = data.type;
		this.title = data.title;
		this.buttonLabel = data.buttonLabel;
		this.customBlockLabel = data.customBlockLabel;
		this.code = data.code;
		this.currency = data.currency;
		this.discount = data.discount;
		this.discountType = data.discountType;
		this.description = data.description;
		this.shopUrlName = data.shopUrlName;
	}
}

export default Offer