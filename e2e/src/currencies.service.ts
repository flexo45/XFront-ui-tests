import {CurrencyTestContext} from './app.test-fixture';
import {DbCurrencies} from './data-access/db.currencies';

export class CurrenciesService {

  constructor(private dbCurrencies: DbCurrencies) {}

  public async getSomeCurrencies(count: number): Promise<CurrencyTestContext[]> {
    const currenciesRow = await this.dbCurrencies.getSomeCurrencies(count);
    return currenciesRow.map((x) => {
      return {
        id: x.id,
        name: x.name,
        ticker: x.ticker,
        price: x.priceUsd,
        imageUrl: x.imageUrl,
        convertibleIconUrl: x.convertibleIconUrl
      };
    });
  }

  public async getCurrencyByTicker(ticker: string): Promise<CurrencyTestContext> {
    const currenciesRow = await this.dbCurrencies.getCurrencyByTicker(ticker);
    return {
      id: currenciesRow.id,
      name: currenciesRow.name,
      ticker: currenciesRow.ticker,
      price: currenciesRow.priceUsd,
      imageUrl: currenciesRow.imageUrl,
      convertibleIconUrl: currenciesRow.convertibleIconUrl
    };
  }

  public async getCurrencyById(currencyId: string): Promise<CurrencyTestContext> {
    const currenciesRow = await this.dbCurrencies.getCurrencyById(currencyId);
    return {
      id: currenciesRow.id,
      name: currenciesRow.name,
      ticker: currenciesRow.ticker,
      price: currenciesRow.priceUsd,
      imageUrl: currenciesRow.imageUrl,
      convertibleIconUrl: currenciesRow.convertibleIconUrl
    };
  }
}
