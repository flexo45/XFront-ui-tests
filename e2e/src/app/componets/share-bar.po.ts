import {BasePageObjectComponent} from './base.po';
import {by, element} from 'protractor';
import {RegularTextPageObjectComponent} from './text.po';

export class ShareBasPageObjectComponent extends BasePageObjectComponent {

  constructor(basePath: string) {
    super(basePath, 'share-bar');
  }

  bar = {
    base: {
      el: element(by.css(`${this.basePath}`))
    },
    line: {
      el: element(by.css(`${this.basePath} .bar`))
    },
    data: {
      el: element(by.css(`${this.basePath} .data`))
    },
    empty: {
      el: element(by.css(`${this.basePath} .empty`))
    }
  };

  sharePercents = new RegularTextPageObjectComponent(`!${this.basePath} > div.share-percent`, '', '21px');

  public async assertShare(share: string) {
    await expect(await this.sharePercents.el.getText()).toBe(`${share}%`);
    await expect(await this.bar.data.el.getAttribute('style'))
      .toMatch(new RegExp(`width: ${share.replace(/.\d\d/g, '')}.{0,5}%;`));
    await expect(await this.bar.empty.el.getAttribute('style'))
      .toMatch(new RegExp(`width: ${(100 - parseFloat(share)).toString(10).replace(/.\d\d/g, '')}.{0,5}%;`));
  }
}
