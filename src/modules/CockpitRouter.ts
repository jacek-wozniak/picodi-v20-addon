import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import ParameterManager from './ParameterManager';
import urlParam from './UrlParam';
import routing from '../config/routing';

class CockpitRouter {
  private locale: string;
  private domain: string = null;
  private protocol: string;
  private parameterManager: ParameterManager;

  constructor(locale: string, parameterManager: ParameterManager) {
    this.locale = locale;
    this.parameterManager = parameterManager;
    this.protocol = 'http';
    //this.protocol = parameterManager.get('cockpit.protocol');
    this.determineDomain();
  }

  private determineDomain(): void {
    let hosts =  {
      "ap1": {
        "domain": "api-ap1-a.itg.picodi.com",
        "locales": [
          "au",
          "hk",
          "id",
          "in",
          "my",
          "nz",
          "ph",
          "pk",
          "sa",
          "sg",
          "th",
          "vn"
        ]
      },
      "ec1": {
        "domain": "api-ec1-a.itg.picodi.com",
        "locales": [
          "at",
          "by",
          "ch",
          "cz",
          "de",
          "fi",
          "hu",
          "kz",
          "pl",
          "ro",
          "ru",
          "sk",
          "tr",
          "ua"
        ]
      },
      "ew1": {
        "domain": "api-ew1-a.itg.picodi.com",
        "locales": [
          "ae",
          "es",
          "gr",
          "ie",
          "it",
          "ng",
          "pt",
          "se",
          "uk",
          "za"
        ]
      },
      "sa1": {
        "domain": "api-sa1-a.itg.picodi.com",
        "locales": [
          "ar",
          "br",
          "cl",
          "co",
          "mx",
          "pe"
        ]
      },
      "us1": {
        "domain": "api-us1-a.itg.picodi.com",
        "locales": [
          "ca",
          "us"
        ]
      }
    };
    forEach(hosts, host => {
      forEach(host.locales, locale => {
        if (this.locale === locale) {
          this.domain = host.domain;
          return false;
        }
      });
      if (this.domain) {
        return false;
      }
    });
  }

  public getUrl(key: string, params: any = null): string {
    const path: string = this.getPath(key, params);
    return `${this.protocol}://${this.domain}/api/pl${path}`; //TODO LOCALE
  }

  public getPath(key: string, params: any = null): string {
    if (!routing.cockpit.hasOwnProperty(key)) {
      throw new Error(`Unable to find route "${key}"!`);
    }
    return routing.cockpit[key](params);
  }

  public setUtm(url: string, params: any): string {
    let urlWithParams: string = url;
    if (isObject(params)) {
      const utmParams = {};
      forEach(params, (value, key) => {
        utmParams[`utm_${key}`] = value;
      });
      let paramQuery = urlParam(utmParams);
      if (paramQuery) {
        urlWithParams += (url.indexOf('?') < 0 ? '?' : '&') + paramQuery;
      }
    }
    return urlWithParams;
  }

  public hasDomain(): boolean {
    return !isEmpty(this.domain);
  }

  public getDomain(): string | null {
    return this.domain;
  }
}

export default CockpitRouter;
