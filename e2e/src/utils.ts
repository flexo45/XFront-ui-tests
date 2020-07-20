import {browser, ElementArrayFinder, ElementFinder} from 'protractor';
import * as fs from 'fs';

export async function takeScreenshotWhenFail() {
  // take a screen shot if fail
  try {
    const spec: any = jasmine.getEnv().currentSpec;
    if (spec.failedExpectations.length > 0) {
      await takeScreenshot(spec.fullName);
    }
  } catch (e) {
    console.warn(`Error while taking screen shot => ` + e);
  }
}

export async function takeScreenshot(name: string) {
  const screen = await browser.takeScreenshot();
  // const stream = fs.createWriteStream(require('path').join(__dirname, 'e2e/fails/', `${name}.png`));
  const stream = fs.createWriteStream('./fails/' + `${name}.png`);
  // Buffer.alloc(1024);
  stream.write(Buffer.from(screen, 'base64'));
  // stream.write(new Buffer(screen, 'base64'));
  stream.end();
}

export function getRandom(min: number, max: number): number {
  return Math.floor(Math.random() * max) + min;
}

export async function no_wait_ng(script: Function) {
  await browser.waitForAngularEnabled(false);
  await script();
  await browser.waitForAngularEnabled(true);
}

export async function checkStyles(element: ElementFinder, styles: string[][], desc?: string) {
  styles.forEach(async (value, key, map) => {
    expect(await element.getCssValue(value[0]))
      .toBe(value[1], `invalid style \'${value[0]}\' of ${(desc === undefined ? await element.getTagName() : desc)}`);
  });
}

export async function checkAttributes(element: ElementFinder, styles: string[][], desc?: string) {
  styles.forEach(async (value, key, map) => {
    expect(await element.getAttribute(value[0]))
      .toBe(value[1], `invalid attribute \'${value[0]}\' of ${(desc === undefined ? await element.getTagName() : desc)}`);
  });
}

export async function checkSvgAndStyle(paths: ElementArrayFinder, svg: string[], styles: string[][], desc?: string) {
  await paths.each(async (e, idx) => {
    await checkStyles(e, styles, `${desc} svg`);
    expect(await e.getAttribute('d')).toEqual(svg[idx], `${desc} svg`);
  });
}

export async function checkSvg(paths: ElementArrayFinder, svg: string[], desc?: string) {
  await paths.each(async (e, idx) => {
    expect(await e.getAttribute('d')).toEqual(svg[idx], `${desc} svg`);
  });
}

export async function checkPattern(checkedString: string, pattern: RegExp) {
  expect(checkedString.trim().replace(/(?:\r\n|\r|\n)/g, '')).toMatch(pattern);
}

export class TCTesting {

  public static LogFail() {
    const spec: any = jasmine.getEnv().currentSpec;
    if (spec.failedExpectations.length > 0) {
      spec.failedExpectations.forEach((exp) => {
        let message = exp.message;

        if (message.includes('ServerError')) {
          const adf = '';
        }

        const corretReturnIdx = message.indexOf('\n');
        if (corretReturnIdx !== -1)
          message = message.substring(0, corretReturnIdx);

        message = message.replace(/'/g, '"').replace(/->/g, '');
        console.log(`##teamcity[testFailed name='${spec.description.replace(`##teamcity[testStarted name='`, '').replace(`']`, '')}'` +
          ` message='${message}' details='']`);
      });
    }
  }

  public static TestSuite(suiteName: string, testSuiteSpec: () => void, prefix: string = '') {
    const tc_start_print = `##teamcity[testSuiteStarted name='${suiteName}']`;
    const tc_finish_print = `##teamcity[testSuiteFinished name='${suiteName}']`;
    switch (prefix) {
      case '':
        // describe(tc_start_print, async () => {
        describe(suiteName, async () => {
          beforeAll(async () => console.log(tc_start_print));
          afterAll(async () => console.log(tc_finish_print));
          afterEach(async () => this.LogFail());
          await testSuiteSpec();
        });
        break;
      case 'x':
        xdescribe(suiteName, () => {});
        break;
      case 'f':
        // fdescribe(tc_start_print, async () => {
        fdescribe(suiteName, async () => {
          beforeAll(async () => console.log(tc_start_print));
          afterAll(async () => console.log(tc_finish_print));
          afterEach(async () => this.LogFail());
          await testSuiteSpec();
        });
    }
  }

  public static TestCase(testName: string, testCaseSpec: () => void) {
    const tc_case_print = `##teamcity[testStarted name='${testName}']`;
    // it(tc_case_print, async () => {
    it(testName, async () => {
      console.log(tc_case_print);
      await testCaseSpec();
    });
  }
}
