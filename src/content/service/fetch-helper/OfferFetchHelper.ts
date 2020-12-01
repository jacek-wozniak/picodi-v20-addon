import Offer from "../../sections/structures/Offer";
import Message from "../../../modules/chrome/message/MessageContent";
import MessageRequest from "../../../modules/chrome/message/structures/MessageRequest";
import HttpResponse from "../../../modules/api/structures/HttpResponseContent";
import forEach from "lodash/forEach";
import map from "lodash/map";

class OfferFetchHelper {
  getOffersData(offers: Offer[], locale: string): any {
    const offerIds = map(offers, 'id');

    if (offerIds.length > 0) {
      return new Promise((resolve, reject) => {
        Message.send((messageRequest: MessageRequest) => {
          messageRequest
            .setType('offer.code')
            .setValue('locale', locale)
            .setValue('offerIds', offerIds)
            .setAsync(true)
            .setHttpResponseCallback((httpResponse: HttpResponse) => {
              if (httpResponse.isSuccessful()) {
                const response = httpResponse.getResponse();
                forEach(offers, (offer: Offer) => {
                  forEach(response.data.offers, (offerResponse: any) => {
                    if (offer.id === offerResponse.id) {
                      offer.code = offerResponse.code;
                      offer.note = offerResponse.note;
                      offer.finished = offerResponse.finished;
                    }
                  });
                });
                resolve(offers);
              } else {
                reject(httpResponse.getError());
              }
            });
        });
      });
    }
  }
}

export default new OfferFetchHelper()