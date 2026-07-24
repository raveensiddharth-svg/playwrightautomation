import {Page,Locator} from '@playwright/test';

export class CheckoutPageObject {

    page : Page;
    inputBox : Locator;
    couponField : Locator;
    applyCouponBtn : Locator;
    couponText : Locator;
    emailIdLabel : Locator;
    countryDropDown : Locator;
    options : Locator;
    placeOrderButton : Locator;


constructor(page : Page) {
    this.page = page;
    this.inputBox = page.locator(".input");
    this.couponField = page.locator("[name='coupon']");
    this.applyCouponBtn = page.locator("[type='submit']");
    this.couponText = page.locator("text='* Coupon Applied'");
    this.emailIdLabel = page.locator("div.user__name input");
    this.countryDropDown = page.locator("[placeholder='Select Country']");
    this.options = page.locator(".form-group section");
    this.placeOrderButton = page.locator(".action__submit");
}

async fillDetails() {
    await this.inputBox.nth(3).fill("456");
    await this.inputBox.nth(4).fill("Raveen Siddharth");
    await this.couponField.fill("rahulshettyacademy");
    await this.applyCouponBtn.click();
}

async verifyCoupleAppliedMsg() {
    const confMsg = await this.couponText.textContent();
    return confMsg;
}

async verifyValidEmailIdDisplayed() {
    const emailId = await this.emailIdLabel.first().inputValue();
    return emailId;
}

async chooseIndiaFromDropDown() {
    await this.countryDropDown.pressSequentially("ind", {delay : 150});
    
    await this.options.waitFor();
    const optionCount = await this.options.locator("button").count();
    for(let i=0; i< optionCount; ++i) {
        if(await this.options.locator("button").nth(i).textContent() === ' India') {
            await this.options.locator("button").nth(i).click();
            break;
        }
    }
}

async clickOnPlaceOrder() {
    await this.placeOrderButton.click();
}


}