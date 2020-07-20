import {BasePageObjectComponent} from './base.po';
import {browser, by, element, ExpectedConditions} from 'protractor';
import {protractor} from 'protractor/built/ptor';
import {H2HeaderPageObjectComponent} from './text.po';

export class SideNavBaseComponentPageObject extends BasePageObjectComponent {
  constructor(protected titleText: string) {
    super('', 'mat-sidenav');
  }

  public title = new H2HeaderPageObjectComponent(this.basePath, this.titleText);

  public async waitForLoading() {
    await browser.sleep(1500);
    await browser.wait(ExpectedConditions.visibilityOf(this.title.el));
  }

  // async navigateTo(exchangeId: number) {
  //   await browser.get('/exchange/attach(sidenav:guide_apikey/' + exchangeId + ')');
  // }

  public async close() {
    const sidenav = element(by.css('mat-sidenav[style~="visible;"]'));
    const action = new protractor.ActionSequence(browser.driver);
    action.mouseMove(element(by.css('body')), {
      x: 10,
      y: 10
    }).click();
    await action.perform();
    // await browser.wait(ExpectedConditions.not(ExpectedConditions.visibilityOf(sidenav)));
    await browser.sleep(1500);
  }
}
