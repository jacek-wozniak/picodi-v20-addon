<template>
  <div v-if="offers" v-bind:style="isDisabled ? {'display': 'none'} : {'display': 'block'}" class="a-app" id="picodi-app">

    <div class="a-app__container">
      <div class="a-app__header">
        <div class="a-logo">
          <img class="a-logo__img" src="https://cdn.picodi.com/assets/v20/images/logo.svg" alt="Picodi" />
        </div>

        <div v-if="shopName" class="a-shop-name">
          {{ shopName }}
        </div>

        <div v-on:click="closeApp()" class="a-close-app">
          X
        </div>


      </div>

      <div v-if="offers.length > 0" class="a-offers">
        <div v-for="offer in offers" :key="offer.id" class="a-offer">

          <div v-bind:class="[offer.type === 'CODE' ? 'a-discount--code' : 'a-discount--promo', 'a-offer__discount a-discount']">
            <span class="a-discount__value">{{offer.discount}} {{offer.currency}}</span>
            <div class="a-discount__caption">{{offer.discountType}}</div>
          </div>

          <h2 class="a-offer__title">{{ offer.title }}</h2>
          <a href="#" class="a-offer__more">Zobacz więcej</a>
          <div class="a-offer__description">{{ offer.description }}</div>

          <button v-if="offer.type === 'CODE'" v-on:click.left="openPicodiModal(true, offer.shopUrlName, offer.id)"
                  v-on:click.middle="openPicodiModal(false, offer.shopUrlName, offer.id)" class="a-offer__btn a-btn a-btn--code">
            <span class="a-btn__label">
              {{ offer.buttonLabel }}
            </span>
            <span class="a-btn__code">{{offer.code}}</span>
          </button>

          <button v-else v-on:click.left="openPicodiModal(true, offer.shopUrlName, offer.id)"
                  v-on:click.middle="openPicodiModal(false, offer.shopUrlName, offer.id)"  class="a-offer__btn a-btn">
            {{ offer.buttonLabel }}
          </button>

        </div>
      </div>
      <div v-else>
        WYSZUKIWARKA
      </div>


      <div class="a-app__footer">
        <div class="a-search">Wyszukaj</div>
        <div class="a-settings">Ustawienia</div>
      </div>

    </div>

    <div class="a-app__blur"></div>

  </div>
</template>


<script lang="ts">
  import Component from "vue-class-component";
  import AbstractOfferSection from './AbstractOfferSection';
  import Message from "../../modules/chrome/message/MessageContent";
  import MessageRequest from "../../modules/chrome/message/structures/MessageRequest";
  import HttpResponse from "../../modules/api/structures/HttpResponseContent";
  import Offer from "../sections/structures/Offer";
  import 'reset-css';

  @Component()
  export default class Popup extends AbstractOfferSection {
    offers: Array<Offer> = [];
    shopName: string;
    isDisabled: boolean = true;

    messageText: string = null;

    getOfferList(): void {
      Message.send((messageRequest: MessageRequest) => {
        messageRequest
          .setType('api.recognize')
          .setAsync(true)
          .setValue('locale', 'pl')
          .setHttpResponseCallback((httpResponse: HttpResponse) => {
            if (httpResponse.isSuccessful()) {
              const response = httpResponse.getResponse();

              if(response.data.data.offers.length > 0){
               this.sendOfferCounter(response.data.data.offers.length);

                this.shopName = response.data.data.shop;
                response.data.data.offers.forEach((offer: Offer) => {
                  this.offers.push(new Offer(offer));
                });
              }
            }else{
              const response = httpResponse.getResponse();
              this.messageText = `[${response.status}] ${response.data.error.msg}`;
            }
          });
      });
    }

    sendOfferCounter(offerCounter: number){
      Message.send((messageRequest: MessageRequest) => {
        messageRequest
          .setType('offers.counter')
          .setValue('offersCount', offerCounter);
      });
    }

    openPicodiModal(active: boolean,shopUrlName: string, id: number): void {
      const url: string = this.generatePicodiUrl(shopUrlName, id);

      this.createTab(url, active);
    }

    closeApp(){
      this.isDisabled = !this.isDisabled;
    }

    mounted(): void {
      this.getOfferList();
    }
  }

</script>

