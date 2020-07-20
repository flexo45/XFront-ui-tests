import { browser } from 'protractor';
import {AppTestFixture} from '../../app.test-fixture';
import {takeScreenshotWhenFail} from '../../utils';

describe('XFront App - Welcome test suite', function() {

  const fixture: AppTestFixture = new AppTestFixture();
  fixture.defaultUser = fixture.config.users.empty;

  beforeAll(async function() {
    await fixture.relogin(fixture.defaultUser);
    await fixture.portfolio.deleteAllDepositoriesOfUser();
  });

  afterEach(async () => {
    await takeScreenshotWhenFail();
  });

  it('Validate Welcome page elements', async () => {
    // Act
    await fixture.welcome.navigateTo();
    // Assert
    await expect(await browser.driver.getCurrentUrl()).toContain('/welcome');

    await fixture.welcome.header.assertText();
    await fixture.welcome.header.assertStyle();

    await fixture.welcome.description.assertText();
    await fixture.welcome.description.assertStyle();

    await fixture.welcome.addExchangeButton.assertText();
    await fixture.welcome.addExchangeButton.assertStyle();

    await fixture.welcome.addAddressButton.assertText();
    await fixture.welcome.addAddressButton.assertStyle();
  });

  it('Should be opened Welcome page if user has no depositories', async () => {
    // Act
    await fixture.page.navigateToRoot();
    // Assert
    await fixture.welcome.assertPageLoaded();
  });
});
