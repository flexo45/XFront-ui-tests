import {by, element, ElementFinder} from 'protractor';
import {BaseListPageObjectComponent} from './base-list.po';
import {FormFieldPageObjectComponent} from './form-field.po';
import {MutedTextPageObjectComponent, RegularTextPageObjectComponent} from './text.po';
import {SortedHeaderPageObjectComponent} from './sorted-header.po';
import {BaseListRowPageObjectComponent} from './base-list-row.po';
import {BalanceNumberPageObjectComponent} from './balance-number.po';
import {AmountNumberPageObjectComponent} from './amount-number.po';
import {PriceNumberPageObjectComponent} from './price-number.po';
import {DeltaValuePageObjectComponent} from './delta-value.po';
import {ShareBasPageObjectComponent} from './share-bar.po';
import {ImageWithStubPageObjectComponent} from './image-stub.po';

export class CurrencyListPageObjectComponent extends BaseListPageObjectComponent {

  constructor(basePath: string) {
    super(`${basePath} app-currencies-list > .d-none`);
  }
  // .portfolio-assets-header-row > div:nth-child(x)
  header = {
    searchColumn: {
      lupa: {
        el: element(by.css(`${this.basePath} .portfolio-assets-header-row .table-search-field img`)),
        prop: {
          attributes: [
            ['src', '/assets/img/lens.svg']
          ],
          style: [
            ['color', this.styles.colors.regular],
            ['cursor', 'pointer'],
            ['font-family', this.styles.fonts.regular],
            ['font-size', '16px'],
            ['font-weight', '400']
          ]
        }
      },
      searchInput: new FormFieldPageObjectComponent(`!${this.basePath} .table-search-field input`, '', 'Currency'),
    },
    balanceText: new SortedHeaderPageObjectComponent(`${this.basePath} .portfolio-assets-header-row > div:nth-child(2)`, 'Balance'),
    priceText: new SortedHeaderPageObjectComponent(`${this.basePath} .portfolio-assets-header-row > div:nth-child(3)`, 'Price'),
    shareText: new MutedTextPageObjectComponent(`${this.basePath} .portfolio-assets-header-row > div:nth-child(4)`, 'Share', '16px')
  };

  public getRow(seqNum: number) {
    return new CurrencyListRowPageObjectComponent(this.basePath, seqNum);
  }

  public getRowByGuid(currencyName: string) {
    return new CurrencyListRowPageObjectComponent(this.basePath, currencyName);
  }

  async getAllRow(): Promise<ElementFinder[]> {
    return await element.all(by.css(`${this.basePath} a.portfolio-assets-row`));
  }
}

export class CurrencyListRowPageObjectComponent extends BaseListRowPageObjectComponent {

  constructor(basePath: string, idxOrGuid: number | string) {
    super(basePath, idxOrGuid);
  }

  row = {
    el: element(by.css(`${this.basePath}`))
  };

  currencyColumn = {
    currencyIconWithStub: new ImageWithStubPageObjectComponent(`${this.basePath}`),
    currencyName: new RegularTextPageObjectComponent(`${this.basePath} > div:nth-child(2) div.align-items-center > div:nth-child(2)`, '')
  };

  balanceColumn = {
    balanceAmount: new BalanceNumberPageObjectComponent(`${this.basePath} > div:nth-child(3)`, '21px', '400'),
    currencyAmount: new AmountNumberPageObjectComponent(`!${this.basePath} > div:nth-child(3)`, '16px')
  };

  priceColumn = {
    priceAmount: new PriceNumberPageObjectComponent(`${this.basePath} > div:nth-child(4)`),
    priceDeltaValue: new DeltaValuePageObjectComponent(`${this.basePath} > div:nth-child(4)`)
  };

  shareColumn = {
    shareBar: new ShareBasPageObjectComponent(`${this.basePath} > div:nth-child(5)`)
  };

  async assertRowIsDisplayed() {
    await expect(await this.row.el.isPresent()).toBeTruthy();
  }
}
