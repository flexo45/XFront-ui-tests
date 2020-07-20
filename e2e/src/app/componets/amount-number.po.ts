import {BasePageObjectComponent} from './base.po';
import {by, element} from 'protractor';
import {MutedTextPageObjectComponent, RegularTextPageObjectComponent} from './text.po';
import {NumberService} from '../../../../src/app/utils/rich-number/number.service';

export class AmountNumberPageObjectComponent extends BasePageObjectComponent {
  constructor(basePath: string,
              protected fontSize: string = '16px') {
    super(basePath, 'app-amount-number');
  }

  private numberService: NumberService = new NumberService();

  public displayMuted = new MutedTextPageObjectComponent(`!${this.basePath}`, '', this.fontSize);

  public displayRegular = new RegularTextPageObjectComponent(`!${this.basePath}`, '', this.fontSize);

  async ticker(): Promise<string> {
    return await element(by.css(this.basePath)).getAttribute('ng-reflect-ticker');
  }

  async amount(): Promise<string> {
    return await element(by.css(this.basePath)).getAttribute('ng-reflect-value');
  }

  public async assertAmountText(balanceNumber: number, ticker: string) {
    const actualAmount = await element(by.css(this.basePath)).getText();
    await expect(actualAmount.trim().replace(/(?:\r\n|\r|\n)/g, ''))
      .toBe(`${this.numberService.toThousandsSeparats(balanceNumber)} ${ticker}`, 'amount invalid');
  }
}
