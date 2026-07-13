const {test, expect} = require("@playwright/test");

test('Login to Client app and fetch all the product names', async ({page})=>
{
    await page.goto("https://rahulshettyacademy.com/client");
    const emailField = page.getByPlaceholder("email@example.com");
    const passwordField = page.getByPlaceholder("enter your passsword");
    const loginButton = page.getByRole("button",{name:'Login'});

    await emailField.fill("raveen.siddharth@gmail.com");
    await passwordField.fill("Welcome@123");
    await loginButton.click();

    console.log("The page title is " + await page.title());
    await expect(page).toHaveTitle("Let's Shop");

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
    
    const cartButton = page.getByRole("listitem").getByRole("button",{name:'Cart'});
    await cartButton.click();

    const productCards = page.locator(".cart li");
    await productCards.first().waitFor();
    
    const bool = await productCards.locator("h3:has-text('iphone 13 pro')").isVisible();
    await expect(bool).toBeTruthy();

    const checkOutBtn = page.getByRole("button",{name:'Checkout'});
    await checkOutBtn.click();

    await page.locator(".input").nth(3).fill("456");
    await page.locator(".input").nth(4).fill("Raveen Siddharth");
    await page.locator("[name='coupon']").fill("rahulshettyacademy");

    const applyCouponBtn = page.getByRole("button",{name:'Apply Coupon'});
    await applyCouponBtn.click();

    const msg = await page.getByText("* Coupon Applied").textContent();
    console.log("The confirmation msg on applying coupon is " + msg);
    
    const emailId = await page.locator("div.user__name input").first().inputValue();
    console.log("email id is " + emailId)
    expect(emailId).toEqual("raveen.siddharth@gmail.com");

    const countryDropDown = page.getByPlaceholder("Select Country");
    await countryDropDown.pressSequentially("ind", {delay : 150});

    const options = page.locator(".form-group section");
    await options.waitFor();
    await page.getByRole("button",{name:'India'}).nth(1).click();
    
    const placeOrderButton = page.getByText('Place Order ');
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