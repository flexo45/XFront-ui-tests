import {DbDepositories} from './data-access/db.depositories';
import {AttachExchangeRequest} from '../../src/app/api/models/attach-exchange-request';
import {DepositoryTestContext} from './app.test-fixture';
import {AttachWalletRequest} from '../../src/app/api/models/attach-wallet-request';
import {DepositoryResponseModel} from './data-access/db.model';

export class DepositoriesService {

  constructor(private dbDepositories: DbDepositories) {

  }

  public async createUserDepository(userId: string, name: string, depositoryId: string): Promise<string> {
    return await this.dbDepositories.insertUserDepository(name, depositoryId, userId);
  }

  public async attachExchangeToUser(userId: string, exchange: AttachExchangeRequest): Promise<DepositoryTestContext> {
    const userDepositoryId = await this.dbDepositories.insertExchangeDepository({
      exchange: exchange.exchange,
      name: exchange.name,
      apiKey: exchange.apiKey,
      apiSecret: exchange.apiSecret,
      apiPassphrase: exchange.apiPassphrase === undefined ? null : exchange.apiPassphrase
    }, userId);

    if (!userDepositoryId)
      throw new Error('Exchange attach failed');

    const addedDepository = (await this.dbDepositories.selectAllDepositoryByUserId(userId))
      .find(x => x.id === userDepositoryId);

    return {
      id: addedDepository.id,
      name: addedDepository.name,
      exchange: addedDepository.exchange,
      currencies: []
    };
  }

  public async attachWalletToUser(userId: string, wallet: AttachWalletRequest): Promise<DepositoryTestContext> {
    const userDepositoryId = await this.dbDepositories.insertWalletDepository({
      blockchain: wallet.blockchain,
      name: wallet.name,
      addressInBlockchain: wallet.addressInBlockchain
    }, userId);

    if (!userDepositoryId)
      throw new Error('Wallet attach failed');

    const addedDepository = (await this.dbDepositories.selectAllDepositoryByUserId(userId))
      .find(x => x.id === userDepositoryId);

    return {
      id: addedDepository.id,
      name: addedDepository.name,
      blockchain: addedDepository.blockchain,
      currencies: []
    };
  }

  public async getDepositoryList(userId: string): Promise<DepositoryResponseModel[]> {
    return await this.dbDepositories.selectAllDepositoryByUserId(userId);
  }

  public async isDepositoryExist(depositoryId: string): Promise<boolean> {
    return (await this.dbDepositories.selectDepositoryById(depositoryId)) !== undefined;
  }

  public async getExchangeId(exchangeApiKey: string): Promise<string> {
    const exchange = await this.dbDepositories.selectDepositoryByExchangePublicKey(exchangeApiKey);
    if (exchange)
      return exchange.id;
  }

  public async getWalletId(address: string): Promise<string> {
    const wallet = await this.dbDepositories.selectDepositoryByBlockchainAddress(address);
    if (wallet)
      return wallet.id;
  }

  public async isUserDepositoryExist(userDepositoryId: string): Promise<boolean> {
    return (await this.dbDepositories.selectUserDepositoryById(userDepositoryId)) !== undefined;
  }

}