<style>
  #picodi-app{
    display: none;
  }

</style>

<style lang="scss" scoped>
  $white-color: #FFFFFF;
  $grey-color: #F2F1F1;
  $black-color: #3B3030;

  *, *:before, *:after{
    font-family:'Noto Sans', 'Roboto', 'Arial', sans-serif !important;
    font-weight: 400;
    box-sizing: border-box;
    letter-spacing: normal;
  }

  ul, ol{
    margin:0;
    list-style: none;
  }

  .a-app{
    &__container{
      position: fixed;
      top:35px;
      right: 35px;
      background: $grey-color;
      height: 650px;
      width: 430px;
      z-index: 99999999;
      box-shadow: 0 3px 30px #0000004D;
    }

    &__blur{
      backdrop-filter: blur(2px);
      position: fixed;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vw;
      content: '';
      z-index: 9999;
    }

    &__header{
      height: 52px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: $white-color;
      padding: 0 16px;
    }

    &__footer{
      height: 52px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: $white-color;
      padding: 0 16px;
      margin-top: 24px;
    }
  }

  .a-offers{
    padding: 8px 16px 0;
    overflow: scroll;
    height: calc(100% - 128px);
  }

  .a-offer{
    background: $white-color;
    border-radius: 3px;
    margin-top: 16px;
    padding: 16px 16px 24px;

    &__title{
      color: $black-color;
      font-size: 16px;
      line-height: 16px;
    }

    &__more{
      color: #565A5C;
      font-size: 12px;
      text-decoration: underline;
    }

    &__description{
      display: none;
    }
  }

  .a-discount{
    box-shadow: inset 0 0 0 1px #CECECE;
    border-radius: 4px;
    height: 97px;
    width: 85px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    overflow: hidden;
    float: left;
    margin-right: 12px;
    margin-bottom: 16px;

    &__value{
      align-self: flex-end;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: 0.24px;
    }

    &__caption{
      text-transform: uppercase;
      color: #fff;
      align-self: flex-end;
      width: 100%;
      line-height: 100%;
      padding: 5px 0;
      font-weight: 600;
      text-align: center;
      font-size: 10px;
    }

    &--code{
      color: #e5161e;

      .a-discount__caption{
        background: #e5161e;
      }
    }

    &--promo{
      color: #ff7f32;

      .a-discount__caption{
        background: #ff7f32;
      }
    }
  }

  .a-btn{
    clear: both;
    display: block;
    height: 45px;
    width: 100%;
    position: relative;
    font-size: 14px;
    font-weight: 600;
    line-height: 19px;
    letter-spacing: -.01em;
    background-color: #39b54a;
    color: #fff;
    border-radius: 30px;
    border: 0;
    user-select: none;
    outline: none;

    &--code{
      background: $white-color;

      &:before{
        content: "";
        position: absolute;
        width: 85%;
        height: 100%;
        left: 0;
        top: 0;
        border-top-left-radius: 30px;
        border-bottom-left-radius: 30px;
        transition: width .2s ease-out;
        z-index: 5;
        background-color: #39b54a;
      }
      &:after{
        border-color: transparent transparent transparent #2e8d3a;
        left: 85%;
        top: 0;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 48px 0 0 35px;
        transform: rotate(17deg);
        transition: left .2s ease-out;
        transform-origin: top left;
        content: "";
        position: absolute;
        z-index: 5;
        display: block;
      }
    }

    &__label{
      width: 100%;
      position: absolute;
      z-index: 10;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }

    &__code{
      background-color: initial;
      border: 1px solid #cecece;
      position: absolute;
      top: 0;
      left: 0;
      text-align: right;
      padding: 0 16px;
      width: 100%;
      height: 100%;
      line-height: 45px;
      z-index: 0;
      color: #000;
      border-radius: 30px;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: -.01em;
    }
  }

  .a-logo{
    flex:1;
    &__img{
      height: 31px !important;
    }
  }

  .a-shop-name{
    font-size: 16px;
    line-height: 16px;
    flex:1;
    text-align: center;
  }

  .a-close-app{
    flex:1;
    text-align: right;
    cursor: pointer;
  }

  .a-search{
    font-size: 16px;
    line-height: 16px;
  }

  .a-settings{
    font-size: 16px;
    line-height: 16px;
  }

</style>
