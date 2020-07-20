import {BasePageObjectComponent} from './base.po';
import {CurrencySvgIconPageObjectComponent} from './svg-icon.po';
import {RegularTextPageObjectComponent} from './text.po';
import {by, element} from 'protractor';
import {NumberService} from '../../../../src/app/utils/rich-number/number.service';

export class PriceNumberPageObjectComponent extends BasePageObjectComponent {
  constructor(basePath: string,
              protected fontSize: string = '16px',
              protected fontWeight: string = '400') {
    super(basePath, 'app-price-number');
  }

  number = new RegularTextPageObjectComponent(this.basePath, '', this.fontSize);

  currencyIcon = new CurrencySvgIconPageObjectComponent(`${this.basePath}`, this.fontSize, this.fontWeight);

  ticker = new RegularTextPageObjectComponent(`!${this.basePath} span:last-child`, '');

  private numberService: NumberService = new NumberService();

  public async assertPriceText(priceValue: number, ticker: string = '') {
    const actualPrice = await element(by.css(`${this.basePath}`)).getText();
    await expect(actualPrice.trim().replace(/(?:\r\n|\r|\n)/g, ''))
      .toBe(`${this.numberService.toThousandsSeparats(this.numberService.toPrice(priceValue))} ${ticker}`);
  }
}
