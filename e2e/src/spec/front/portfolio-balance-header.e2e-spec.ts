import {AppTestFixture} from '../../app.test-fixture';
import {DepositoryDetailsTests} from '../../tests/depository-details.tests';

describe('XFront App - Depositories list test suite', function() {

  const fixture: AppTestFixture = new AppTestFixture();
  fixture.defaultUser = fixture.config.users.empty;

  const testSuit: DepositoryDetailsTests = new DepositoryDetailsTests(fixture);

  beforeAll(async () => {
    await fixture.relogin(fixture.defaultUser);
    await fixture.portfolio.deleteAllDepositoriesOfUser();
    await fixture.portfolio.addSomeDepositoriesWithCoinsToUser([fixture.config.exchanges.binance, fixture.config.exchanges.bitmex], []);
  });

  afterEach(async () => {
    if (fixture.defaultUser.login === fixture.config.users.empty.login) {
      await fixture.portfolio.deleteAllDepositoriesOfUser();
    }
    fixture.defaultUser = fixture.config.users.default;
  });

  it(`Style test`);

  it(``);

});
