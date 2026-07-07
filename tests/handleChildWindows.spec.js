const {test, expect} = require("@playwright/test");

test('Child window handling', async ({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

    const documentLink = page.locator("[href*='documents-request']");
    const usernameField = page.locator("input#username");

    const [childPage] = await Promise.all(
        [context.waitForEvent('page'),
        await documentLink.click()]
    );

    const sentence = await childPage.locator(".red").textContent();    
    console.log(sentence);

    const text = sentence.split("@");
    console.log("The overall text after @ split is " + text[1]);
    const domain = text[1].split(" ")[0];

    console.log("The domain name is " + domain);

    await usernameField.fill(domain);
    await page.pause();
    console.log("The username entered is " + await usernameField.inputValue());
    


})