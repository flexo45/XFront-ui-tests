import {BasePageObjectComponent} from './base.po';
import {browser, by, element, ExpectedConditions} from 'protractor';
import {H1HeaderPageObjectComponent} from './text.po';

export class StepPageObjectComponent extends BasePageObjectComponent {

  protected id;

  constructor(protected basePath: string, private title: string) {
    super(basePath, 'form');
    this.id = basePath.replace('#', '');
  }

  public header = new H1HeaderPageObjectComponent(`${this.basePath} %`, this.title);

  public async waitForLoading() {
    await browser.wait(ExpectedConditions.visibilityOf(this.header.el));
  }

  public async assertStepLoadedAndDisplayed() {
    const isEnabled = await element(by.xpath(`//form[@id='${this.id}']/parent::div`)).getAttribute('aria-expanded');
    await expect(isEnabled).toBe('true', 'step should be displayed');
  }
}
