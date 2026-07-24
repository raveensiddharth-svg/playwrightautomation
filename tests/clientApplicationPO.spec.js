const {test, expect} = require("@playwright/test");
const {LoginPageObject} = require("../pageObjects/LoginPageObject.js");
const {ProductsPageObject} = require("../pageObjects/ProductsPageObject.js");
const {CartPageObject} = require("../pageObjects/CartPageObject.js");
const {CheckoutPageObject} = require("../pageObjects/CheckoutPageObject.js");
const {OrderDetailsPageObject} = require("../pageObjects/OrderDetailsPageObject.js");
const {OrderHistoryPageObject} = require("../pageObjects/OrderHistoryPageObject.js");

test('Login to Client app and fetch all the product names', async ({page})=>
{
    const loginpage = new LoginPageObject(page);
    await loginpage.navigateToClientApp();
    await loginpage.loginWithValidCredentials();
    await expect(page).toHaveTitle("Let's Shop");

    const productspage = new ProductsPageObject(page);
    await productspage.addProductsToCart();
    await productspage.navigateToCart();

    const cartpage = new CartPageObject(page);
    const resp = await cartpage.verifyProductsAddedToCart();
    await expect(resp).toBeTruthy();
    await cartpage.navigateToCheckoutPage();
    //-----------------------------------------------------------------------------------------

    const checkoutpage = new CheckoutPageObject(page);
    await checkoutpage.fillDetails();
    const couponAppMsg = await checkoutpage.verifyCoupleAppliedMsg();
    await expect(couponAppMsg).toEqual("* Coupon Applied");
    const emailId = await checkoutpage.verifyValidEmailIdDisplayed();
    expect(emailId).toEqual("raveen.siddharth@gmail.com");
    await checkoutpage.chooseIndiaFromDropDown();
    await checkoutpage.clickOnPlaceOrder();
    //-----------------------------------------------------------------------------------------

    const orderdetailspage = new OrderDetailsPageObject(page);
    const thanksMsg = await orderdetailspage.verifyThanksMsg();
    expect(thanksMsg).toEqual(" Thankyou for the order. ");
    globalThis.orderId = await orderdetailspage.trimOrderId();
    await orderdetailspage.navigateToOrderHistoryPage();
    //-----------------------------------------------------------------------------------------

    const orderhistorypage = new OrderHistoryPageObject(page);
    await orderhistorypage.viewOrderFromOrderHistoryPage();
    await expect(page.locator(".tagline")).toHaveText("Thank you for Shopping With Us");
    const finalOrderId = await orderhistorypage.getFinalOrderId();
    expect(await globalThis.orderId.includes(finalOrderId)).toBeTruthy();
});