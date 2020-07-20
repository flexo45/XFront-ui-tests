import {TextBasePageObjectComponent} from './base-text.po';
import {by, element} from 'protractor';
import {BasePageObjectComponent} from './base.po';
import {SvgIconPageObjectComponent} from './svg-icon.po';

/**
 * Button Component
 * Dark background, Accent text and border
 */
export class ButtonDarkAccentPageObjectComponent extends TextBasePageObjectComponent {
  constructor(basePath: string, public text: string, private size_xy: number[] = [270, 55]) {
    super(basePath, `button`, text);
  }

  el = element(by.css(`${this.basePath}`));

  prop = {
    style: [
      ['color', this.styles.colors.accent],
      ['cursor', 'pointer'],
      ['height', `${this.size_xy[1]}px`],
      ['width', `${this.size_xy[0]}px`],
      ['background-color', this.styles.colors.transparent],
      ['border-bottom-left-radius', '5px'],
      ['border-bottom-right-radius', '5px'],
      ['border-top-left-radius', '5px'],
      ['border-top-right-radius', '5px'],
      ['font-family', this.styles.fonts.regular],
      ['font-size', '21px'],
      ['font-weight', '400']
    ]
  };
}

/**
 * Button Component
 * Accent background, Dark text;
 */
export class ButtonFillAccentPageObjectComponent extends TextBasePageObjectComponent {
  constructor(basePath: string, public text: string, private size_xy: number[] = [270, 55]) {
    super(basePath, `button`, text);
  }

  el = element(by.css(`${this.basePath}`));

  prop = {
    style: [
      ['color', this.styles.colors.accent],
      ['cursor', 'pointer'],
      ['height', `${this.size_xy[1]}px`],
      ['width', `${this.size_xy[0]}px`],
      ['background-color', this.styles.colors.transparent],
      ['border-bottom-left-radius', '5px'],
      ['border-bottom-right-radius', '5px'],
      ['border-top-left-radius', '5px'],
      ['border-top-right-radius', '5px'],
      ['font-family', this.styles.fonts.regular],
      ['font-size', '21px'],
      ['font-weight', '400']
    ]
  };
}

/**
 * Button Component
 * Transparent background, Red text
 */
export class ButtonNegativePageObjectComponent extends TextBasePageObjectComponent {
  constructor(basePath: string, public text: string, private size_xy: number[] = [270, 55]) {
    super(basePath, `button`, text);
  }

  el = element(by.css(`${this.basePath}`));

  prop = {
    style: [
      ['color', this.styles.colors.negative],
      ['cursor', 'pointer'],
      ['height', `${this.size_xy[1]}px`],
      ['width', `${this.size_xy[0]}px`],
      ['background-color', this.styles.colors.transparent],
      ['border-bottom-left-radius', '5px'],
      ['border-bottom-right-radius', '5px'],
      ['border-top-left-radius', '5px'],
      ['border-top-right-radius', '5px'],
      ['font-family', this.styles.fonts.regular],
      ['font-size', '21px'],
      ['font-weight', '400']
    ]
  };
}


/**
 *  BUTTON SVG-ICON
 */
export class SvgIconButtonPageObjectComponent extends BasePageObjectComponent {
  constructor(basePath: string, private tooltipMessage: string, private svg_d: string[]) {
    super(`${basePath}`, 'button');
  }

  public svgIcon = new SvgIconPageObjectComponent(`${this.basePath} %`, this.svg_d);
}

/**
 * Back Arrow
 */

export class BackArrowButtonPageObjectComponent extends BasePageObjectComponent {
  constructor(basePath: string) {
    super(basePath, 'small-back-button button');
  }
}
