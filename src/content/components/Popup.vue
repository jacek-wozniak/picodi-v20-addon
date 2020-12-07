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
          <i class='icon-svg icon-svg--close icon-svg--black'></i>
        </div>


      </div>

      <div v-if="offers.length > 0" class="a-offers">
        <div v-for="offer in offers" :key="offer.id" class="a-offer">

          <div v-bind:class="[offer.type === 'CODE' ? 'a-discount--code' : 'a-discount--promo', 'a-offer__discount a-discount']">
            <span class="a-discount__value" v-if="offer.discount && offer.discount > 0">{{offer.discount+' '+offer.currency}}</span>
            <span class="a-discount__value" v-else>
              <i class='icon-svg' :class="['icon-svg--'+offer.discountType.toLowerCase(), {'icon-svg--red': offer.type==='CODE', 'icon-svg--orange': offer.type!=='CODE'}]"></i>
            </span>
            <div class="a-discount__caption">{{offer.discountType}}</div>
          </div>

          <h2 class="a-offer__title">{{ offer.title }}</h2>
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
        <button class="a-app__footer__icon a-search">
          <i class='icon-svg icon-svg--search icon-svg--black'></i>
          Wyszukaj
        </button>
        <button class="a-app__footer__icon a-settings">
            <i class='icon-svg icon-svg--settings icon-svg--black'></i>
            Ustawienia
        </button>
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

      &__icon {
        display: flex;
        align-items: center;
        cursor: pointer;
        border: 0;
        outline: 0;
        background-color: white;
        padding: 4px 8px;

        &:hover {
          color: #000000;

          & > .icon-svg {
            background-color: #000000;
          }
        }

        & > .icon-svg {
          min-width: 20px;
          min-height: 20px;
          margin-right: 8px;
        }
      }
    }

    &__search {
      cursor: pointer;
    }

    &__settings {
      cursor: pointer;
    }
  }

  .a-offers{
    padding-left: 8px;
    margin: 24px 0;
    overflow-y: auto;
    height: calc(100% - 128px);

    &::-webkit-scrollbar-track {
      background-color: $white-color;
      border-right: 16px solid $grey-color;
      border-left: 12px solid $grey-color;
    }
    &::-webkit-scrollbar {
      width: 33px;
      background-color: $grey-color;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #565A5C;
      border-right: 16px solid $grey-color;
      border-left: 12px solid $grey-color;
    }
    .br-top {
      border-radius: 4px 4px 0 0;
    }
  }

  .a-offer{
    background: $white-color;
    border-radius: 3px;
    padding: 16px 16px 24px;

    &:not(:first-child) {
      margin-top: 16px;
    }

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

    &:hover,
    &:focus {
      background-color: #236B2C;
    }

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

      &:hover {
        background-color: white;

        &:before {
          background-color: #236B2C;
          width: 80%;
        }

        &::after {
          left: 80%;
        }
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
    display: flex;
    justify-content: flex-end;

    & > .icon-svg {
      margin: 3px;
      min-height: 20px;
      min-width: 20px;
      cursor: pointer;

      &:hover {
        background-color: #000000;
      }
    }
  }

  .a-search{
    font-size: 16px;
    line-height: 16px;
  }

  .a-settings{
    font-size: 16px;
    line-height: 16px;
  }

  .icon-svg {
    display: block;
    -webkit-mask-position: center;
    -webkit-mask-repeat: no-repeat;
    min-width: 30px;
    min-height: 30px;

    &--value {
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50'%3E%3Cpath d='M50 3.9c0-.3-.1-1.7-1.3-2.8C47.6.1 46.3 0 46 0H28.5c-.9-.1-1.9.3-2.6 1L1 25.9c-.6.6-1 1.5-1 2.4s.4 1.8 1 2.4L19.3 49c.7.7 1.5 1 2.4 1s1.7-.3 2.4-1L49 24.1c.7-.7 1-1.6 1-2.6V3.9zm-7.2 9a3.98 3.98 0 0 1-5.7 0 3.98 3.98 0 0 1 0-5.7 3.98 3.98 0 0 1 5.7 0 3.98 3.98 0 0 1 0 5.7z'/%3E%3C/svg%3E");
    }

    &--percent {
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 25 25'%3E%3Cpath d='M21.3 1.3l-7.5 7.5 2.5 2.5L25 2.5V1.3M5 22.5c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5m0-15C3.6 7.5 2.5 6.4 2.5 5S3.6 2.5 5 2.5 7.5 3.6 7.5 5 6.4 7.5 5 7.5M9.6 7c.2-.6.4-1.3.4-2a4.95 4.95 0 0 0-5-5 4.95 4.95 0 0 0-5 5 4.95 4.95 0 0 0 5 5c.7 0 1.4-.2 2-.4l3 2.9-3 2.9c-.6-.2-1.3-.4-2-.4a4.95 4.95 0 0 0-5 5 4.95 4.95 0 0 0 5 5 4.95 4.95 0 0 0 5-5c0-.7-.2-1.4-.4-2l2.9-3 8.8 8.8H25v-1.3L9.6 7z' /%3E%3C/svg%3E");
    }

    &--free_delivery {
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 35 25.5'%3E%3Cpath d='M3.2 0C1.4 0 0 1.4 0 3.2v17.5h3.2c0 2.6 2.1 4.8 4.8 4.8s4.8-2.1 4.8-4.8h9.5c0 2.6 2.1 4.8 4.8 4.8s4.8-2.1 4.8-4.8H35v-8l-4.8-6.4h-4.8V0m.1 8.8h4l3.1 4h-7.1M8 18.3c1.3 0 2.4 1.1 2.4 2.4S9.3 23.1 8 23.1 5.6 22 5.6 20.7s1-2.4 2.4-2.4m19 0c1.3 0 2.4 1.1 2.4 2.4s-1.1 2.4-2.4 2.4-2.4-1.1-2.4-2.4 1.1-2.4 2.4-2.4z'/%3E%3C/svg%3E");
    }

    &--gift {
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24.6 25.3'%3E%3Cpath d='M17.9 7.2l1.1-.6c1.2-.9 1.8-1.9 1.8-3 0-.9-.4-2.1-1-2.7-.7-.6-1.5-.9-2.3-.9-.9 0-1.8.3-2.5.8-1.1.7-2 2.3-2.6 3.5 0 .1-.1.1-.1.2-.2-.5-.5-1.4-.8-1.8C11 2 10.4 1.3 9.6.8 8.9.3 8.1 0 7.1 0c-.9 0-1.7.4-2.3 1-.7.6-1.1 1.9-1.1 2.8 0 .5.2 1.1.5 1.6.4.7 1.1 1.2 2 1.7 2.2.8 4 1 5.3 1.1h1.7c1.2 0 2.9-.1 4.7-1zm-3.4-3c.4-.6.9-1.6 1.4-1.9s1-.5 1.5-.5h0c.4 0 .8.2 1.1.4.3.3.4.7.4 1 0 .4-.2 1.3-1.1 1.9s-2.3 1.3-4.6 1.7c.3-.9.7-1.8 1.3-2.6zM6.6 5.4c-.5-.3-.8-.6-.9-.9-.2-.3-.2-.7-.2-1 0-.4.2-1 .5-1.4.3-.3.8-.5 1.2-.5h0c.5 0 1 .2 1.5.5.8.5 1.5 1.9 2 2.9.3.5.5 1 .6 1.6-2.4-.1-3.9-.7-4.7-1.2zM1.7 15.9h9.6v9.4H1.7zm11.4 9.4H23v-9.4h-9.9zM0 14.1h11.3v-5H0zm24.6-5H13.1v5h11.5v-5z'/%3E%3C/svg%3E");
    }

    &--close {
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100%' width='100%' viewBox='2 2 20 20' xmlns:v='https://vecta.io/nano'%3E%3Cpath d='M19 6.4L17.6 5 12 10.6 6.4 5 5 6.4l5.6 5.6L5 17.6 6.4 19l5.6-5.6 5.6 5.6 1.4-1.4-5.6-5.6z'/%3E%3C/svg%3E");
    }

    &--search {
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100%' width='100%' viewBox='2.7 2.7 18 18' xmlns:v='https://vecta.io/nano'%3E%3Cpath d='M15.5 14h-.8l-.28-.27A6.47 6.47 0 0 0 16 9.5a6.5 6.5 0 1 0-13 0A6.5 6.5 0 0 0 9.5 16a6.47 6.47 0 0 0 4.23-1.57l.27.28v.8l5 5 1.5-1.5-5-5zm-6 0C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14z'/%3E%3C/svg%3E");
    }

    &--settings {
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100%' width='100%' viewBox='2.7 2.7 18 18' xmlns:v='https://vecta.io/nano'%3E%3Cpath d='M15.5 14h-.8l-.28-.27A6.47 6.47 0 0 0 16 9.5a6.5 6.5 0 1 0-13 0A6.5 6.5 0 0 0 9.5 16a6.47 6.47 0 0 0 4.23-1.57l.27.28v.8l5 5 1.5-1.5-5-5zm-6 0C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14z'/%3E%3C/svg%3E");
    }

    &--black {
      background-color: #3B3030;
    }

    &--white {
      background-color: #FFFFFF;
    }

    &--orange {
      background-color: #FF7F32;
    }

    &--red {
      background-color: #E5161E;
    }
  }
</style>
