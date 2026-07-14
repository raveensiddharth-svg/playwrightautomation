const {test, expect} = require("@playwright/test");
let webContext;
test.beforeAll(async ({browser})=> 
{
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/client");
    const emailField = page.locator("#userEmail");
    const passwordField = page.locator("[type='password']");
    const loginButton = page.locator("#login");

    await emailField.fill("raveen.siddharth@gmail.com");
    await passwordField.fill("Welcome@123");
    await loginButton.click();

    console.log("The page title is " + await page.title());
    await expect(page).toHaveTitle("Let's Shop");
    //Very very important so that the storage details will be written completely in the storage.json file
    await page.waitForLoadState('networkidle');

    //Create json file with the storage state
    await context.storageState({path:'storage.json'});
    //Set the storage to the browser context
    webContext = await browser.newContext({storageState:'storage.json'});

})

test('Login to Client app and fetch all the product names', async ()=>
{
    const page = await webContext.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    const productsName = page.locator("div.card-body b");
    await productsName.first().waitFor();
    console.log("The products names are " + await productsName.allTextContents());

    const products = page.locator(".card-body");
    const productCount = await products.count();

    const prodName = 'iphone 13 pro';
    for(let i=0;i < productCount; ++i) {
        if(await products.nth(i).locator("b").textContent() === prodName) {
            await products.nth(i).locator("text=' Add To Cart'").click();
            break;
        }
    }
    
    const cartButton = page.locator("[routerlink*='cart']");
    await cartButton.click();

    const productCards = page.locator(".cart li");
    await productCards.first().waitFor();
    
    const bool = await productCards.locator("h3:has-text('iphone 13 pro')").isVisible();
    await expect(bool).toBeTruthy();

    const checkOutBtn = page.locator("div.subtotal button");
    await checkOutBtn.click();

    await page.locator(".input").nth(3).fill("456");
    await page.locator(".input").nth(4).fill("Raveen Siddharth");
    await page.locator("[name='coupon']").fill("rahulshettyacademy");

    const applyCouponBtn = page.locator("[type='submit']");
    await applyCouponBtn.click();

    const confMsg = await page.locator("text='* Coupon Applied'").textContent();
    console.log("The confirmation msg on applying coupon is " + confMsg);
    
    const emailId = await page.locator("div.user__name input").first().inputValue();
    console.log("email id is " + emailId)
    expect(emailId).toEqual("raveen.siddharth@gmail.com");

    const countryDropDown = page.locator("[placeholder='Select Country']");
    await countryDropDown.pressSequentially("ind", {delay : 150});

    const options = page.locator(".form-group section");
    await options.waitFor();
    const optionCount = await options.locator("button").count();
    for(let i=0; i< optionCount; ++i) {
        if(await options.locator("button").nth(i).textContent() === ' India') {
            await options.locator("button").nth(i).click();
            break;
        }
    }
    
    const placeOrderButton = page.locator(".action__submit");
    await placeOrderButton.click();

    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    const rawId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    const orderId = rawId.split("|")[1].trim();

    console.log("The order id displayed is " + orderId);

    await page.locator("button[routerlink*='myorders']").click();

    const orderHistoryTableRows = page.locator("tr.ng-star-inserted");
    await orderHistoryTableRows.last().waitFor();
    const rowCount = await orderHistoryTableRows.count();
    for(let i=0;i<rowCount;++i) {
        const orderNumber = await orderHistoryTableRows.locator("[scope='row']").nth(i).textContent();
        if(orderNumber === orderId )
        {
            await orderHistoryTableRows.locator(".btn-primary").nth(i).click();
            break;
        }
    }
    await expect(page.locator(".tagline")).toHaveText("Thank you for Shopping With Us");
    const finalOrderId = await page.locator(".col-text").textContent();
    console.log("Final page order id is " + finalOrderId);
    expect(await orderId.includes(finalOrderId)).toBeTruthy();
})