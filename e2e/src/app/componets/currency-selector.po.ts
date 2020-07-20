import {BasePageObjectComponent} from './base.po';
import {browser, by, element} from 'protractor';
import {checkStyles} from '../../utils';

export class CurrencySelectorPageObjectComponent extends BasePageObjectComponent {

  constructor() {
    super('', '.d-none app-currency-selector.d-none');
  }

  selector = {
    el: element(by.css(this.basePath)),
    prop: {}
  };

  active = {
    el: element(by.css(`app-drop-down-menu .selected`)),
    prop: {
      style: [
        ['color', this.styles.colors.regular],
        ['cursor', 'pointer'],
        ['font-family', this.styles.fonts.regular],
        ['font-size', '21px'],
        ['background', this.styles.colors.darkAccent + ' none repeat scroll 0% 0% / auto padding-box border-box']
      ]
    }
  };

  base = {
    component: this,
    el: function (seqNum: number) {
      return element(by.css(`app-drop-down-menu div.menu-instructions > div:nth-child(${seqNum}) .menu-instruction`));
    },
    prop: {
      state: {
        active: {
          'class': 'regular',
          style: [
            ['color', this.styles.colors.regular],
            ['cursor', 'pointer'],
            ['font-family', this.styles.fonts.regular],
            ['font-size', '21px'],
            ['background', this.styles.colors.darkAccent]
          ]
        },
        inActive: {
          'class': 'muted',
          style: [
            ['color', this.styles.colors.regular],
            ['cursor', 'pointer'],
            ['font-family', this.styles.fonts.regular],
            ['font-size', '21px']
          ]
        }
      }
    }
  };

  async openCurrenciesList() {
    await this.selector.el.click();
  }

  async switchToCurrency(currencyName) {
    await this.openCurrenciesList();
    await browser.sleep(500);
    await this.clickToCurrency(currencyName);
    await browser.sleep(200);
  }

  async clickToCurrency(currencyName) {
    const selected = this.config.getCurrencyByName(currencyName);
    await this.base.el(selected.id).click();
  }

  async assertCurrencySelected(currencyName) {
    const selected = this.config.getCurrencyByName(currencyName);
    const other = this.config.currencies.convertible.filter((i) => {
      return i.name !== currencyName;
    });
    await this.openCurrenciesList();
    // check selected
    await checkStyles(this.base.el(selected.id),
      this.active.prop.style,
      `active currency ${currencyName}`);
    // check other
    for (const o of other) {
      await checkStyles(this.base.el(o.id),
        this.base.prop.state.inActive.style,
        `inactive currency ${o.name}`);
    }
  }

}
