import urlParam from '../modules/UrlParam';

export default {
  cockpit: {
    'api.offers.recognize': function(params) {
      return `/addon/recognize?url=${params.domain}`;
    },
    'api.addon.install': function(params) {
      return `/addon/install?installationId=${params.installationId}`;
    },
  },
};