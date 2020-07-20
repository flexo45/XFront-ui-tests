import {TextBasePageObjectComponent} from './base-text.po';
import {by, element} from 'protractor';

/**
 * Regular text
 */
export class RegularTextPageObjectComponent extends TextBasePageObjectComponent {
  constructor(basePath: string, public text: string, protected fontSize = '16px') {
    super(basePath, 'span', text);
  }

  el = element(by.css(`${this.basePath}`));

  prop = {
    style: [
      ['color', this.styles.colors.regular],
      ['font-family', this.styles.fonts.regular],
      ['font-size', this.fontSize],
      ['font-weight', '400']
    ]
  };
}

/**
 * Muted text
 */
export class MutedTextPageObjectComponent extends TextBasePageObjectComponent {
  constructor(basePath: string, public text: string, protected fontSize = '16px') {
    super(basePath, 'span', text);
  }

  el = element(by.css(`${this.basePath}`));

  prop = {
    style: [
      ['color', this.styles.colors.muted],
      ['font-family', this.styles.fonts.regular],
      ['font-size', this.fontSize],
      ['font-weight', '400']
    ]
  };
}

/**
 * Dark Muted text
 */
export class DarkMutedTextPageObjectComponent extends TextBasePageObjectComponent {
  constructor(basePath: string, public text: string, protected fontSize = '16px') {
    super(basePath, 'span', text);
  }

  el = element(by.css(`${this.basePath}`));

  prop = {
    style: [
      ['color', this.styles.colors.darkMuted],
      ['font-family', this.styles.fonts.regular],
      ['font-size', this.fontSize],
      ['font-weight', '400']
    ]
  };
}

/**
 * Header H1
 */
export class H1HeaderPageObjectComponent extends TextBasePageObjectComponent {

  constructor(basePath: string, public text: string) {
    super(basePath, 'h1', text);
  }

  el = element(by.css(`${this.basePath}`));

  prop = {
    style: [
      ['color', this.styles.colors.regular],
      ['font-family', this.styles.fonts.regular],
      ['font-size', '40px'],
      ['font-weight', '500']
    ]
  };

}
/**
 * Header H2
 */
export class H2HeaderPageObjectComponent extends TextBasePageObjectComponent {

  constructor(basePath: string, public text: string) {
    super(basePath, 'h2', text);
  }

  el = element(by.css(`${this.basePath}`));

  prop = {
    style: [
      ['color', this.styles.colors.regular],
      ['font-family', this.styles.fonts.regular],
      ['font-size', '30px'],
      ['font-weight', '700']
    ]
  };

}
