<script lang="ts">
	import Vue from 'vue';
	import Component from 'vue-class-component';
    import { Prop } from 'vue-property-decorator';

	import CockpitRouter from '../../modules/CockpitRouter';
	import Message from '../../modules/chrome/message/MessageContent';
	import MessageRequest from '../../modules/chrome/message/structures/MessageRequest';
  import Tab = chrome.tabs.Tab;

  import TabListener from "../../modules/chrome/tab/TabListener";

	import FontAwesome from 'font-awesome/scss/font-awesome.scss';

	@Component({
		style: FontAwesome,
	})
	export default abstract class AbstractOfferSection extends Vue {
		@Prop(CockpitRouter) cockpitRouter!: CockpitRouter;

		createTab(url: string, active: boolean): void {
			Message.send((messageRequest: MessageRequest) => {
				messageRequest
					.setType('tab.create')
					.setValue('url', url)
					.setValue('active', active);
			});
		}

		generateCockpitUrl(route: string, params: any, utmContent: string = null): string {
			const url: string = this.cockpitRouter.getUrl(route, params);
			if (utmContent != null) {
				return this.cockpitRouter.setUtm(url, {
					source: 'addon',
					medium: 'addon',
					campaign: 'addon',
					content: utmContent,
				});
			}
			return url;
		}

    generatePicodiUrl(shopUrlName: string, id: number): string {
      const url: string = `https://www.picodi.com/pl/${shopUrlName}#cid=${id}`;

      return url;
    }

		// created(): void {
		// 	if (!(this.cockpitRouter instanceof CockpitRouter)) {
		// 		throw new Error('OfferSection requires prop CockpitRouter');
    //         }
    //     }
	}
</script>
