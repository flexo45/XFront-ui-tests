import {BaseListPageObjectComponent} from './base-list.po';
import {MutedTextPageObjectComponent, RegularTextPageObjectComponent} from './text.po';
import {SortedHeaderPageObjectComponent} from './sorted-header.po';
import {by, element, ElementFinder} from 'protractor';
import {BasePageObjectComponent} from './base.po';
import {ImageWithStubPageObjectComponent} from './image-stub.po';
import {DepositoryStatusPageObjectComponent} from './depository-status.po';
import {BalanceNumberPageObjectComponent} from './balance-number.po';
import {AmountNumberPageObjectComponent} from './amount-number.po';
import {ShareBasPageObjectComponent} from './share-bar.po';
import {DepositoryAppPage} from '../app.depository.po';

export class CurrencyDetailDepositoryListPageObjectComponent extends BaseListPageObjectComponent {

  constructor(basePath: string) {
    super(`${basePath}`);
  }

  header = {
    depositoryNameText: new MutedTextPageObjectComponent(`${this.basePath} .portfolio-assets-header-row > div:nth-child(1)`,
      'Depository'),
    balanceText: new SortedHeaderPageObjectComponent(`${this.basePath} .portfolio-assets-header-row > div:nth-child(2)`, 'Balance'),
    amountText: new MutedTextPageObjectComponent(`${this.basePath} .portfolio-assets-header-row > div:nth-child(2)`, 'Amount'),
    shareText: new MutedTextPageObjectComponent(`${this.basePath} .portfolio-assets-header-row > div:nth-child(4)`, 'Share')
  };

  public getRow(seqNum: number) {
    return new CurrencyDetailDepositoryListRowPageObjectComponent(this.basePath, seqNum);
  }

  public getRowByGuid(currencyName: string) {
    return new CurrencyDetailDepositoryListRowPageObjectComponent(this.basePath, currencyName);
  }

  async getAllRow(): Promise<ElementFinder[]> {
    return await element.all(by.css(`${this.basePath} a.portfolio-assets-row.d-none`));
  }
}

export class CurrencyDetailDepositoryListRowPageObjectComponent extends BasePageObjectComponent {

  constructor(basePath: string, idxOrGuid: number | string) {
    super(basePath, (idxOrGuid.toString().includes('-')
      ? `a.portfolio-assets-row.d-none[href='/depository/${idxOrGuid}']`
      : `a.portfolio-assets-row.d-none:nth-child(${parseInt(idxOrGuid.toString(), 10) + 1})`));
  }

  row = {
    el: element(by.css(`${this.basePath}`))
  };

  depositoryColumn = {
    exchangeImage: new ImageWithStubPageObjectComponent(`${this.basePath} .row > div:nth-child(2)`),
    depositoryName: new RegularTextPageObjectComponent(`!${this.basePath} .row > div:nth-child(2) > div > div`, '', '21px'),
    depositoryState: new DepositoryStatusPageObjectComponent(`${this.basePath} .row > div:nth-child(2)`)
  };

  balanceColumn = {
    balanceAmount: new BalanceNumberPageObjectComponent(`${this.basePath} .row > div:nth-child(3)`, '21px', '400')
  };

  amountColumn = {
    currencyAmount: new AmountNumberPageObjectComponent(`${this.basePath} .row > div:nth-child(4)`, '21px')
  };

  shareColumn = {
    shareBar: new ShareBasPageObjectComponent(`${this.basePath} .row > div:nth-child(5)`)
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
