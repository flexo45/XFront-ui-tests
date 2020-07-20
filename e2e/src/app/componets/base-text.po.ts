import {BasePageObjectComponent} from './base.po';
import {by, element, ElementFinder} from 'protractor';
import {checkPattern, checkStyles} from '../../utils';

export abstract class TextBasePageObjectComponent extends BasePageObjectComponent {

  protected constructor(basePath: string, componentName: string, public text: string) {
    super(basePath, componentName);
  }

  public el: ElementFinder;

  public prop = {
    style: []
  };

  public async getText(): Promise<string> {
    return await element(by.css(`${this.basePath}`)).getText();
  }

  public async assertText(text: string = '', ignoreMeta: boolean = true) {
    let actual = await element(by.css(`${this.basePath}`)).getText();
    if (ignoreMeta) {
      actual = actual.trim().replace(/(?:\r\n|\r|\n)/g, '');
    }
    await expect(actual).toBe(text === '' ? this.text : text);
  }

  public async assertContainText(text: string = '') {
    await expect(await element(by.css(`${this.basePath}`)).getText()).toContain(text === '' ? this.text : text);
  }

  public async assertPattern(pattern: RegExp = / /) {
    const text = await element(by.css(`${this.basePath}`)).getText();
    await checkPattern(text, pattern === / / ? new RegExp(this.text) : pattern);
  }

  public async assertStyle() {
    await checkStyles(element(by.css(`${this.basePath}`)), this.prop.style, `on text ${this.text}`);
  }
}
