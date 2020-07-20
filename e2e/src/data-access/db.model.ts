import {DepositoryResponse} from '../../../src/app/api/models/depository-response';
import {PortfolioDepositoryCurrencyInfo} from '../../../src/app/api/models/portfolio-depository-currency-info';

export class UserDepositoryDb {

  constructor() {
    this.id = '';
    this.name = '';
    this.depositoryId = '';
    this.userId = '';
  }

  id: string;
  name: string;
  depositoryId: string;
  userId: string;

}

export class DepositoryDb {

  constructor() {
    this.id = '';
    this.type = 0;
    this.status = 0;
    this.exchange = 0;
    this.exchangePublicKey = '';
    this.blockchain = 0;
    this.addressInBlockchain = '';
    this.apiPassphrase = '';
    this.exchangePrivateKey = '';
  }

  id: string;
  status: number;
  type: number;
  addressInBlockchain: string;
  blockchain: number;
  exchange: number;
  exchangePublicKey: string;
  apiPassphrase: string;
  exchangePrivateKey: string;
}

export class DepositoryResponseModel implements DepositoryResponse {

  constructor() {
    this.id = '';
    this.name = '';
    this.type = 0;
    this.status = 0;
    this.exchange = 0;
    this.exchangePublicKey = '';
    this.blockchain = 0;
    this.addressInBlockchain = '';

    this.apiPassphrase = '';
    this.exchangePrivateKey = '';
    this.depositoryId = '';
  }

  addressInBlockchain: string;
  blockchain: number;
  exchange: number;
  exchangePublicKey: string;
  id: string;
  name: string;
  status: number;
  type: number;

  apiPassphrase: string;
  exchangePrivateKey: string;
  depositoryId: string;
}

export class PortfolioDepositoryCurrencyInfoModel implements PortfolioDepositoryCurrencyInfo {

  constructor() {
    this.currencyId = '';
    this.balance = 0;
    this.amount = 0;
    this.proportion = 0;
  }

  amount: number;
  balance: number;
  currencyId: string;
  proportion: number;

}

export class CurrencyInfoModel {
  constructor() {
    this.id = '';
    this.name = '';
    this.ticker = '';
    this.priceUsd = 0;
    this.imageUrl = '';
    this.convertibleIconUrl = '';
  }

  id: string;
  name: string;
  ticker: string;
  priceUsd: number;
  imageUrl: string;
  convertibleIconUrl: string;
}

export class DepositoryCurrencyInfoModel extends CurrencyInfoModel {
  constructor() {
    super();
    this.amount = 0;
  }
  amount: number;
}

export class AlertDb {
  constructor() {
    this.id = '';
    this.userId = '';
    this.currencyId = '';
    this.value = 0;
    this.isDisabled = false;
    this.isDeleted = false;
    this.isRepeating = false;
  }
  id: string;
  userId: string;
  currencyId: string;
  value: number;
  isDisabled: boolean;
  isDeleted: boolean;
  isRepeating: boolean;
}

export class NotificationDb {
  constructor() {
    this.id = '';
    this.currencyId = '';
    this.value = 0;
    this.currencyUsdPrice = 0;
    this.userId = '';
    this.alertId = '';
    this.date = new Date();
    this.isRead = false;
  }

  id: string;
  currencyId: string;
  value: number;
  currencyUsdPrice: number;
  userId: string;
  alertId: string;
  date: Date;
  isRead: boolean;
}

