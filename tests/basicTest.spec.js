const {test,expect} = require("@playwright/test");

test("Open a website with browser context and function keyword", async function({browser})
{
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/practice");
});

test("Open a website with page context and without function keyword", async ({page})=>
{
    await page.goto("https://google.com");
    await expect(page).toHaveTitle("Google");
});

test("Test to assert the page title", async function({browser})
{
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/practice");
    const pageTitle = await page.title();
    console.log(pageTitle);
    await expect(page).toHaveTitle(pageTitle);
});

test('Test to login to RahulShettyAcademy and print the first item card name', async ({page})=>
{
    //navigate to the specific url
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

    //define the web elements
    const usernameField = page.locator("input#username");
    const passwordField = page.locator("[name='password']");
    const signInButton = page.locator("[type='submit']");

    //Type in the incorrect credentials and click on signin button
    await usernameField.fill("rahulShetty");
    await passwordField.fill("Learning@830$3mK2");
    await signInButton.click();
    //Validate the error message for incorrect credentials
    console.log("The error msg is " + await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText("username");

    //clear and enter the correct username and click on sign in button
    await usernameField.fill("");
    await usernameField.fill("rahulshettyacademy");
    await signInButton.click();

    //Assert the page title
    await expect(page).toHaveTitle("ProtoCommerce");

    //verify and assert the name of the product in the first card
    const cardProducts = page.locator("div.card-body a");
    const firstProductName = await cardProducts.nth(0).textContent();
    console.log("The first product name is " + await firstProductName);
    await expect(cardProducts.nth(0)).toContainText("iphone X");
})


test('UI Controls test', async ({page})=> 
{
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

    const usernameField = page.locator("input#username");
    const passwordField = page.locator("[name='password']");
    const signInButton = page.locator("[type='submit']");
    const userRadioBtn = page.locator("span.checkmark").last();
    const dropdown = page.locator("select.form-control");
    const terms = page.locator("input#terms");
    const documentLink = page.locator("[href*='documents-request']");

    await usernameField.fill("rahulshettyacademy");
    await passwordField.fill("Learning@830$3mK2");
    await userRadioBtn.click();
    await page.locator("#okayBtn").click();
    await expect(userRadioBtn).toBeChecked();
    await dropdown.selectOption("teach");
    await terms.click();
    expect(await terms.isChecked()).toBeTruthy();
    await terms.uncheck();
    expect(await terms.isChecked()).toBeFalsy();
    await expect(documentLink).toHaveAttribute("class","blinkingText");
})