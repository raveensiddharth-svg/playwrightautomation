import {Page,Locator} from '@playwright/test';

export class OrderHistoryPageObject {
    page : Page;
    orderHistoryTableRows : Locator;
    finalOrderId : Locator;
constructor(page : Page) {
    this.page = page;
    this.orderHistoryTableRows = page.locator("tr.ng-star-inserted");
    this.finalOrderId = page.locator(".col-text");
}

async viewOrderFromOrderHistoryPage() {
    await this.orderHistoryTableRows.last().waitFor();
    const rowCount = await this.orderHistoryTableRows.count();
    for(let i=0;i<rowCount;++i) {
        const orderNumber = await this.orderHistoryTableRows.locator("[scope='row']").nth(i).textContent();
        if(orderNumber === (globalThis as any).orderId )
        {
            await this.orderHistoryTableRows.locator(".btn-primary").nth(i).click();
            break;
        }
    }
}

async getFinalOrderId() {
    const orderId = await this.finalOrderId.textContent();
    return orderId;
}
}