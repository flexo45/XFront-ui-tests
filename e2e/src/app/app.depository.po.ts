import {PortfolioBasePageObjectApp} from './app.base.po';
import {CurrencyListPageObjectComponent} from './componets/currency-list.po';
import {
  BackArrowButtonPageObjectComponent,
  ButtonDarkAccentPageObjectComponent,
  ButtonFillAccentPageObjectComponent, ButtonNegativePageObjectComponent,
  SvgIconButtonPageObjectComponent
} from './componets/buttons.po';
import {SideNavBaseComponentPageObject} from './componets/side-nav.po';
import {H1HeaderPageObjectComponent, RegularTextPageObjectComponent} from './componets/text.po';
import {DepositoryStatusPageObjectComponent} from './componets/depository-status.po';
import {FormFieldPageObjectComponent} from './componets/form-field.po';

export class DepositoryAppPage extends PortfolioBasePageObjectApp {

  constructor(public depositoryName: string, public depositoryId: string) {
    super(`/depository/${depositoryId}`, depositoryName, 'app-depository-details', ' > div.d-none app-depository-details-header');

    // this.balanceHeader.text = new RegularTextPageObjectComponent(`${this.basePath}  > div.d-none app-depository-details-header h3 >`, depositoryName);
  }

  public backArrow = new BackArrowButtonPageObjectComponent(this.basePath);

  public editButton = new SvgIconButtonPageObjectComponent('#edit', 'Edit', this.config.svgIcons.edit);
  public deleteButton = new SvgIconButtonPageObjectComponent('#delete', 'Delete', this.config.svgIcons.delete);
  public forceSync = new SvgIconButtonPageObjectComponent('#force-sync', 'Sync currency balances in this', this.config.svgIcons.forceSync);

  public depositoryStatus = new DepositoryStatusPageObjectComponent(this.basePath);

  public currenciesList = new CurrencyListPageObjectComponent(this.basePath);

  public editWalletSideNav = new EditWalletSideNavComponentPageObject();

  public editExchangeSideNav = new EditExchangeSideNavComponentPageObject();

  public deleteSideNav = new DeleteDepositorySideNavComponentPageObject();

  public syncingStateView = {
    page: this,
    title: new RegularTextPageObjectComponent(`${this.basePath} > div.d-none ${this.basePath}-header .depository-name-container >`,
      `${this.depositoryName} is`, '16px'),
    header: new H1HeaderPageObjectComponent(`${this.basePath} > div.d-none ${this.basePath}-header `, 'Syncing'),
    description: new RegularTextPageObjectComponent(`${this.basePath} > div.d-none div.margin-from-header div >`,
      'We are syncing your depository right now. Please wait. It will be updated shortly...')
  };

  public emptyStateView = {
    page: this,
    title: new RegularTextPageObjectComponent(`${this.basePath} > div.d-none ${this.basePath}-header .depository-name-container >`,
      `${this.depositoryName} is`, '16px'),
    header: new H1HeaderPageObjectComponent(`${this.basePath} > div.d-none ${this.basePath}-header `, 'Empty'),
    description: new RegularTextPageObjectComponent(`${this.basePath} > div.d-none div.margin-from-header div >`,
      'We couldn\'t find any cryptocurrency in this depository. If you have another depositories that hold cryptocurrency, you can add ' +
      'them here to track their balance.'),
    addExchangeButton: new ButtonDarkAccentPageObjectComponent('app-depository-details #add-exchange', 'Add exchange'),
    addAddressButton: new ButtonDarkAccentPageObjectComponent('app-depository-details #add-wallet', 'Add address')
  };
}

class EditWalletSideNavComponentPageObject extends SideNavBaseComponentPageObject {
  constructor() {
    super('Edit wallet');
  }

  public walletNameInput = new FormFieldPageObjectComponent('', 'name', 'Wallet name');
  public addressInput = new FormFieldPageObjectComponent('', 'addressInBlockchain', 'Address');

  public saveButton = new ButtonFillAccentPageObjectComponent('#confirm-save', 'Save');
  public cancelButton = new ButtonDarkAccentPageObjectComponent('#edit-cancel', 'Cancel');
}

class EditExchangeSideNavComponentPageObject extends SideNavBaseComponentPageObject {
  constructor() {
    super('Edit exchange');
  }

  public exchangeNameInput = new FormFieldPageObjectComponent('', 'name', 'Exchange account name');
  public apiKeyInput = new FormFieldPageObjectComponent('', 'key', 'API key');
  public secretInput = new FormFieldPageObjectComponent('', 'secret', 'Secret');

  public saveButton = new ButtonFillAccentPageObjectComponent('#confirm-save', 'Save');
  public cancelButton = new ButtonDarkAccentPageObjectComponent('#edit-cancel', 'Cancel');
}

class DeleteDepositorySideNavComponentPageObject extends SideNavBaseComponentPageObject {
  constructor() {
    super('Delete depository');
  }

  public descriptionText = new RegularTextPageObjectComponent(`!mat-sidenav h2 + div`, `Do you really want to delete '%' depository? Once deleted, ` +
`it will not be included in the balance sheet..`);
  public discardButton = new ButtonFillAccentPageObjectComponent('#discard', 'Discard');
  public deleteButton = new ButtonNegativePageObjectComponent('#confirm-delete', 'Delete');
}
