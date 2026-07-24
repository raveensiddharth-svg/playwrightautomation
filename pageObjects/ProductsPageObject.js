class ProductsPageObject{

constructor(page) {
    this.page = page;
    this.productsName = page.locator("div.card-body b");
    this.products = page.locator(".card-body");
    this.cartButton = page.locator("[routerlink*='cart']");
}

async addProductsToCart() {
    await this.productsName.first().waitFor();
    console.log("The products names are " + await this.productsName.allTextContents());
    const productCount = await this.products.count();
    const prodName = 'iphone 13 pro';
    for(let i=0;i < productCount; ++i) {
        if(await this.products.nth(i).locator("b").textContent() === prodName) {
            await this.products.nth(i).locator("text=' Add To Cart'").click();
            break;
        }
    }
}

async navigateToCart() {
    await this.cartButton.click();
}
}
module.exports = {ProductsPageObject};