class OrderDetailsPageObject {

constructor(page) {
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
    const rawId = await this.orderIdElement.textContent();
    const orderId = rawId.split("|")[1].trim();
    return orderId;
}

async navigateToOrderHistoryPage() {
    await this.orderHistory.click();
}
}
module.exports = {OrderDetailsPageObject};