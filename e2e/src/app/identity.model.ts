import {browser, by, element, protractor} from 'protractor';
import {SignInAppPage} from './identity.signin.po';

export class IdentityModel {

  constructor (public identitySignIn: SignInAppPage) {}

  async isLoggedIn(): Promise<boolean> {
    const deferred = protractor.promise.defer<boolean>();
    const access_token = await browser.executeScript('return localStorage.getItem("access_token")');
    const id_token = await browser.executeScript('return localStorage.getItem("id_token")');
    const hasAccessToken = (access_token !== null);
    const hasIdToken = (id_token !== null);
    console.log('access_token = ' + access_token + ', ' + hasAccessToken);
    console.log('id_token = ' + access_token + ', ' + hasIdToken);
    deferred.fulfill(hasAccessToken && hasIdToken);
    return Promise.resolve(deferred.promise);
  }

  async login(login: string, password: string) {
    await this.identitySignIn.enterEmail(login);
    await this.identitySignIn.enterPassword(password);
    await this.identitySignIn.clickSignInButton();
  }
}
