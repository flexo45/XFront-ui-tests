import {TextBasePageObjectComponent} from './base-text.po';
import {checkStyles} from '../../utils';
import {by, element} from 'protractor';

export class MenuItemPageObjectComponent extends TextBasePageObjectComponent {
  constructor(basePath: string, href: string, name: string) {
    super(basePath, `.menu a[href^="${href}"]`, name);
  }

  prop = {
    style: [
      ['font-family', this.styles.fonts.regular],
      ['font-size', '21px'],
      ['font-weight', '700']
    ],
    activeStyle: [
      [ 'border-bottom-color', this.styles.colors.accent ],
      [ 'border-bottom-style', 'solid' ],
      [ 'border-bottom-width', '1px' ],
      [ 'color', this.styles.colors.regular ]
    ],
    inactiveStyle: [
      [ 'border-bottom-color', this.styles.colors.muted ],
      [ 'border-bottom-style', 'solid' ],
      [ 'border-bottom-width', '1px' ],
      [ 'color', this.styles.colors.muted ]
    ]
  };

  public async assertActiveStyle() {
    await this.assertStyle();
    await checkStyles(element(by.css(`${this.basePath}`)), this.prop.activeStyle, `on menu item ${this.text}`);
  }

  public async assertInActiveStyle() {
    await this.assertStyle();
    await checkStyles(element(by.css(`${this.basePath}`)), this.prop.inactiveStyle, `on menu item ${this.text}`);
  }
}
