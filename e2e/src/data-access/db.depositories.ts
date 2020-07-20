import { DbClient } from './db.client';
import {DepositoryCurrencyInfoModel, DepositoryDb, DepositoryResponseModel, UserDepositoryDb} from './db.model';
import {AttachExchangeRequest} from '../../../src/app/api/models/attach-exchange-request';
import {AttachWalletRequest} from '../../../src/app/api/models/attach-wallet-request';

export class DbDepositories {

  constructor(
    private dbClient: DbClient = DbClient.getInstance()) {
  }

  public async addCurrenciesBalancesToDepository(userDepositoryId: string, currenciesIdAndAmount: [string, number][]) {
    await this.dbClient.executeTx(async (client) => {
      const { rows } = await client.query(`select "DepositoryId" from "UserDepositories" where "Id" = $1`, [userDepositoryId]);
      for (const el of currenciesIdAndAmount) {
        if (el !== undefined) {
          await client.query(`insert into "CurrencyBalances" ("Id", "DepositoryId", "CurrencyId", "Amount")
      VALUES (uuid_generate_v4(), $1, $2, $3)`, [rows[0].DepositoryId, el[0], el[1]]);
        }
      }
      return '';
    });
  }

  public async insertExchangeDepository(exchangeRequest: AttachExchangeRequest, userId: string): Promise<string> {
    const guidDepository = await this.dbClient.getGuid();
    const guidUserDepository = await this.dbClient.getGuid();
    return await this.dbClient.executeTx(async (client) => {
      await client.query(`insert into "Depositories" ("Id", "Type", "LastSyncDate", "SyncStatus", "ErrorCode", "Blockchain",
      "AddressInBlockchain", "AdditionalBlockchainData", "Exchange", "ExchangePublicKey", "ExchangePrivateKey", "NextSyncDate", "ApiPassphrase")
      values ($1, 1, to_date('01/01/0001', 'DD/MM/YYYY'), 1, 0, 0, null, null, $2, $3, $4, to_date('01/01/0001', 'DD/MM/YYYY'), $5)`,
        [guidDepository, exchangeRequest.exchange, exchangeRequest.apiKey, exchangeRequest.apiSecret, exchangeRequest.apiPassphrase]);
      await client.query(`insert into "UserDepositories" ("Id", "UserId", "Name", "DepositoryId")
        values ($1, $2, $3, $4)`, [guidUserDepository, userId, exchangeRequest.name, guidDepository]);
      return guidUserDepository;
    });
  }

  public async insertUserDepository(name: string, depositoryId: string, userId: string): Promise<string> {
    const guidUserDepository = await this.dbClient.getGuid();
    await this.dbClient.execute(`insert into "UserDepositories" ("Id", "UserId", "Name", "DepositoryId")
        values ($1, $2, $3, $4)`, [guidUserDepository, userId, name, depositoryId]);
    return guidUserDepository;
  }

  public async insertWalletDepository(walletRequest: AttachWalletRequest, userId: string): Promise<string> {
    const guidDepository = await this.dbClient.getGuid();
    const guidUserDepository = await this.dbClient.getGuid();
    return await this.dbClient.executeTx(async (client) => {
      await client.query(`insert into "Depositories" ("Id", "Type", "LastSyncDate", "SyncStatus", "ErrorCode", "Blockchain",
      "AddressInBlockchain", "AdditionalBlockchainData", "Exchange", "ExchangePublicKey", "ExchangePrivateKey", "NextSyncDate", "ApiPassphrase")
      values ($1, 2, to_date('01/01/0001', 'DD/MM/YYYY'), 1, 0, $2, $3, null, 0, null, null,
      to_date('01/01/0001', 'DD/MM/YYYY'), null)`, [guidDepository, walletRequest.blockchain, walletRequest.addressInBlockchain]);
      await client.query(`insert into "UserDepositories" ("Id", "UserId", "Name", "DepositoryId")
        values ($1, $2, $3, $4)`, [guidUserDepository, userId, walletRequest.name, guidDepository]);
      return guidUserDepository;
    });
  }

  public async selectCurrenciesOfDepository(userDepositoryId: string): Promise<DepositoryCurrencyInfoModel[]> {
    return await this.dbClient.selectT<DepositoryCurrencyInfoModel>(new DepositoryCurrencyInfoModel(),
      `select t2.*, t1."Amount" from "CurrencyBalances" t1, "Currencies" t2 where t1."CurrencyId" = t2."Id"
      and "DepositoryId" = (select "UserDepositories"."DepositoryId" from "UserDepositories" where "UserDepositories"."Id" = $1)`, [userDepositoryId]);
  }

