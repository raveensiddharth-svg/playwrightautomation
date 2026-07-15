const { test, expect } = require('@playwright/test');
const ExcelJS = require('exceljs');
const fs = require('fs');

let rowNumber;
let colNumber;
let worksheet;
let workbook;

async function writeExcel(filePath, sheetName, searchText, replaceText) {
    workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    worksheet = workbook.getWorksheet(sheetName);
    await readExcel(searchText);
    const cell = worksheet.getCell(rowNumber, colNumber);
    cell.value = replaceText;
    await workbook.xlsx.writeFile(filePath);
};

async function readExcel(searchText) {
    await worksheet.eachRow((row, rowNum) => {
        row.eachCell((cell, colNum) => {
            if (cell.value === searchText) {
                rowNumber = rowNum;
                colNumber = colNum;
            }
        });
    });
};



test("Upload Download Excel modifications", async ({ page }) => {

    await page.goto("https://rahulshettyacademy.com/upload-download-test/");
    await page.waitForLoadState('networkidle');
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator("#downloadButton").click(),
    ]);
    await download.saveAs("C:\\Users\\Windows\\Downloads\\download.xlsx");
    await writeExcel("C:\\Users\\Windows\\Downloads\\download.xlsx", "Sheet1", "Mango", "Pikachu");
    // await page.locator("#fileinput").click();
    await page.locator("#fileinput").setInputFiles("C:\\Users\\Windows\\Downloads\\download.xlsx");
    const element = page.locator("#cell-2-undefined").first();
    const name = await element.textContent();
    console.log("The name is " + name);
    expect(name === 'Pikachu').toBeTruthy();

    try {
        fs.unlinkSync("C:\\Users\\Windows\\Downloads\\download.xlsx");
        console.log('Deleted downloaded file successfully.');
    } catch (err) {
        console.warn('Could not delete downloaded file:', err.message);
    }
});
