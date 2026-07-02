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