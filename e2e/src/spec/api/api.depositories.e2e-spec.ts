import {AppTestFixture} from '../../app.test-fixture';
import {DepositoryResponse} from '../../../../src/app/api/models/depository-response';
import {CollectionResponse} from '../../../../src/app/collection.response';
import {ApiResponse} from '../../api/base.api-client';
import {DepositoryType} from '../../../../src/app/depository/depository-type';
import {Exchanges} from '../../../../src/app/exchange/exchanges';
import {DepositoryResponseModel} from '../../data-access/db.model';
import {Blockchains} from '../../../../src/app/blockchains/blockchains';
import {DepositoryUpdateRequest} from '../../../../src/app/api/models/depository-update-request';
import {TCTesting} from '../../utils';

TCTesting.TestSuite('API - Depositories controller test suite', () => {

  const fixture: AppTestFixture = new AppTestFixture();

  beforeAll(async () => {
    fixture.defaultUser = fixture.config.users.default;
    await fixture.relogin(fixture.defaultUser);
    await fixture.portfolio.deleteAllDepositoriesOfUser();
    await fixture.portfolio.deleteAllDepositoriesOfUser(fixture.config.users.support.id);
  });

  afterAll(async () => {
    await fixture.portfolio.deleteAllDepositoriesOfUser();
    fixture.defaultUser = fixture.config.users.default;
  });

  for (const test of [
    { exchanges: 1, wallets: 0 },
    { exchanges: 0, wallets: 1 },
    { exchanges: 1, wallets: 1 },
    { exchanges: 5, wallets: 5 },
    { exchanges: 0, wallets: 0 }
  ]) {
    TCTesting.TestSuite(`(GET) - Depositories should return all depositories of user (exchanges: ${test.exchanges}, wallets: ${test.wallets})`,
      () => {

      let expectedDepositories: DepositoryResponse[];
      let actualDepositories: ApiResponse<CollectionResponse<DepositoryResponse>>;
      let hit: DepositoryResponse;

      beforeAll(async () => {
        await fixture.addExchanges(test.exchanges);
        await fixture.addWallets(test.wallets);
        expectedDepositories = await fixture.portfolio.getDepositoriesOfUser();
      });
      afterAll(async () => {
        await fixture.portfolio.deleteAllDepositoriesOfUser();
        fixture.defaultUser = fixture.config.users.default;
      });
      TCTesting.TestCase('http response code should be 200 OK', async () => {
        actualDepositories = await fixture.depositoryApiClient.getDepositories();
        expect(actualDepositories.statusCode).toBe(200);
      });
      TCTesting.TestCase('count of items in response should by correct', async () =>
        expect(actualDepositories.message.items.length).toBe(test.exchanges + test.wallets)
      );

      TCTesting.TestSuite('Depository items in response should by correct', () => {

        let expected: DepositoryResponse;

        for (let i = 0; i < test.wallets + test.exchanges; i++) {
          beforeAll(() => {
            expected = expectedDepositories[i];
            hit = actualDepositories.message.items.find(x => x.id === expected.id);
          });

          TCTesting.TestCase(`item ${i} should be exist`, async () =>
            expect(hit).not.toBeUndefined(`Depository ${expected.id} ${expected.name} not found`));
          TCTesting.TestCase('assert Id', async () => expect(hit.id).toBe(expected.id));
          TCTesting.TestCase('assert Name', async () => expect(hit.name).toBe(expected.name));
          TCTesting.TestCase('assert Type', async () => expect(hit.type).toBe(expected.type));
          TCTesting.TestCase('assert Status', async () => expect(hit.status).toBe(expected.status));
          TCTesting.TestCase('assert Exchange', async () => expect(hit.exchange).toBe(expected.exchange, ''));
          TCTesting.TestCase('assert ExchangePublicKey', async () =>
            expect(hit.exchangePublicKey).toBe(expected.exchangePublicKey));
          TCTesting.TestCase('assert Blockchain', async () => expect(hit.blockchain).toBe(expected.blockchain));
          TCTesting.TestCase('assert AddressInBlockchain', async () =>
            expect(hit.addressInBlockchain).toBe(expected.addressInBlockchain));
        }
      });
    });
  }

  for (const test of [
    { exchanges: 2, wallets: 0 },
    { exchanges: 0, wallets: 2 },
    { exchanges: 2, wallets: 3 },
    { exchanges: 3, wallets: 2 }
  ]) {
    TCTesting.TestSuite(`(GET) - Depository should get by Id (type=${test.wallets === 2 ? 'Wallets' : 'Exchange'}, from all=${test.wallets + test.exchanges})`,
      () => {

      let expectedDepository: DepositoryResponse;
      let actualDepository: DepositoryResponse;

      beforeAll(async () => {
        await fixture.addExchanges(test.exchanges);
        await fixture.addWallets(test.wallets);
        const allDepositories = await fixture.portfolio.getDepositoriesOfUser();
        if (test.exchanges === 2) {
          expectedDepository = allDepositories.filter(x => x.type === DepositoryType.Exchange).shift();
        }
        if (test.wallets === 2) {
          expectedDepository = allDepositories.filter(x => x.type === DepositoryType.BlockchainAddress).shift();
        }
      });
      afterAll(async () => {
        await fixture.portfolio.deleteAllDepositoriesOfUser();
        fixture.defaultUser = fixture.config.users.default;
      });
      TCTesting.TestCase('http response code should be 200 OK', async () => {
        const response = await fixture.depositoryApiClient.getDepository(expectedDepository.id);
        actualDepository = response.message;
        expect(response.statusCode).toBe(200);
      });
      TCTesting.TestCase('assert Id', async () => expect(actualDepository.id).toBe(expectedDepository.id));
      TCTesting.TestCase('assert Name', async () => expect(actualDepository.name).toBe(expectedDepository.name));
      TCTesting.TestCase('assert Type', async () => expect(actualDepository.type).toBe(expectedDepository.type));
      TCTesting.TestCase('assert Status', async () => expect(actualDepository.status).toBe(expectedDepository.status));
      TCTesting.TestCase('assert Exchange', async () => expect(actualDepository.exchange).toBe(expectedDepository.exchange));
      TCTesting.TestCase('assert ExchangePublicKey',
        async () => expect(actualDepository.exchangePublicKey).toBe(expectedDepository.exchangePublicKey));
      TCTesting.TestCase('assert Blockchain', async () => expect(actualDepository.blockchain).toBe(expectedDepository.blockchain));
      TCTesting.TestCase('assert AddressInBlockchain',
        async () => expect(actualDepository.addressInBlockchain).toBe(expectedDepository.addressInBlockchain));
    });
  }

  // name exist another user
  for (const test of [
    {name: 'testNameBinance', exchange: Exchanges.Binance, apiKey: 'apikey123-4534532df-fg4352345234', apiSecret: 'secret45-5432gfd-32gfbf'},
    {name: 'testNameKuCoin', exchange: Exchanges.KuCoin, apiKey: 'apikey123-4534532df-fg43523234', apiSecret: 'sect45-5432gfd-32gfbf', apiPassphrase: 'pass'}
  ]) {
    TCTesting.TestSuite(`(POST) Should create user depository exchange, depository not exist (exchange=${test.name})`, () => {

      let newExchangeResponse: DepositoryResponse;
      let newExchangeDb: DepositoryResponseModel;

      afterAll(async () => {
        await fixture.portfolio.deleteAllDepositoriesOfUser();
        fixture.defaultUser = fixture.config.users.default;
      });
      TCTesting.TestCase('http response code should be 200 OK', async () => {
        const response = await fixture.depositoryApiClient.createExchange(test);
        newExchangeResponse = response.message;
        newExchangeDb = await fixture.portfolio.getDepositoryOfUser();
        expect(response.statusCode).toBe(200);
      });
      TCTesting.TestCase('assert Id -> user depository Id', async () => expect(newExchangeResponse.id).toBe(newExchangeDb.id));
      TCTesting.TestCase('assert Name', async () => expect(newExchangeResponse.name).toBe(newExchangeDb.name));
      TCTesting.TestCase('assert Type', async () => expect(newExchangeResponse.type).toBe(newExchangeDb.type));
      TCTesting.TestCase('assert Status', async () => expect(newExchangeResponse.status).toBe(newExchangeDb.status));
      TCTesting.TestCase('assert AddressInBlockchain',
        async () => expect(newExchangeResponse.addressInBlockchain).toBe(newExchangeDb.addressInBlockchain));
      TCTesting.TestCase('assert ExchangePublicKey',
        async () => expect(newExchangeResponse.exchangePublicKey).toBe(newExchangeDb.exchangePublicKey));
      TCTesting.TestCase('assert Exchange', async () => expect(newExchangeResponse.exchange).toBe(newExchangeDb.exchange));
      TCTesting.TestCase('assert Blockchain', async () => expect(newExchangeResponse.blockchain).toBe(newExchangeDb.blockchain));
      TCTesting.TestCase('assert ApiPassphrase in db', async () =>
        expect(newExchangeDb.apiPassphrase).toBe(test.apiPassphrase === undefined ? null : test.apiPassphrase));
    });
  }

  // name exist another user
  TCTesting.TestSuite(`(POST) Should create user depository wallet, depository not exist (wallet=Bitcoin)`, () => {
    let newWalletResponse: DepositoryResponse;
    let newWalletDb: DepositoryResponseModel;

    afterAll(async () => {
      await fixture.portfolio.deleteAllDepositoriesOfUser();
      fixture.defaultUser = fixture.config.users.default;
    });
    TCTesting.TestCase('http response code should be 200 OK', async () => {
      const response = await fixture.depositoryApiClient.createWallet({
        blockchain: Blockchains.Bitcoin,
        name: 'testNameBitcoin',
        addressInBlockchain: fixture.config.addresses.bitcoin.shift()
      });
      newWalletResponse = response.message;
      newWalletDb = await fixture.portfolio.getDepositoryOfUser();
      expect(response.statusCode).toBe(200);
    });
    TCTesting.TestCase('assert Id -> user depository Id', async () => expect(newWalletResponse.id).toBe(newWalletDb.id));
    TCTesting.TestCase('assert Name', async () => expect(newWalletResponse.name).toBe(newWalletDb.name));
    TCTesting.TestCase('assert Type', async () => expect(newWalletResponse.type).toBe(newWalletDb.type));
    TCTesting.TestCase('assert Status', async () => expect(newWalletResponse.status).toBe(newWalletDb.status));
    TCTesting.TestCase('assert AddressInBlockchain', async () => expect(newWalletResponse.addressInBlockchain).toBe(newWalletDb.addressInBlockchain));
    TCTesting.TestCase('assert ExchangePublicKey', async () => expect(newWalletResponse.exchangePublicKey).toBe(newWalletDb.exchangePublicKey));
    TCTesting.TestCase('assert Exchange', async () => expect(newWalletResponse.exchange).toBe(newWalletDb.exchange));
    TCTesting.TestCase('assert Blockchain', async () => expect(newWalletResponse.blockchain).toBe(newWalletDb.blockchain));
    TCTesting.TestCase('assert ApiPassphrase in db', async () => expect(newWalletDb.apiPassphrase).toBe(null));
  });

  TCTesting.TestSuite(`(POST) Should create user depository exchange, when depository already exist on another user`, () => {

    let existDepository: DepositoryResponseModel;
    let newExchangeResponse: DepositoryResponse;
    let newExchangeDb: DepositoryResponseModel;

    beforeAll(async () => {
      await fixture.addExchanges(1, fixture.config.users.support.id);
      existDepository = await fixture.portfolio.getDepositoryOfUser(fixture.config.users.support.id);
    });
    afterAll(async () => {
      await fixture.portfolio.deleteAllDepositoriesOfUser();
      await fixture.portfolio.deleteAllDepositoriesOfUser(fixture.config.users.support.id);
      fixture.defaultUser = fixture.config.users.default;
    });
    TCTesting.TestCase('http response code should be 200 OK', async () => {
      const response = await fixture.depositoryApiClient.createExchange({
        exchange: existDepository.exchange,
        name: 'existedExchangeName',
        apiKey: existDepository.exchangePublicKey,
        apiSecret: existDepository.exchangePrivateKey
      });
      newExchangeResponse = response.message;
      newExchangeDb = await fixture.portfolio.getDepositoryOfUser();
      expect(response.statusCode).toBe(200);
    });
    TCTesting.TestCase('assert Id -> user depository Id', async () => expect(newExchangeResponse.id).toBe(newExchangeDb.id));
    TCTesting.TestCase('assert Depository Id to be of exist depository',
      async () => expect(newExchangeDb.depositoryId).toBe(existDepository.depositoryId));
    TCTesting.TestCase('assert Name', async () => expect(newExchangeResponse.name).toBe(newExchangeDb.name));
    TCTesting.TestCase('assert Type', async () => expect(newExchangeResponse.type).toBe(newExchangeDb.type));
    TCTesting.TestCase('assert Status', async () => expect(newExchangeResponse.status).toBe(newExchangeDb.status));
    TCTesting.TestCase('assert AddressInBlockchain', async () => expect(newExchangeResponse.addressInBlockchain).toBe(newExchangeDb.addressInBlockchain));
    TCTesting.TestCase('assert ExchangePublicKey', async () => expect(newExchangeResponse.exchangePublicKey).toBe(newExchangeDb.exchangePublicKey));
    TCTesting.TestCase('assert Exchange', async () => expect(newExchangeResponse.exchange).toBe(newExchangeDb.exchange));
    TCTesting.TestCase('assert Blockchain', async () => expect(newExchangeResponse.blockchain).toBe(newExchangeDb.blockchain));
  });

  TCTesting.TestSuite(`(POST) Should create user depository wallet, when depository already exist on another user`, () => {

    let existDepository: DepositoryResponseModel;
    let newWalletResponse: DepositoryResponse;
    let newWalletDb: DepositoryResponseModel;

    beforeAll(async () => {
      await fixture.addWallets(1, fixture.config.users.support.id);
      existDepository = await fixture.portfolio.getDepositoryOfUser(fixture.config.users.support.id);
    });
    afterAll(async () => {
      await fixture.portfolio.deleteAllDepositoriesOfUser();
      await fixture.portfolio.deleteAllDepositoriesOfUser(fixture.config.users.support.id);
      fixture.defaultUser = fixture.config.users.default;
    });
    TCTesting.TestCase('http response code should be 200 OK', async () => {
      const response = await fixture.depositoryApiClient.createWallet({
        blockchain: existDepository.blockchain,
        name: 'existedWalletName',
        addressInBlockchain: existDepository.addressInBlockchain
      });
      newWalletResponse = response.message;
      newWalletDb = await fixture.portfolio.getDepositoryOfUser();
      expect(response.statusCode).toBe(200);
    });
    TCTesting.TestCase('assert Id -> user depository Id', async () => expect(newWalletResponse.id).toBe(newWalletDb.id));
    TCTesting.TestCase('assert Depository Id to be of exist depository',
      async () => expect(newWalletDb.depositoryId).toBe(existDepository.depositoryId));
    TCTesting.TestCase('assert Name', async () => expect(newWalletResponse.name).toBe(newWalletDb.name));
    TCTesting.TestCase('assert Type', async () => expect(newWalletResponse.type).toBe(newWalletDb.type));
    TCTesting.TestCase('assert Status', async () => expect(newWalletResponse.status).toBe(newWalletDb.status));
    TCTesting.TestCase('assert AddressInBlockchain', async () => expect(newWalletResponse.addressInBlockchain).toBe(newWalletDb.addressInBlockchain));
    TCTesting.TestCase('assert ExchangePublicKey', async () => expect(newWalletResponse.exchangePublicKey).toBe(newWalletDb.exchangePublicKey));
    TCTesting.TestCase('assert Exchange', async () => expect(newWalletResponse.exchange).toBe(newWalletDb.exchange));
    TCTesting.TestCase('assert Blockchain', async () => expect(newWalletResponse.blockchain).toBe(newWalletDb.blockchain));
  });

  for (const test of [
    {name: 'exchange=>name', request: {name: 'editedName123'}},
    {name: 'exchange=>exchangePublicKey, exchangeSecret', request: {exchangePublicKey: `editedPublicKey123`, exchangeSecret: 'editedSecret123'}},
    {name: 'exchange=>exchangePublicKey, exchangeSecret, apiPassphrase',
      request: {exchangePublicKey: `editedPublicKey123`, exchangeSecret: 'editedSecret123', apiPassphrase: 'editedPassphrase123'}},
    {name: 'wallet=>name', request: {name: 'editedName123'}},
    {name: 'wallet=>addressInBlockchain', request: {addressInBlockchain: fixture.config.addresses.bitcoin[5]}}
  ]) {
    TCTesting.TestSuite(`(PUT) Should update user depository (${test.name})`, () => {
      let depositoryForUpdate: DepositoryResponseModel;
      let updateDepositoryDb: DepositoryResponseModel;
      let actualDepositoryResponse: DepositoryResponse;
      let updateRequest: DepositoryUpdateRequest;
      beforeAll(async () => {
        await fixture.addWallets(3);
        await fixture.addExchanges(3);
        const allDepositories = await fixture.portfolio.getDepositoriesOfUser();
        if (test.name.includes('exchange')) {
          depositoryForUpdate = allDepositories.filter(x => x.type === DepositoryType.Exchange).shift();
        }
        if (test.name.includes('wallet')) {
          depositoryForUpdate = allDepositories.filter(x => x.type === DepositoryType.BlockchainAddress).shift();
        }
        updateRequest = test.name.includes('exchange') ?
          {
            name: test.request.name ? test.request.name : depositoryForUpdate.name,
            exchangePublicKey: test.request.exchangePublicKey ? test.request.exchangePublicKey : depositoryForUpdate.exchangePublicKey,
            exchangeSecret: test.request.exchangeSecret ? test.request.exchangeSecret : null
          } :
          {
            name: test.request.name ? test.request.name : depositoryForUpdate.name,
            addressInBlockchain: test.request.addressInBlockchain ? test.request.addressInBlockchain : depositoryForUpdate.addressInBlockchain
          };
        if (test.request.apiPassphrase)
          updateRequest['apiPassphrase'] = test.request.apiPassphrase;
      });
      afterAll(async () => {
        await fixture.portfolio.deleteAllDepositoriesOfUser();
        fixture.defaultUser = fixture.config.users.default;
      });
      TCTesting.TestCase('http response code should be 200 OK', async () => {
        const response = await fixture.depositoryApiClient.updateDepository(depositoryForUpdate.id, updateRequest);
        actualDepositoryResponse = response.message;
        updateDepositoryDb = await fixture.portfolio.getDepositoryOfUser(fixture.testContext.user.id, x => x.id === depositoryForUpdate.id);
        expect(response.statusCode).toBe(200);
      });
      if (test.request.name)
        TCTesting.TestCase('assert Name will update', async () => expect(updateDepositoryDb.name).toBe(test.request.name));
      if (test.request.addressInBlockchain)
        TCTesting.TestCase('assert AddressInBlockchain will update',
          async () => expect(updateDepositoryDb.addressInBlockchain).toBe(test.request.addressInBlockchain));
      if (test.request.exchangePublicKey)
        TCTesting.TestCase('assert ExchangePublicKey will update',
          async () => expect(updateDepositoryDb.exchangePublicKey).toBe(test.request.exchangePublicKey));
      if (test.request.exchangeSecret)
        TCTesting.TestCase('assert ExchangePrivateKey will update',
          async () => expect(updateDepositoryDb.exchangePrivateKey).toBe(test.request.exchangeSecret));
      if (test.request.apiPassphrase)
        TCTesting.TestCase('assert ApiPassphrase will update',
          async () => expect(updateDepositoryDb.apiPassphrase).toBe(test.request.apiPassphrase));

      TCTesting.TestCase('assert Id -> user depository Id', async () => expect(actualDepositoryResponse.id).toBe(updateDepositoryDb.id));
      TCTesting.TestCase('assert Name', async () => expect(actualDepositoryResponse.name).toBe(updateDepositoryDb.name));
      TCTesting.TestCase('assert Type', async () => expect(actualDepositoryResponse.type).toBe(updateDepositoryDb.type));
      TCTesting.TestCase('assert Status', async () => expect(actualDepositoryResponse.status).toBe(updateDepositoryDb.status));
      TCTesting.TestCase('assert AddressInBlockchain',
        async () => expect(actualDepositoryResponse.addressInBlockchain).toBe(updateDepositoryDb.addressInBlockchain));
      TCTesting.TestCase('assert ExchangePublicKey',
        async () => expect(actualDepositoryResponse.exchangePublicKey).toBe(updateDepositoryDb.exchangePublicKey));
      TCTesting.TestCase('assert Exchange', async () => expect(actualDepositoryResponse.exchange).toBe(updateDepositoryDb.exchange));
      TCTesting.TestCase('assert Blockchain', async () => expect(actualDepositoryResponse.blockchain).toBe(updateDepositoryDb.blockchain));

    });
  }

  for (const test of [DepositoryType.Exchange, DepositoryType.BlockchainAddress]) {
    TCTesting.TestSuite(`(DELETE) Should remove user depository and source depository (${test === DepositoryType.Exchange ? 'Exchange' : 'Wallet'})`,
      () => {
      let depositoryForDelete: DepositoryResponseModel;
      beforeAll(async () => {
        if (test === DepositoryType.Exchange)
          await fixture.addExchanges(1);

        if (test === DepositoryType.BlockchainAddress)
          await fixture.addWallets(1);

        depositoryForDelete = await fixture.portfolio.getDepositoryOfUser(fixture.testContext.user.id, x => x.type === test);
      });
      afterAll(async () => {
        await fixture.portfolio.deleteAllDepositoriesOfUser();
        fixture.defaultUser = fixture.config.users.default;
      });
        TCTesting.TestCase('http response code should be 200 OK', async () => {
          const response = await fixture.depositoryApiClient.deleteDepository(depositoryForDelete.id);
          expect(response.statusCode).toBe(200);
        });
        TCTesting.TestCase('user depository should be removed from db', async () => {
          expect(await fixture.portfolio.depositoriesService.isUserDepositoryExist(depositoryForDelete.id)).toBeFalsy();
        });
        TCTesting.TestCase('depository should be removed from db', async () => {
          expect(await fixture.portfolio.depositoriesService.isDepositoryExist(depositoryForDelete.depositoryId)).toBeFalsy();
        });
    });
  }

  for (const test of [DepositoryType.Exchange, DepositoryType.BlockchainAddress]) {
    TCTesting.TestSuite(`(DELETE) Should remove user depository but not source depository if it attach at another user
      (${test === DepositoryType.Exchange ? 'Exchange' : 'Wallet'})`,
      () => {
        let depositoryOfAnotherUser: DepositoryResponseModel;
        let depositoryForDelete: DepositoryResponseModel;
        beforeAll(async () => {
          if (test === DepositoryType.Exchange) {
            await fixture.addExchanges(1, fixture.config.users.support.id);
            depositoryOfAnotherUser = await fixture.portfolio.getDepositoryOfUser(fixture.config.users.support.id, x => x.type === test);
            await fixture.portfolio.addExchangeToUser({
              id: depositoryOfAnotherUser.exchange,
              name: 'testDepositoryForDeleteE123',
              public: depositoryOfAnotherUser.exchangePublicKey,
              secret: depositoryOfAnotherUser.exchangePrivateKey
            });
          }

          if (test === DepositoryType.BlockchainAddress) {
            await fixture.addWallets(1, fixture.config.users.support.id);
            depositoryOfAnotherUser = await fixture.portfolio.getDepositoryOfUser(fixture.config.users.support.id, x => x.type === test);
            await fixture.portfolio.addWalletToUser({
              id: depositoryOfAnotherUser.blockchain,
              name: 'testDepositoryForDeleteW123',
              address: depositoryOfAnotherUser.addressInBlockchain
            });
          }

          depositoryForDelete = await fixture.portfolio.getDepositoryOfUser(fixture.testContext.user.id, x => x.type === test);
        });
        afterAll(async () => {
          await fixture.portfolio.deleteAllDepositoriesOfUser();
          await fixture.portfolio.deleteAllDepositoriesOfUser(fixture.config.users.support.id);
          fixture.defaultUser = fixture.config.users.default;
        });
        TCTesting.TestCase('http response code should be 200 OK', async () => {
          const response = await fixture.depositoryApiClient.deleteDepository(depositoryForDelete.id);
          expect(response.statusCode).toBe(200);
        });
        TCTesting.TestCase('user depository should be removed from db', async () => {
          expect(await fixture.portfolio.depositoriesService.isUserDepositoryExist(depositoryForDelete.id)).toBeFalsy();
        });
        TCTesting.TestCase('depository should be removed from db', async () => {
          expect(await fixture.portfolio.depositoriesService.isDepositoryExist(depositoryForDelete.depositoryId)).toBeTruthy();
        });

      });
  }

  TCTesting.TestSuite('404 Not Found test suite', () => {
    TCTesting.TestCase('(GET) Depository should return error, when received not existed id', async () => {
      const response = await fixture.depositoryApiClient.getDepository('7896356-456546456-6-54643');
      expect(response.statusCode).toBe(404);
      expect(response.error).toBe('', 'response should be empty');
    });
    TCTesting.TestCase(`(PUT) Depository should return error, when received not existed id`,
      async () => {
        const response = await fixture.depositoryApiClient.updateDepository('sdfgfg-fsadf-g4324-gdfgdf',
          {
            name: 'edited Name',
            exchangePublicKey: 'dsfsddfds',
            exchangeSecret: null
          });
        expect(response.statusCode).toBe(404);
        expect(response.error).toBe('', 'response should be empty');
      });
  });

  TCTesting.TestSuite('400 Bad Request test suite', () => {
    let exchangeDepository: DepositoryResponseModel;
    let walletDepository: DepositoryResponseModel;
    beforeAll(async () => {
      await fixture.addWallets(1);
      await fixture.addExchanges(1);
      exchangeDepository = await fixture.portfolio.getDepositoryOfUser(fixture.testContext.user.id, x => x.type === DepositoryType.Exchange);
      walletDepository = await fixture.portfolio.getDepositoryOfUser(fixture.testContext.user.id, x => x.type === DepositoryType.BlockchainAddress);
    });
    afterAll(async () => {
      await fixture.portfolio.deleteAllDepositoriesOfUser();
      fixture.defaultUser = fixture.config.users.default;
    });
    for (const address of [fixture.config.addresses.ethereum[4], '0x-invalid-bitcoin-address']) {
      TCTesting.TestCase(`(PUT) Should return error, when received invalid address (${address}) from other blockchain`, async () => {
        const response = await fixture.depositoryApiClient.updateDepository(walletDepository.id,
          {
            name: walletDepository.name,
            addressInBlockchain: address
          });
        expect(response.statusCode).toBe(400);
        expect(response.error.code).toBe('ValidationError');
      });
    }
  });

  TCTesting.TestSuite('403 Forbidden test suite', () => {

    let anotherUserDepositories: DepositoryResponseModel[];
    let anotherDepository: DepositoryResponseModel;
    let anotherDepositoryDb: DepositoryResponseModel;

    beforeAll(async () => {
      await fixture.addExchanges(3, fixture.config.users.support.id);
      await fixture.addWallets(3, fixture.config.users.support.id);
      anotherUserDepositories = await fixture.portfolio.getDepositoriesOfUser(fixture.config.users.support.id);
    });
    afterAll(async () => {
      await fixture.portfolio.deleteAllDepositoriesOfUser(fixture.config.users.support.id);
    });
    for (const test of [DepositoryType.Exchange, DepositoryType.BlockchainAddress]) {
      it (`(GET) Should return error, when depository id belong of another user (${test === DepositoryType.Exchange ? 'Exchange' : 'Wallet'})`,
        async () => {
        anotherDepository = anotherUserDepositories.find(x => x.type === test);
        const response = await fixture.depositoryApiClient.getDepository(anotherDepository.id);
        expect(response.statusCode).toBe(400);
        expect(response.error.code).toBe('ValidationError');
      });

      // (POST)

      // public exist current user

      // address exist current user

      // name exist current user


      // (PUT)

      // public exist current user

      // address exist current user

      // public exist another user

      // address exist another user

      // name exist current user

      TCTesting.TestCase(`(PUT) Should return error, when depository id belong of another user (${test === DepositoryType.Exchange ? 'Exchange' : 'Wallet'})`,
        async () => {
          anotherDepository = anotherUserDepositories.find(x => x.type === test);
          const response = await fixture.depositoryApiClient.updateDepository(anotherDepository.id,
            {
              name: 'editedAnotherName123',
              exchangePublicKey: anotherDepository.exchangePublicKey,
              exchangeSecret: null,
              addressInBlockchain: anotherDepository.addressInBlockchain
            });
          expect(response.statusCode).toBe(400);
          expect(response.error.code).toContain('ValidationError');
          anotherDepositoryDb = await fixture.portfolio.getDepositoryOfUser(fixture.config.users.support.id, x => x.id === anotherDepository.id);
          expect(anotherDepositoryDb.name).toBe(anotherDepository.name);
      });
    }
  });

  TCTesting.TestSuite('401 Unauthorized test suite', () => {

    let userDepositories: DepositoryResponseModel[];

    beforeAll(async () => {
      await fixture.addExchanges(1);
      await fixture.addWallets(1);
      await fixture.logout();
      userDepositories = await fixture.portfolio.getDepositoriesOfUser(fixture.defaultUser.id);
    });
    afterAll(async () => {
      await fixture.relogin(fixture.defaultUser);
      await fixture.portfolio.deleteAllDepositoriesOfUser();
    });

    TCTesting.TestCase('(GET) Depositories should return error, when token was not received', async () => {
      const response = await fixture.depositoryApiClient.getDepositories();
      expect(response.statusCode).toBe(401);
      expect(response.error).toBe('', 'response should be empty');
    });

    for (const test of [DepositoryType.Exchange, DepositoryType.BlockchainAddress]) {
      it ('(GET) Depository should return error, when token was not received', async () => {
        const response = await fixture.depositoryApiClient.getDepository(userDepositories.find(x => x.type === test).id);
        expect(response.statusCode).toBe(401);
        expect(response.error).toBe('', 'response should be empty');
      });

      TCTesting.TestCase(`(PUT) Should return error, when token was not received (${test === DepositoryType.Exchange ? 'Exchange' : 'Wallet'})`,
        async () => {
          const depositoryOfType = userDepositories.find(x => x.type === test);
          const response = await fixture.depositoryApiClient.updateDepository(depositoryOfType.id,
            {
              name: 'editedName123',
              exchangePublicKey: depositoryOfType.exchangePublicKey,
              exchangeSecret: null,
              addressInBlockchain: depositoryOfType.addressInBlockchain
            });
          expect(response.statusCode).toBe(401);
          expect(response.error).toBeUndefined('response should be empty');
        });
    }
  });

});
