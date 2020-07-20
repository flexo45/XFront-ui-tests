import {BasePageObjectApp} from './app.base.po';
import {H1HeaderPageObjectComponent, RegularTextPageObjectComponent} from './componets/text.po';
import {ButtonDarkAccentPageObjectComponent} from './componets/buttons.po';

export class WelcomeAppPage extends BasePageObjectApp {

  constructor() {
    super('/welcome');
  }

  public header = new H1HeaderPageObjectComponent('app-depository-type-selector', 'Welcome to XFront. The best portfolio tracking tool.');
  public description = new RegularTextPageObjectComponent('!app-depository-type-selector > div:nth-child(2) div',
    'To start tracking your portfolio, you can perform an automatic sync with your exchange account or blockchain address.');
  public addExchangeButton = new ButtonDarkAccentPageObjectComponent('app-depository-type-selector #add-exchange', 'Add exchange');
  public addAddressButton = new ButtonDarkAccentPageObjectComponent('app-depository-type-selector #add-wallet', 'Add address');

  async assertPageLoaded() {
    await this.checkForErrorMessageOnLoad();
    await this.header.assertIsPresented();
  }

}
