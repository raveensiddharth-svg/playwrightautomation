import {Page,Locator} from '@playwright/test';

export class LoginPageObject {

    page : Page;
    emailField : Locator;
    passwordField : Locator;
    loginButton : Locator;

constructor(page : Page) {
    this.page = page;
    this.emailField = page.locator("#userEmail");
    this.passwordField = page.locator("[type='password']");
    this.loginButton = page.locator("#login");
}

async loginWithValidCredentials() {
        await this.emailField.fill("raveen.siddharth@gmail.com");
        await this.passwordField.fill("Welcome@123");
        await this.loginButton.click();
}

async navigateToClientApp() {
    await this.page.goto("https://rahulshettyacademy.com/client");
}
}