import {Page,Locator} from '@playwright/test';

export class CartPageObject {

    page : Page;
    productCards : Locator;
    checkOutBtn : Locator;
constructor(page:Page) {
    this.page = page;
    this.productCards = page.locator(".cart li");
    this.checkOutBtn = page.locator("div.subtotal button");
}


async verifyProductsAddedToCart() {
    await this.productCards.first().waitFor();
    const bool = await this.productCards.locator("h3:has-text('iphone 13 pro')").isVisible();
    return bool;
}

async navigateToCheckoutPage() {
    await this.checkOutBtn.click();
}
}