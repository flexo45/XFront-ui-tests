import {BasePageObjectComponent} from './base.po';
import {by, element} from 'protractor';
import {checkSvg, checkSvgAndStyle} from '../../utils';

export class SvgIconPageObjectComponent extends BasePageObjectComponent {

  constructor(basePath: string,
              private d: string[]) {
    super(basePath, 'svg-icon');
  }

  base = {
    el: element(by.css(this.basePath)),
    prop: {
    }
  };

  svg = {
    el: element(by.css(`${this.basePath} svg`)),
    prop: {
    }
  };

  path = {
    el: element.all(by.css(`${this.basePath} path`)),
    prop: {
      d: this.d
    }
  };
}


/**
 * Currency SVG Icon
 */
export class CurrencySvgIconPageObjectComponent extends SvgIconPageObjectComponent {
  constructor(basePath: string,
              private fontSize: string = '16px',
              protected fontWeight: string = '400') {
    super(basePath, null);
  }

  public async ticker(): Promise<string> {
    return await this.base.el.getAttribute('ng-reflect-alt');
  }

  public getRegularCssStyle() {
    return [
      ['color', this.styles.colors.regular],
      ['fill', this.styles.fill.regular],
      ['font-family', this.styles.fonts.regular],
      ['font-size', this.fontSize],
      ['font-weight', this.fontWeight]
    ];
  }

  public getPositiveCssStyle() {
    return [
      ['color', this.styles.colors.positive],
      ['fill', this.styles.fill.positive],
      ['font-family', this.styles.fonts.regular],
      ['font-size', this.fontSize],
      ['font-weight', this.fontWeight]
    ];
  }

  public getNegativeSvgCssStyle(): string[][] {
    return [
      ['color', this.styles.colors.negative],
      ['fill', this.styles.fill.negative],
      ['font-family', this.styles.fonts.regular],
      ['font-size', this.fontSize],
      ['font-weight', this.fontWeight]
    ];
  }

  public async assertRegularSvgIcon(selectedCurrency: string) {
    const selected = this.config.getCurrencyByName(selectedCurrency);
    await checkSvgAndStyle(this.path.el, selected.svg,
      this.getRegularCssStyle(),
      ` regular balance currency`);
  }

  public async assertPositiveSvgIcon(selectedCurrency: string) {
    const selected = this.config.getCurrencyByName(selectedCurrency);
    await checkSvgAndStyle(this.path.el, selected.svg,
      this.getPositiveCssStyle(),
      ` positive balance currency`);
  }

  public async assertNegativeSvgIcon(selectedCurrency: string) {
    const selected = this.config.getCurrencyByName(selectedCurrency);
    await checkSvgAndStyle(this.path.el, selected.svg,
      this.getNegativeSvgCssStyle(),
      ` negative balance currency`);
  }

  public async assertSvgIcon(selectedCurrency: string) {
    const selected = this.config.getCurrencyByName(selectedCurrency);
    await checkSvg(this.path.el, selected.svg, ` svg of ${selectedCurrency}`);
  }
}
