import {BasePageObjectComponent} from './base.po';

export abstract class BaseListRowPageObjectComponent extends BasePageObjectComponent {
  protected constructor(basePath: string, idxOrGuid: number | string) {
    super(basePath, (idxOrGuid.toString().includes('-')
      ? `a[href='/currency/${idxOrGuid}'] .row`
      : `a:nth-child(${parseInt(idxOrGuid.toString(), 10) + 1}) .row`));
  }
}
