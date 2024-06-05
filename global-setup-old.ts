import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { json } from 'stream/consumers';
const username = process.env.ACCT_LOGIN;
const password = process.env.ACCT_PASSWORD;



const jsonData = require('D:/a/BA-regressions-T6/BA-regressions-T6/datetime.json');



test("setup checks", async ({ page }) => {
  test.slow();
  jsonData.datetime = "";
  jsonData.started = false;
  jsonData.failures = false;
  jsonData.finished = false;
  const jsonString = JSON.stringify(jsonData, null, 2);
  fs.writeFileSync('D:/a/BA-regressions-T6/BA-regressions-T6/datetime.json', jsonString);

  // INITIAL LOG IN
  await page.goto('https://target110.brightarrow.com/r/');
  await page.getByLabel('Username').click();
  await page.getByLabel('Username').fill(`${username}`);
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill(`${password}`);
  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/report/GetWeeklySummary?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('button', { name: 'Sign in' }).click()
  ]);
  await expect(page.getByText('Welcome, Ryan test')).toBeVisible();
  await expect(page.frameLocator('iframe[title="Help Scout Beacon - Messages and Notifications"]').getByText('Hi, I\'m the new BrightArrow')).toBeVisible();
  await page.frameLocator('iframe[title="Help Scout Beacon - Messages and Notifications"]').getByRole('button', { name: 'Close' }).click();


  // 001 CREATE LIST (auto list 1) - CHECK
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 1');
  const [request2] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListsFromFolder?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByLabel('Search').press('Enter')
  ]);
  await expect(page.getByRole('button', { name: 'test folder' })).toBeHidden();      //new
  const myElement = page.locator('.listOfListsRow > td').first();
  if (await myElement.isVisible()) {
    await page.locator('input[name="cb_lists2039717"]').check();
    await page.getByRole('button', { name: 'Select an Action' }).click();
    await page.getByRole('button', { name: 'Delete a list' }).click();
    const [request3] = await Promise.all([
      page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/DeleteList?accessToken=") && response.status() === 200, {timeout: 60000}),
      page.getByRole('button', { name: 'OK' }).click()
    ]);
    await expect(page.getByText('ryan test Lists (0)')).toBeVisible();
    await page.locator('#searchBarBtn').click();
    await page.locator('input[name="cb_lists2039717"]').uncheck();
    await page.getByRole('button', { name: 'ryan test' }).click();
    await page.getByLabel('Search').click();
    await page.getByLabel('Search').fill('auto list 1');
    await page.getByLabel('Search').press('Enter')
  }
  await expect(page.getByRole('button', { name: 'test folder' })).toBeHidden();         //new
  await expect(page.getByText('ryan test Lists (0)')).toBeVisible();
  
  
  //002 CREATE LIST (auto list 2) - CHECK
  await page.locator('#searchBarBtn').click();
  await expect(page.getByRole('link', { name: 'test list 1' })).toBeVisible();  //new
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 2');
  //await page.getByLabel('Search').press('Enter');
  const [request4_1] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListsFromFolder?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByLabel('Search').press('Enter')
  ]);
  await expect(page.getByRole('button', { name: 'test folder' })).toBeHidden();    //new
  const myElement2 = page.locator('.listOfListsRow > td').first();
  if (await myElement.isVisible()) {
    await page.locator('input[name="cb_lists2039717"]').check();
    await page.getByRole('button', { name: 'Select an Action' }).click();
    await page.getByRole('button', { name: 'Delete a list' }).click();
    const [request4] = await Promise.all([
      page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/DeleteList?accessToken=") && response.status() === 200, {timeout: 60000}),
      page.getByRole('button', { name: 'OK' }).click()
    ]);
  }
  await expect(page.getByRole('button', { name: 'test folder' })).toBeHidden();         //new
  await expect(page.getByText('ryan test Lists (0)')).toBeVisible();
  //await page.locator('#searchBarBtn').click();
  const [request4_2] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListsFromFolder?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.locator('#searchBarBtn').click()
  ]);
  await expect(page.getByRole('button', { name: 'ryan test' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'test list 1' })).toBeVisible();      //new
  await page.getByTestId('MenuIcon').click();
  await page.getByRole('button', { name: 'BrightArrow Central' }).click();
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  //await expect(page.getByText('ryan test Lists (2)')).toBeVisible();


  /*
  // 003 CREATE FOLDER - CHECK
  const myElement3 = page.getByRole('button', { name: 'auto folder' });
  //const myElement3 = page.locator("auto folder");
  if (await myElement3.isVisible()) {
    await page.getByRole('button', { name: 'auto folder' }).click();
    await page.getByRole('link', { name: 'Delete Folder' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
    await expect(page.getByRole('button', { name: 'ryan test' })).toBeVisible();
    await page.getByRole('button', { name: 'ryan test' }).click();
  }
  */

  await page.getByRole('button', { name: 'auto folder' }).click();
  await page.getByRole('link', { name: 'Delete Folder' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByRole('button', { name: 'ryan test' })).toBeVisible();
  await page.getByRole('button', { name: 'ryan test' }).click();


  //004 CREATE LIST IN NEW FOLDER - CHECK
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 3');
  const [request5] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListsFromFolder?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByLabel('Search').press('Enter')
  ]);
  const myElement4 = page.locator('.listOfListsRow > td').first();
  if (await myElement4.isVisible()) {
    await page.locator('input[name="cb_lists2039717"]').check();
    await page.getByRole('button', { name: 'Select an Action' }).click();
    await page.getByRole('button', { name: 'Delete a list' }).click();
    const [request3] = await Promise.all([
      page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/DeleteList?accessToken=") && response.status() === 200, {timeout: 60000}),
      page.getByRole('button', { name: 'OK' }).click()
    ]);
  }
  await expect(page.getByText('ryan test Lists (0)')).toBeVisible();
  await page.locator('#searchBarBtn').click();
  

  // 005 CREATE CONTACT - CHECK

});
