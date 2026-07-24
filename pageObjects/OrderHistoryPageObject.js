class OrderHistoryPageObject {

constructor(page) {
    this.page = page;
    this.orderHistoryTableRows = page.locator("tr.ng-star-inserted");
    this.finalOrderId = page.locator(".col-text");
}

async viewOrderFromOrderHistoryPage() {
    await this.orderHistoryTableRows.last().waitFor();
    const rowCount = await this.orderHistoryTableRows.count();
    for(let i=0;i<rowCount;++i) {
        const orderNumber = await this.orderHistoryTableRows.locator("[scope='row']").nth(i).textContent();
        if(orderNumber === globalThis.orderId )
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
module.exports = {OrderHistoryPageObject};