  public async updateStateOfDepository(userDepositoryId: string, state: DepositoryState) {
    if (state === DepositoryState.InProgress) {
      await this.dbClient.executeTx(async (client) => {
        await client.query(`update "Depositories" set "SyncStatus" = $2, "LastSyncDate" = to_date('01/01/0001', 'DD/MM/YYYY'),
          "NextSyncDate" = to_date('01/01/0001', 'DD/MM/YYYY') where "Id" =
          (select "DepositoryId" from "UserDepositories" where "UserDepositories"."Id" = $1)`, [userDepositoryId, convertState(state)]);
        return '';
      });
    } else {
      await this.dbClient.execute(`update "Depositories" set "SyncStatus" = $2, "LastSyncDate" = now(), "NextSyncDate" = now()
        where "Id" = (select "DepositoryId" from "UserDepositories" where "UserDepositories"."Id" = $1)`,
        [userDepositoryId, convertState(state)]);
    }
  }

  public async selectAllDepositoryByUserId(userId: string): Promise<DepositoryResponseModel[]> {
    return await this.dbClient.selectT<DepositoryResponseModel>(new DepositoryResponseModel(), `select t2."Id", "Name", "Type", "SyncStatus" as status,
      "AddressInBlockchain", "ExchangePublicKey", "Exchange", "Blockchain", "ApiPassphrase", "ExchangePrivateKey", t1."Id" as depositoryId
      from "Depositories" t1, "UserDepositories" t2 where t1."Id" = t2."DepositoryId" and "UserId" = $1`, [userId]);
  }

  public async selectDepositoryById(depositoryId: string): Promise<DepositoryDb> {
    return await this.dbClient.selectOneT<DepositoryDb>(new DepositoryDb(),
      `select * from "Depositories" where "Id" = $1`, [depositoryId]);
  }

  public async selectDepositoryByExchangePublicKey(exchangePublicKey: string): Promise<DepositoryDb> {
    return await this.dbClient.selectOneT<DepositoryDb>(new DepositoryDb(),
      `select * from "Depositories" where "ExchangePublicKey" = $1`, [exchangePublicKey]);
  }

  public async selectDepositoryByBlockchainAddress(AddressInBlockchain: string): Promise<DepositoryDb> {
    return await this.dbClient.selectOneT<DepositoryDb>(new DepositoryDb(),
      `select * from "Depositories" where "AddressInBlockchain" = $1`, [AddressInBlockchain]);
  }

  public async selectUserDepositoryById(userDepositoryId: string): Promise<UserDepositoryDb> {
    return await this.dbClient.selectOneT<UserDepositoryDb>(new UserDepositoryDb(),
      `select * from "UserDepositories" where "Id" = $1`, [userDepositoryId]);
  }

  public async deleteAllDepositoryByAnyOneName(depositoryName: string) {
    await this.dbClient.executeTx(async (client) => {
      const { rows } = await client.query(`select "DepositoryId" from "UserDepositories" where "Name" = $1`, [depositoryName]);
      if (rows.length > 0) {
        await client.query(`delete from "UserDepositories" where "DepositoryId" = $1`, [rows[0].DepositoryId]);
        await client.query(`delete from "Depositories" where "Id" = $1`, [rows[0].DepositoryId]);
      }
      return 'success';
    });
  }

  public async deleteAllDepositoryByApiKey(apiKey: string) {
    await this.dbClient.executeTx(async (client) => {
      const { rows } = await client.query(`select "Id" from "Depositories" where "ExchangePublicKey" = $1`, [apiKey]);
      if (rows.length > 0) {
        await client.query(`delete from "UserDepositories" where "DepositoryId" = $1`, [rows[0].Id]);
        await client.query(`delete from "Depositories" where "Id" = $1`, [rows[0].Id]);
      }
      return 'success';
    });
  }

  public async deleteAllDepositoryByAddress(address: string) {
    await this.dbClient.executeTx(async (client) => {
      const { rows } = await client.query(`select "Id" from "Depositories" where "AddressInBlockchain" = $1`, [address]);
      if (rows.length > 0) {
        await client.query(`delete from "UserDepositories" where "DepositoryId" = $1`, [rows[0].Id]);
        await client.query(`delete from "Depositories" where "Id" = $1`, [rows[0].Id]);
      }
      return 'success';
    });
  }

  public async deleteAllDepositoryByUserId(userId: string) {
    await this.dbClient.executeTx(async (client) => {
      const { rows } = await client.query(`select "DepositoryId" from "UserDepositories" where "UserId" = $1`, [userId]);
      for (const row of rows) {
        await client.query(`delete from "UserDepositories" where "DepositoryId" = $1`, [row.DepositoryId]);
        await client.query(`delete from "Depositories" where "Id" = $1`, [row.DepositoryId]);
      }
      return 'success';
    });
  }

}

function convertState(state: DepositoryState): DepositorySyncState {
  switch (state) {
    case DepositoryState.Ok: return DepositorySyncState.Success;
    case DepositoryState.InProgress: return DepositorySyncState.Success;
    case DepositoryState.Warning: return DepositorySyncState.Warning;
    case DepositoryState.Failed: return DepositorySyncState.Failed;
  }
}

enum DepositorySyncState {
  Success,
  Warning,
  Failed
}

export enum DepositoryState {
  Ok,
  InProgress,
  Warning,
  Failed
}
