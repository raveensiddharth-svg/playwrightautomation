const {test, expect} = require("@playwright/test");

test('Login to Client app and fetch all the product names', async ({page})=>
{
    await page.goto("https://rahulshettyacademy.com/client");
    const emailField = page.locator("#userEmail");
    const passwordField = page.locator("[type='password']");
    const loginButton = page.locator("#login");

    await emailField.fill("raveen.siddharth@gmail.com");
    await passwordField.fill("Welcome@123");
    await loginButton.click();

    console.log("The page title is " + await page.title());
    await expect(page).toHaveTitle("Let's Shop");

    const productsName = page.locator("div.card-body b");
    await productsName.first().waitFor();
    console.log("The products names are " + await productsName.allTextContents());

})