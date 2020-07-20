import {BasePageObjectComponent} from './base.po';
import {by, element} from 'protractor';

export class ImageWithStubPageObjectComponent extends BasePageObjectComponent {
  constructor(basePath: string) {
    super(basePath, 'image-with-stub');
  }

  public currencyIcon = {
    el: element(by.css(`${this.basePath} > div:nth-child(2) img`)),
    prop: {
      style: [
        ['color', this.styles.colors.regular],
        ['cursor', 'pointer'],
        ['height', '32px'],
        ['width', '32px']
      ]
    }
  };

  public currencyStub = {
    el: element(by.css(`${this.basePath} > div:nth-child(2) > dib:nth-child(1)`)),
    prop: {
      style: [
        ['color', this.styles.colors.regular],
        ['cursor', 'pointer'],
        ['height', '32px'],
        ['width', '32px'],
        ['background-color', this.styles.colors.muted],
        ['border-bottom-left-radius', '50%'],
        ['border-bottom-right-radius', '50%'],
        ['border-top-left-radius', '50%'],
        ['border-top-right-radius', '50%'],
        ['font-family', this.styles.fonts.regular],
        ['font-size', '21px'],
        ['font-weight', '400'],
        ['background-color', this.styles.colors.muted],
        ['justify-content:', 'center']
      ]
    }
  };

}
