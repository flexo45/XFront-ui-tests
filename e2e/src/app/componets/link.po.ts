import {TextBasePageObjectComponent} from './base-text.po';
import {by, element} from 'protractor';

export class LinkPageObjectComponent extends TextBasePageObjectComponent {

  constructor(basePath: string, routerLink: string, public text: string) {
    super(basePath, `a[href^="${routerLink}"]`, text);
  }

  el = element(by.css(`${this.basePath}`));

  prop = {
    style: [
      ['color', this.styles.colors.accent],
      ['font-family', this.styles.fonts.regular],
      ['font-size', '21px'],
      ['font-weight', '400']
    ]
  };

}
