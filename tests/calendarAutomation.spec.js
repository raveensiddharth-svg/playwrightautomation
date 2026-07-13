const {test,expect} = require("@playwright/test");

test('Automate and validate calendars', async ({page})=> 
{
    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");

    const date = "29";
    const month = "7";
    const year = "2026";
    const expected= [month,date,year];

    await page.locator("div.react-date-picker__inputGroup").click();
    await page.locator("button.react-calendar__navigation__label").click();
    await page.locator("button.react-calendar__navigation__label").click();
    await page.getByRole("button",{name:year}).click();
    await page.locator("div.react-calendar__year-view__months button").nth(Number(month)-1).click();
    await page.getByRole("button",{name:date}).nth(1).click();

    const inputs = page.locator("input.react-date-picker__inputGroup__input");

    for(let i=0;i<expected.length;i++) {
        const value = await inputs.nth(i).inputValue();
        expect(value).toEqual(expected[i]);
    }
    
})