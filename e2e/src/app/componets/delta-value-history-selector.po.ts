import {BasePageObjectComponent} from './base.po';
import {browser, by, element} from 'protractor';
import {checkStyles} from '../../utils';

export class DeltaValueHistorySelectorPageObjectComponent  extends BasePageObjectComponent {

  constructor() {
    super('', '');
  }

  public base = {
    el: function (periodName: string) {
      return element(by.xpath(`//app-delta-period-selector/div[contains(text(),\'${periodName}\')]`));
    },
    prop: {
      state: {
        active: {
          style: [
            ['color', this.styles.colors.regular],
            ['cursor', 'pointer'],
            ['font-family', this.styles.fonts.regular],
            ['font-size', '16px']
          ]
        },
        inActive: {
          style: [
            ['color', this.styles.colors.muted],
            ['cursor', 'pointer'],
            ['font-family', this.styles.fonts.regular],
            ['font-size', '16px']
          ]
        }
      }
    }
  };

  public active = {
    el: element(by.css('app-delta-period-selector.d-none > div.period:not(.muted)'))
  };

  public async switchToPeriod(period: string) {
    await this.base.el(period).click();
    await browser.sleep(200);
  }

  /**
   * Assert Delta Period Selector
   * @param {string} selectedPeriod: 1H, 1D, 7D, 14D
   * @returns {Promise<void>}
   */
  public async assertPeriodSelector(selectedPeriod: string) {
    const selected = this.getPeriodByName(selectedPeriod);
    const other = this.config.delta.periods.filter((i) => {
      return i.name !== selectedPeriod;
    });
    // check selected
    await checkStyles(this.base.el(selected.name),
      this.base.prop.state.active.style,
      `active period ${selectedPeriod}`);
    // check other
    for (const o of other) {
      await checkStyles(this.base.el(o.name),
        this.base.prop.state.inActive.style,
        `inactive period ${o.name}`);
    }
  }

  private getPeriodByName(periodName: string) {
    return this.config.delta.periods.find((i) => {
      return i.name === periodName;
    });
  }
}
