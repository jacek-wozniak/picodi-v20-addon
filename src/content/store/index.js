import Vue from "vue";
import Vuex from "vuex";
import offerSortModal from './modules/OfferSortModal'
import offerRemoveModal from './modules/OfferRemoveModal'
import offerNote from './modules/OfferNote'
import offerCode from './modules/OfferCode'
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    offerSortModal,
    offerRemoveModal,
    offerNote,
    offerCode
  }
});