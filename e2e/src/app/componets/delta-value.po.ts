import {BasePageObjectComponent} from './base.po';
import {by, element} from 'protractor';
import {checkPattern, checkStyles, checkSvgAndStyle} from '../../utils';
import {CurrencySvgIconPageObjectComponent} from './svg-icon.po';
import {DeltaValue} from '../../../../src/app/portfolio/delta-value/delta-value';

export class DeltaValuePageObjectComponent extends BasePageObjectComponent {

  constructor(basePath: string,
              protected fontSize: string = '16px',
              protected fontWeight: string = '400') {
    super(basePath, 'app-delta-value');
  }

  public base = {
    el: element(by.css(`${this.basePath}`))
  };

  public absolute = {
    number: {
      el: this.base.el,
      prop: {
        positive: {
          style: this.getPositiveCssStyle()
        },
        negative: {
          style: this.getNegativeCssStyle()
        }
      },
    },
    currencyIcon: new CurrencySvgIconPageObjectComponent(this.basePath, this.fontSize, this.fontWeight)
  };

  public relative = {
    el: this.base.el,
    prop: {
      positive: {
        pattern: /^(?!.*  )((\d)|(\d\d))\.\d\d%$/gm,
        style: this.getPositiveCssStyle()
      },
      negative: {
        pattern: /^(?!.*  )-((\d)|(\d\d))\.\d\d%$/gm,
        style: this.getNegativeCssStyle()
      }
    }
  };

  public assertAbsoluteDeltaText(text: string, period: string = '1D') {
    // const excpectedDelta = new DeltaValue(this.currency.balance, this.historyBalance);
    // select "CurrencyPrices".* from "CurrencyPrices", "Currencies" where "CurrencyId" = "Id" and "Ticker" = 'ICX' and "Date" >= now() - interval '25 HOURS' limit 1;
    // select "CurrencyPrices".* from "CurrencyPrices", "Currencies" where "CurrencyId" = "Id" and "Ticker" = 'ICX' order by "Date" desc limit 1;
  }

  public getPositiveCssStyle(): string[][] {
    return [
      ['color', this.styles.colors.positive],
      ['cursor', 'pointer'],
      ['font-family', this.styles.fonts.regular],
      ['font-size', this.fontSize],
      ['font-weight', this.fontWeight]
    ];
  }

  public getNegativeCssStyle(): string[][] {
    return [
      ['color', this.styles.colors.negative],
      ['cursor', 'pointer'],
      ['font-family', this.styles.fonts.regular],
      ['font-size', this.fontSize],
      ['font-weight', this.fontWeight]
    ];
  }

  // public async assertAbsolute(currencyName) {
  //   const currency = this.config.getCurrencyByName(currencyName);
  //   if ((await this.base.el.getAttribute('class')).includes('positive')) {
  //     await checkStyles(this.absolute.number.el, this.absolute.number.prop.positive.style);
  //     await checkSvgAndStyle(this.absolute.currencyIcon.path.el, currency.svg,
  //       this.absolute.currencyIcon.getPositiveCssStyle(), 'positive delta value');
  //     await checkPattern(await this.base.el.getText(),
  //       currency.deltaPattern.positive);
  //   } else {
  //     await checkStyles(this.absolute.number.el, this.absolute.number.prop.negative.style);
  //     await checkSvgAndStyle(this.absolute.currencyIcon.path.el, currency.svg,
  //       this.absolute.currencyIcon.getNegativeSvgCssStyle(), 'negative delta value');
  //     await checkPattern(await this.base.el.getText(),
  //       currency.deltaPattern.negative);
  //   }
  // }
  //
  // public async assertRelative() {
  //   if ((await this.base.el.getAttribute('class')).includes('positive')) {
  //     await checkStyles(this.relative.el, this.relative.prop.positive.style);
  //     await checkPattern(await this.base.el.getText(),
  //       this.relative.prop.positive.pattern);
  //   } else {
  //     await checkStyles(this.relative.el, this.relative.prop.negative.style);
  //     await checkPattern(await this.base.el.getText(),
  //       this.relative.prop.negative.pattern);
  //   }
  // }
}
