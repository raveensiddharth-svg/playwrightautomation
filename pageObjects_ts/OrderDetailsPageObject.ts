import {Page,Locator} from '@playwright/test';

export class OrderDetailsPageObject {

    page : Page;
    thanksBanner : Locator;
    orderIdElement : Locator;
    orderHistory : Locator;

constructor(page:Page) {
    this.page = page;
    this.thanksBanner = page.locator(".hero-primary");
    this.orderIdElement = page.locator(".em-spacer-1 .ng-star-inserted");
    this.orderHistory = page.locator("button[routerlink*='myorders']");
}

async verifyThanksMsg() {
    const thankYouMsg = await this.thanksBanner.textContent();
    return thankYouMsg;
}

async trimOrderId() {
    let rawId : any;
    rawId = await this.orderIdElement.textContent();
    let orderId : any;
    orderId = rawId.split("|")[1].trim();
    return orderId;
}

async navigateToOrderHistoryPage() {
    await this.orderHistory.click();
}
}