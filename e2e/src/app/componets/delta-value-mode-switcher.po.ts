import {browser} from 'protractor';
import {DeltaValuePageObjectComponent} from './delta-value.po';

export class DeltaValueSwitcherPageObjectComponent extends DeltaValuePageObjectComponent {
  constructor(protected basePath: string,
              protected fontSize: string = '40px',
              protected fontWeight: string = '500') {
    super(`${basePath}`, fontSize, fontWeight);
  }

  public async switchDeltaValueMode() {
    await this.base.el.click();
    await browser.sleep(200);
  }

  public getPositiveCssStyle(): string[][] {
    const result = super.getPositiveCssStyle();
    result.push(['border-bottom-color', this.styles.colors.lightPositive]);
    result.push(['border-bottom-style', 'solid']);
    result.push(['border-bottom-width', '1px']);
    return result;
  }

  public getNegativeCssStyle(): string[][] {
    const result = super.getNegativeCssStyle();
    result.push(['border-bottom-color', this.styles.colors.lightNegative]);
    result.push(['border-bottom-style', 'solid']);
    result.push(['border-bottom-width', '1px']);
    return result;
  }
}
