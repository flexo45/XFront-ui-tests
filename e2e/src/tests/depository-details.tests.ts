import {AppTestFixture, DepositoryTestContext, no_wait_ng} from '../app.test-fixture';
import {TestsBase} from './attach.exchange';
import {DepositoryAppPage} from '../app/app.depository.po';
import {browser} from 'protractor';
import {DbClient} from '../data-access/db.client';

export class DepositoryDetailsTests extends TestsBase {

  constructor(fixture: AppTestFixture) {
    super(fixture);
  }

  public async EditExchangeNoChangesTest(depository: DepositoryTestContext) {
    const depositoryDetail = new DepositoryAppPage(depository.name, depository.id);
    await depositoryDetail.navigateTo();
    await depositoryDetail.editButton.click();
    // Act
    await depositoryDetail.editExchangeSideNav.saveButton.click();
    // Assert
    await browser.sleep(1000);
    await depositoryDetail.balanceHeader.text.assertText();
  }

  public async EditNameChangesTest(depository: DepositoryTestContext, name: string) {
    const depositoryDetail = new DepositoryAppPage(depository.name, depository.id);
    await depositoryDetail.navigateTo();
    await depositoryDetail.editButton.click();
    // Act
    await depositoryDetail.editExchangeSideNav.exchangeNameInput.clearInput();
    await depositoryDetail.editExchangeSideNav.exchangeNameInput.enterText(name);
    await depositoryDetail.editExchangeSideNav.saveButton.click();
    // Assert
    await browser.sleep(1000);
    await depositoryDetail.balanceHeader.text.assertText(name);
  }

  public async EditDiscardChangesTest(depository: DepositoryTestContext) {
    const depositoryDetail = new DepositoryAppPage(depository.name, depository.id);
    await depositoryDetail.navigateTo();
    await depositoryDetail.editButton.click();
    // Act
    await depositoryDetail.editExchangeSideNav.exchangeNameInput.enterText(' Edited');
    await depositoryDetail.editExchangeSideNav.cancelButton.click();
    // Assert
    await browser.sleep(1000);
    await depositoryDetail.balanceHeader.text.assertText();
  }

  public async DeleteExchangeUserDepositoryTest(depository: DepositoryTestContext) {
    const depositoryDetail = new DepositoryAppPage(depository.name, depository.id);
    await depositoryDetail.navigateTo();
    await depositoryDetail.deleteButton.click();
    // Act
    await depositoryDetail.deleteSideNav.deleteButton.click();
    await browser.sleep(1000);
    // Assert
    const result = await DbClient.getInstance().selectOne(`select count(*) from "UserDepositories" where "Id" = $1`, [depository.id]);
    expect(result.count).toBe('0', 'UserDepository should be removed');
  }

  public async DeleteDepositoryRemovedAssert(apiKey: string) {
    const result = await DbClient.getInstance().selectOne(`select count("Id") from "Depositories" where "ExchangePublicKey" = $1`, [apiKey]);
    expect(result.count).toBe('0', `Depository should by removed`);
  }

  public async DeleteDepositoryExistAssert(apiKey: string) {
    const result = await DbClient.getInstance().selectOne(`select count("Id") from "Depositories" where "ExchangePublicKey" = $1`, [apiKey]);
    expect(result.count).toBe('1', `Depository should by exist`);
  }

  public async DeleteDiscardTest(depository: DepositoryTestContext) {
    const depositoryDetail = new DepositoryAppPage(depository.name, depository.id);
    await depositoryDetail.navigateTo();
    await depositoryDetail.deleteButton.click();
    // Act
    await depositoryDetail.deleteSideNav.discardButton.click();
    // Assert
    await browser.sleep(1000);
    await depositoryDetail.balanceHeader.text.assertText();
  }

  public async NavigationDirectAndBackTest(depository: DepositoryTestContext) {
    const depositoryDetail = new DepositoryAppPage(depository.name, depository.id);
    await depositoryDetail.navigateTo();
    // Act
    await depositoryDetail.backArrow.click();
    // Assert
    await this.fixture.depositories.assertPageLoaded();
  }

  public async NavigationBackToDepositoriesTest() {
    const depositroies = this.fixture.depositories;
    // const depositoryDetail = new DepositoryAppPage(depository.name, depository.id);
    await depositroies.navigateTo();
    // await depositroies
    // // Act
    // await depositoryDetail.backArrow.click();
    // // Assert
    // await this.fixture.depositories.assertPageLoaded();
  }

}
