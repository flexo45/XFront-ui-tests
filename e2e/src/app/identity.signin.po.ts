import { browser, by, element } from 'protractor';
import { TestConf } from '../test.conf';

export class SignInAppPage {

  private config = new TestConf();

  data = {
    header: 'Sign in',
    signUpQuestion: 'Don\'t have an account?',
    resetPasswordQuestion: 'Forgot password?',
    buttons: {
      signIn: 'Sign in',
      signUp: 'Sign up',
      reset: 'Reset'
    },
    placeholders: {
      email: 'Your email',
      password: 'Password'
    }
  };

  signInButton = element(by.css('app-sign-in form input[type=button]'));
  emailInput = element(by.css('app-sign-in form input[formcontrolname=login]'));
  passwordInput = element(by.css('app-sign-in form input[formcontrolname=password]'));

  header = element(by.css('app-sign-in h1'));

  async navigateTo() {
    await browser.get(this.config.identity.url + '/sign-in');
  }

  async clickSignInButton() {
    await this.signInButton.click();
  }

  async enterEmail(email: string) {
    await this.emailInput.sendKeys(email);
  }

  async enterPassword(password: string) {
    await this.passwordInput.sendKeys(password);
  }
}
