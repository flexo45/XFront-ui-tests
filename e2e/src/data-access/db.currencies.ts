import {DbClient} from './db.client';
import {CacheName, DbCache} from './db.cache';
import {CurrencyInfoModel} from './db.model';

export class DbCurrencies {

  constructor(
    private dbClient: DbClient = DbClient.getInstance(),
    protected cache: DbCache = new DbCache()) {}

  public async getSomeCurrencies(limit: number, isFromCb: boolean = false): Promise<CurrencyInfoModel[]> {
    const cacheHit = this.cache.findInCacheElements<CurrencyInfoModel>(CacheName.Currencies, limit);

    if (cacheHit !== undefined)
      return cacheHit;

    const result = await this.dbClient.selectT<CurrencyInfoModel>(new CurrencyInfoModel(),
      `select distinct t1.* from "Currencies" t1, "CurrencyPrices" t2 where t1."Id" = t2."CurrencyId" and
      "CbId" is ${isFromCb ? 'not null' : 'null'} and t2."Date" < now() - interval '7 DAY' order by "CmcRank" limit $1`, [limit]);
    this.cache.addToCache<CurrencyInfoModel>(CacheName.Currencies, result);

    return result;
  }

  public async getCurrencyByTicker(ticker: string): Promise<CurrencyInfoModel> {
    const cacheHit = this.cache.findInCache<CurrencyInfoModel>(CacheName.Currencies, (x) => x.ticker === ticker);

    if (cacheHit !== undefined)
      return cacheHit;

    const row = await this.dbClient.selectOneT<CurrencyInfoModel>(new CurrencyInfoModel(),
      `select * from "Currencies" where "Ticker" = $1`, [ticker]);
    if (row) { this.cache.addToCache<CurrencyInfoModel>(CacheName.Currencies, row); }
    return row;
  }

  public async getCurrencyById(currencyId: string): Promise<CurrencyInfoModel> {
    const cacheHit = this.cache.findInCache<CurrencyInfoModel>(CacheName.Currencies, (x) => x.id === currencyId);

    if (cacheHit !== undefined)
      return cacheHit;

    const row = await this.dbClient.selectOneT<CurrencyInfoModel>(new CurrencyInfoModel(),
      `select * from "Currencies" where "Id" = $1`, [currencyId]);
    if (row) { this.cache.addToCache<CurrencyInfoModel>(CacheName.Currencies, row); }
    return row;
  }

  public async getCurrencyPriceInConvertible(currencyTicker: string, convertibleTicker: string): Promise<string> {
    const cacheHit = this.cache.findInCache<{ price: string }>(`${CacheName.PricePair}${currencyTicker}${convertibleTicker}`);

    if (cacheHit)
      return cacheHit.price;

    const row = await this.dbClient.selectOneT<{ price: string }>({ price: '' },
      `select (select "PriceUsd" from "Currencies" where "Ticker" = $1)/
      (select "PriceUsd" from "Currencies" where "Ticker" = $2) as price`, [currencyTicker, convertibleTicker]);
    this.cache.addToCache<{ price: string }>(`${CacheName.PricePair}${currencyTicker}${convertibleTicker}`, row);
    return row.price;
  }

  public async createCurrency(model: TestCurrencyModel): Promise<string> {
    return await this.dbClient.executeTx(async (client) => {

      const curr = await client.query(`select "Id" from "Currencies" where "Ticker" = $1`, [model.ticker]);

      if (curr.rows.length > 0) {
        return curr.rows[0].Id;
      }

      const { rows } = await client.query(`insert into "Currencies" ("Id", "Name", "Ticker", "ImageUrl", "Blockchain", "BlockchainData",
        "CmcId", "PriceUsd", "UpdateTime", "IsConvertible", "ConvertibleIconUrl", "CmcRank", "CbId")
        VALUES (uuid_generate_v4(), $1, $2, null, 0, null, null, $3,
        now(), false , null, 0, null )
        RETURNING "Id"`, [model.name, model.ticker, model.price]);

      model.history.forEach(async (el, idx) => {
        await client.query(`insert into "CurrencyPrices" ("CurrencyId", "Date", "PriceUsd")
        VALUES ($1, now() - interval '${idx} HOUR', $2);`, [rows[0].Id, el]);
      });

      return rows[0].Id;

    });
  }

  // TODO more then 1D period
  public async getDeltaOfPriceByPeriod(ticker: string, period: string = '1D'): Promise<string> {
    const { rows } = await this.dbClient.selectOne(
      `select
      (select "CurrencyPrices"."PriceUsd" from "CurrencyPrices", "Currencies" where "CurrencyId" = "Id" and "Ticker" = $1 order by "Date" desc limit 1)-
      (select "CurrencyPrices"."PriceUsd" from "CurrencyPrices", "Currencies" where "CurrencyId" = "Id" and "Ticker" = $1
      and "Date" >= now() - interval '25 HOURS' limit 1) as delta;`, [ticker]);
    return rows.delta;
  }

}

export class TestCurrencyModel {
  name: string;
  ticker: string;
  price: number;
  history: number[];
}
