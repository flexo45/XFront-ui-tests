import {TextBasePageObjectComponent} from './base-text.po';
import {by, element} from 'protractor';

export class SortedHeaderPageObjectComponent extends TextBasePageObjectComponent {
  constructor(basePath: string, public text: string, protected fontSize = '16px') {
    super(basePath, 'div.sorted-header-col', text);
  }

  public async assertSelectedAsc() {
  }

  public async assertSelectedDesc() {
  }

  public async assertNotSelected() {
  }

}
