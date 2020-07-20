import {BaseListPageObjectComponent} from './base-list.po';
import {MutedTextPageObjectComponent, RegularTextPageObjectComponent} from './text.po';
import {by, element, ElementFinder} from 'protractor';
import {SortedHeaderPageObjectComponent} from './sorted-header.po';
import {BasePageObjectComponent} from './base.po';
import {ImageWithStubPageObjectComponent} from './image-stub.po';
import {DepositoryStatusPageObjectComponent} from './depository-status.po';
import {BalanceNumberPageObjectComponent} from './balance-number.po';
import {DeltaValuePageObjectComponent} from './delta-value.po';
import {ShareBasPageObjectComponent} from './share-bar.po';
import {DepositoryAppPage} from '../app.depository.po';

export class DepositoryListPageObjectComponent extends BaseListPageObjectComponent {

  constructor(basePath: string) {
    super(`${basePath} app-depositories-list > .d-none`);
  }

  header = {
    depositoryNameText: new MutedTextPageObjectComponent(`${this.basePath} .portfolio-assets-header-row > div:nth-child(1)`,
      'Depository', '16px'),
    balanceText: new SortedHeaderPageObjectComponent(`${this.basePath} .portfolio-assets-header-row > div:nth-child(2)`, 'Balance', '16px'),
    shareText: new MutedTextPageObjectComponent(`${this.basePath} .portfolio-assets-header-row > div:nth-child(3)`, 'Share', '16px')
  };

  public getRow(seqNum: number) {
    return new DepositoryListRowPageObjectComponent(this.basePath, seqNum);
  }

  public getRowByGuid(currencyName: string) {
    return new DepositoryListRowPageObjectComponent(this.basePath, currencyName);
  }

  async getAllRow(): Promise<ElementFinder[]> {
    return await element.all(by.css(`${this.basePath} a.portfolio-assets-row.d-none`));
  }
}

export class DepositoryListRowPageObjectComponent extends BasePageObjectComponent {

  constructor(basePath: string, idxOrGuid: number | string) {
    super(basePath, (idxOrGuid.toString().includes('-')
      ? `app-depository-item > a[href='/depository/${idxOrGuid}'].d-none`
      : `app-depository-item:nth-child(${parseInt(idxOrGuid.toString(), 10) + 1}) > a.d-none`));
  }

  row = {
    el: element(by.css(`${this.basePath}`))
  };

  depositoryColumn = {
    exchangeImage: new ImageWithStubPageObjectComponent(`${this.basePath} .row > div:nth-child(2)`),
    depositoryName: new RegularTextPageObjectComponent(`!${this.basePath} .row > div:nth-child(2) > div > div`, ''),
    depositoryState: new DepositoryStatusPageObjectComponent(`${this.basePath} .row > div:nth-child(2)`)
  };

  balanceColumn = {
    balanceAmount: new BalanceNumberPageObjectComponent(`${this.basePath} .row > div:nth-child(3)`, '21px', '400'),
    balanceDeltaValue: new DeltaValuePageObjectComponent(`${this.basePath} .row > div:nth-child(3)`)
  };

  shareColumn = {
    shareBar: new ShareBasPageObjectComponent(`${this.basePath} .row > div:nth-child(4)`)
  };

  async getGuid(): Promise<string> {
    const href = await this.row.el.getAttribute('href');
    return href.replace('/depository/', '');
  }

  async clickAndGetDepositoryPage(): Promise<DepositoryAppPage> {
    const name = await this.depositoryColumn.depositoryName.el.getText();
    const guid = await this.getGuid();
    await super.click();
    return new DepositoryAppPage(name, guid);
  }

}
