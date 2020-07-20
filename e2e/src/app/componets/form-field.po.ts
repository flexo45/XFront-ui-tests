import {BasePageObjectComponent} from './base.po';
import {browser, by, element} from 'protractor';
import {protractor} from 'protractor/built/ptor';

export class FormFieldPageObjectComponent extends BasePageObjectComponent {

  constructor(basePath: string,
              protected formcontolname: string,
              public placeholder: string = '') {
    super(`${basePath}`, `input[formcontrolname='${formcontolname}']`);
  }

  el = element(by.css(this.basePath));

  prop = {
    style: []
  };

  public errorText = {
    el: element(by.xpath(`//input[@formcontrolname='${this.formcontolname}']` +
      `/parent::div/parent::div/parent::div/div[@ng-reflect-ng-switch='error']//mat-error`)),
    prop: {

    }
  };

  public async enterText(text: string) {
    const action = new protractor.ActionSequence(browser.driver);
    await action.mouseMove(this.el).click().sendKeys(text).perform();
    // await this.el.sendKeys(text);
  }

  public async assertErrorText(expectedText: string) {
    expect(await this.errorText.el.getText()).toBe(expectedText, 'error message incorrect');
  }

  public async clearInput() {
    while ((await this.getInputValue()).length > 0) {
      await this.el.sendKeys(protractor.Key.BACK_SPACE);
    }
  }

  private async getInputValue() {
    return await this.el.getAttribute('value');
  }

}
