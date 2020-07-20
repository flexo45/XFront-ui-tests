import {BasePageObjectComponent} from './base.po';
import {MutedTextPageObjectComponent} from './text.po';

export class DepositoryStatusPageObjectComponent extends BasePageObjectComponent {
  constructor(basePath: string, protected fontSize = '16px') {
    super(basePath, 'app-depository-status');
  }

  public todaySyncText = new MutedTextPageObjectComponent(this.basePath, 'today at \d\d:\d\d', this.fontSize);

  public syncInProgressText = new MutedTextPageObjectComponent(this.basePath, 'sync in progress', this.fontSize);
}
