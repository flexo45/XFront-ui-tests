import {TestConf} from '../../test.conf';
import {browser, by, element} from 'protractor';
import {protractor} from 'protractor/built/ptor';

export abstract class BasePageObjectComponent {

  protected constructor(protected basePath: string, componentName) {

    let path = basePath;

    if (path.includes('!')) {
      path = path.replace('!', ''); // ignore component name
    } else {
      if (path.includes('#')) {
        // ignore component name
      } else {
        path = `${path} ${componentName}`;
      }
    }

    if (path.includes('%')) {
      path = path.replace('%', componentName);
    }

    this.basePath = path;

    // if (basePath.includes('#')) {
    //   if (basePath.includes('%')) {
    //     this.basePath = basePath.replace('%', componentName); // css selector by #id and component name
    //   } else {
    //     this.basePath = basePath; // ignore component name
    //   }
    // }
    //
    // if (basePath.includes('!')) {
    //   this.basePath = basePath.replace('!', ''); // ignore component name
    // } else {
    //   this.basePath = `${basePath} ${componentName}`;
    // }
  }

  protected config = new TestConf();
  protected styles = this.config.styles;

  public async assertIsPresented() {
    await expect(await element(by.css(`${this.basePath}`)).isPresent())
      .toBeTruthy(`element with css ${this.basePath} not presented`);
  }

  public async assertNotPresented() {
    await expect(await element(by.css(`${this.basePath}`)).isPresent())
      .toBeFalsy(`element with css ${this.basePath} is presented`);
  }

  public async click() {
    // await element(by.css(`${this.basePath}`)).click();
    const action = new protractor.ActionSequence(browser.driver);
    await action.mouseMove(element(by.css(`${this.basePath}`))).click().perform();

    await browser.sleep(500);
  }

  public async hover() {
    const action = new protractor.ActionSequence(browser.driver);
    await action.mouseMove(element(by.css(`${this.basePath}`))).perform();
  }

  public async focus() {
    const action = new protractor.ActionSequence(browser.driver);
    await action.mouseMove(element(by.css(`${this.basePath}`))).click().perform();
  }
}
