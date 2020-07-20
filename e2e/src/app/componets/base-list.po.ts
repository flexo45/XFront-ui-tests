import {BasePageObjectComponent} from './base.po';
import {by, element, ElementFinder} from 'protractor';

export abstract class BaseListPageObjectComponent extends BasePageObjectComponent {

  protected constructor(basePath: string) {
    super(basePath, '');
  }

  async getRowCount(): Promise<number> {
    return (await this.getAllRow()).length;
  }

  abstract async getAllRow(): Promise<ElementFinder[]>;

  abstract getRowByGuid(currencyName: string);

  abstract getRow(seqNum: number);

  async assertRowCount(expectedCount: number) {
    await expect(await this.getRowCount()).toBe(expectedCount, 'invalid list item row count');
  }
}
