import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { json } from 'stream/consumers';
const username = process.env.ACCT_LOGIN;
const password = process.env.ACCT_PASSWORD;



const jsonData = require('D:/a/BA-regressions-T6/BA-regressions-T6/datetime.json');



test("setup checks", async ({ page }) => {
  //test.slow();
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


  
  // sets starting folder to ryan test
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByTestId('MenuIcon').locator('path').click();
  await page.getByRole('button', { name: 'BrightArrow Central' }).click();

  // 001 CREATE LIST (auto list 1) - CHECK IF NOT ALREADY DELETED
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
    await page.getByLabel('Search').press('Enter');
  }
  await expect(page.getByRole('button', { name: 'test folder' })).toBeHidden();         //new
  await expect(page.getByText('ryan test Lists (0)')).toBeVisible();
  
  
  //002 CREATE LIST (auto list 2) - CHECK IF NOT ALREADY DELETED
  await page.locator('#searchBarBtn').click();
  await expect(page.getByRole('link', { name: 'test list 1', exact: true })).toBeVisible();  //new
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
  await expect(page.getByRole('link', { name: 'test list 1', exact: true })).toBeVisible();      //new
  await page.getByTestId('MenuIcon').click();
  await page.getByRole('button', { name: 'BrightArrow Central' }).click();
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  //await expect(page.getByText('ryan test Lists (2)')).toBeVisible();


  //003 CREATE FOLDER - CHECK IF NOT ALREADY DELETED
  const myElement3 = page.locator('_react=button[title="auto folder"]');
  if (await myElement3.isVisible()) { 
    const [request6] = await Promise.all([
      page.waitForResponse(response => response.url().includes("TargetAPI/api/Folder/SetSelectedFolderSettings?accessToken=") && response.status() === 200, {timeout: 60000}),
      page.locator('_react=button[title="auto folder"]').click()
    ]);
    //await page.locator('_react=button[title="auto folder"]').click();
    await expect(page.getByRole('link', { name: 'test list 1' })).toBeHidden();

    //await expect(page.getByRole('link', { name: 'auto list' })).toBeVisible();
    //await expect(page.getByText('auto folder Lists (1)')).toBeVisible();

    await page.getByRole('link', { name: 'Delete Folder' }).click();
    await expect(page.getByText('Do you wish to delete the')).toBeVisible();
    await page.getByRole('button', { name: 'OK' }).click();
    //await expect(page.getByText('ryan test Lists (3)')).toBeVisible();
    await expect(page.getByRole('link', { name: 'test list 1', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'ryan test' }).click();
  }

  

  //004 CREATE LIST IN NEW FOLDER - CHECK if not already deleted
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 3');
  const [request5] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListsFromFolder?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByLabel('Search').press('Enter')
  ]);
  await page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListsFromFolder?accessToken=") && response.status() === 200, {timeout: 60000});
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
  

  // 011 Hide Disabled Contacts Button - CHECK AND MAKE SURE CHECKBOX IS SET TO DEFAULT 'UNCHECKED'
  //ran in reverse order with 010 bc this impacts 010 check run
  await page.getByRole('button', { name: 'ryan test' }).click();
  const [request7] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialListContact/LoadContacts?accessToken=") && response.status() === 200, { timeout: 60000}),
    page.getByRole('link', { name: 'test list 5'}).click()
  ]);
  //await expect(page.locator('p').filter({ hasText: 'Hide Disabled Contacts' }).getByTestId('CheckBoxOutlineBlankIcon')).toBeVisible();
  if (await page.locator('p').filter({ hasText: 'Hide Disabled Contacts' }).getByTestId('CheckBoxIcon').isVisible()) {
    await page.locator('#hideDisabledButton').uncheck();
  }

  await expect(page.getByRole('cell', { name: 'parent, phone' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'phone, ryan' })).toBeVisible();

  // 010 disable contact - make sure all contacts are enabled before test run. phone, ryan is contact that gets turned off
  await page.getByTestId('MenuIcon').click();
  await page.getByRole('button', { name: 'BrightArrow Central' }).click();
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  const [request8] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialListContact/LoadContacts?accessToken=") && response.status() === 200, { timeout: 60000}),
    page.getByRole('link', { name: 'test list 4'}).click()
  ]);

  if (await page.locator('tr').filter({ hasText: 'parent, phone8624385648' }).getByTestId('CheckBoxIcon').isHidden()) {
    await page.locator('#cb_list492061456').uncheck();
  }

  if (await page.locator('tr').filter({ hasText: 'phone, ryan5555555557' }).getByTestId('CheckBoxIcon').isHidden()) {
    //await page.locator('#cb_list438620451').check();
    const [request8] = await Promise.all([
      page.waitForResponse(response => response.url().includes("TargetAPI/api/dialListContact/EnableContact?accessToken=") && response.status() === 200, { timeout: 60000}),
      page.locator('#cb_list492061458').check()
    ]);
  }


  //008 reset favorites folder
  await page.getByTestId('MenuIcon').click();
  await page.getByRole('button', { name: 'BrightArrow Central' }).click();
  await expect(page.getByText('Welcome, Ryan test')).toBeVisible();
  //error to watch out for on line below
  // Error: locator.click: Error: strict mode violation: locator('div').filter({ hasText: /^My Lists$/ }) resolved to 2 elements:
  //   1) <div tabindex="0" role="button" class="MuiButtonBase-…>…</div> aka getByRole('button', { name: 'My Lists' })
  //   2) <div class="MuiListItemText-root css-1tsvksn">…</div> aka getByRole('button', { name: 'My Lists' })

  //await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  const [request9_0] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListsFromFolder?accessToken=") && response.status() === 200, { timeout: 60000}),
    page.locator('div').filter({ hasText: /^My Lists$/ }).click()
  ]);

  //await page.getByRole('button', { name: 'ryan test' }).click();
  await expect(page.getByRole('link', { name: 'test list 1', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'test list 2' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'test list 3' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'test list 4' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'test list 5' })).toBeVisible();
  //await page.getByRole('button', { name: 'My Favorites' }).click();
  const [request9] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/Folder/SetSelectedFolderSettings?accessToken=") && response.status() === 200, { timeout: 60000}),
    page.getByRole('button', { name: 'My Favorites' }).click()
  ]);
  await page.waitForResponse(response => response.url().includes("TargetAPI/api/Message/Logger") && response.status() === 200, { timeout: 60000});
  await expect(page.getByRole('link', { name: 'test list 4' })).not.toBeVisible();  //sometimes there is split second window where api responds but page doesnt fully update
  await expect(page.getByText('My Favorites Lists')).toBeVisible();
  const myElement5 = page.locator('.listOfListsRow > td').first();
  //const myElement5 = page.getByRole('link', { name: 'test list' });
  //const myElement5 = page.locator('_react=[id="btn_list8281415"]')
  if (await myElement5.isVisible()) {
    await page.getByRole('link', { name: 'test list 1' }).hover();
    await page.getByRole('link', { name: 'Remove from folder' }).click();
    const [request10] = await Promise.all([
      page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListsFromFolder?accessToken=") && response.status() === 200, { timeout: 60000}),
      page.getByRole('button', { name: 'OK' }).click()
    ]);
  }

  await page.getByRole('button', { name: 'ryan test' }).click();

  //i forgot what below was 
  // if (await page.locator('tr').filter({ hasText: 'Contact1, Auto' }).isVisible()) {
  //   await page.getByRole('row', { name: 'Contact1, Auto 5555555555,' }).getByRole('button').nth(1).click();
  //   await page.getByRole('button', { name: 'Yes' }).click();
  //   await expect(page.getByRole('cell', { name: 'Contact1, Auto' })).not.toBeVisible();
  // }

  // if (await page.locator('tr').filter({ hasText: 'Contact2, Auto' }).isVisible()) {
  //   await page.getByRole('row', { name: 'Contact2, Auto 5555555555,' }).getByRole('button').nth(1).click();
  //   await page.getByRole('button', { name: 'Yes' }).click();
  //   await expect(page.getByRole('cell', { name: 'Contact2, Auto' })).not.toBeVisible();
  // }


  //  subset list test teardown
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('subset list 1');
  const [request11] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListsFromFolder?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByLabel('Search').press('Enter')
  ]);
  await expect(page.getByRole('button', { name: 'test folder' })).toBeHidden();      //new

  const myElement6 = page.locator('.listOfListsRow > td').first();
  if (await myElement6.isVisible()) {
    await page.locator('input[name="cb_lists2039717"]').check();
    await page.getByRole('button', { name: 'Select an Action' }).click();
    await page.getByRole('button', { name: 'Delete a list' }).click();
    const [request12] = await Promise.all([
      page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/DeleteList?accessToken=") && response.status() === 200, {timeout: 60000}),
      page.getByRole('button', { name: 'OK' }).click()
    ]);
    await expect(page.getByText('ryan test Lists (0)')).toBeVisible();
    await page.locator('#searchBarBtn').click();
    await page.locator('input[name="cb_lists2039717"]').uncheck();
    await page.getByRole('button', { name: 'ryan test' }).click();
    await page.getByLabel('Search').click();
    await page.getByLabel('Search').fill('subset list 1');
    await page.getByLabel('Search').press('Enter');
  }
  await expect(page.getByRole('button', { name: 'test folder' })).toBeHidden();         //new
  await expect(page.getByText('ryan test Lists (0)')).toBeVisible();


  //  superset list test teardown
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('superset list 1');
  const [request13] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListsFromFolder?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByLabel('Search').press('Enter')
  ]);
  await expect(page.getByRole('button', { name: 'test folder' })).toBeHidden();      //new

  const myElement7 = page.locator('.listOfListsRow > td').first();
  if (await myElement7.isVisible()) {
    await page.locator('input[name="cb_lists2039717"]').check();
    await page.getByRole('button', { name: 'Select an Action' }).click();
    await page.getByRole('button', { name: 'Delete a list' }).click();
    const [request14] = await Promise.all([
      page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/DeleteList?accessToken=") && response.status() === 200, {timeout: 60000}),
      page.getByRole('button', { name: 'OK' }).click()
    ]);
    await expect(page.getByText('ryan test Lists (0)')).toBeVisible();
    await page.locator('#searchBarBtn').click();
    await page.locator('input[name="cb_lists2039717"]').uncheck();
    await page.getByRole('button', { name: 'ryan test' }).click();
    await page.getByLabel('Search').click();
    await page.getByLabel('Search').fill('superset list 1');
    await page.getByLabel('Search').press('Enter');
  }
  await expect(page.getByRole('button', { name: 'test folder' })).toBeHidden();         //new
  await expect(page.getByText('ryan test Lists (0)')).toBeVisible();


  //  test list 1: Filter 1 list test teardown
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('test list 1: Filter 1');
  const [request15] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListsFromFolder?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByLabel('Search').press('Enter')
  ]);
  await expect(page.getByRole('button', { name: 'test folder' })).toBeHidden();      //new

  const myElement8 = page.locator('.listOfListsRow > td').first();
  if (await myElement8.isVisible()) {
    await page.locator('input[name="cb_lists2039717"]').check();
    await page.getByRole('button', { name: 'Select an Action' }).click();
    await page.getByRole('button', { name: 'Delete a list' }).click();
    const [request16] = await Promise.all([
      page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/DeleteList?accessToken=") && response.status() === 200, {timeout: 60000}),
      page.getByRole('button', { name: 'OK' }).click()
    ]);
    await expect(page.getByText('ryan test Lists (0)')).toBeVisible();
    await page.locator('#searchBarBtn').click();
    await page.locator('input[name="cb_lists2039717"]').uncheck();
    await page.getByRole('button', { name: 'ryan test' }).click();
    await page.getByLabel('Search').click();
    await page.getByLabel('Search').fill('test list 1: Filter 1');
    await page.getByLabel('Search').press('Enter');
  }
  await expect(page.getByRole('button', { name: 'test folder' })).toBeHidden();         //new
  await expect(page.getByText('ryan test Lists (0)')).toBeVisible();


  //  #009-2 copy a list, test list 1 copy teardown
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('test list 1 copy');
  const [request17] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListsFromFolder?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByLabel('Search').press('Enter')
  ]);
  await expect(page.getByRole('button', { name: 'test folder' })).toBeHidden();      //new

  const myElement9 = page.locator('.listOfListsRow > td').first();
  if (await myElement9.isVisible()) {
    await page.locator('input[name="cb_lists2039717"]').check();
    await page.getByRole('button', { name: 'Select an Action' }).click();
    await page.getByRole('button', { name: 'Delete a list' }).click();
    const [request18] = await Promise.all([
      page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/DeleteList?accessToken=") && response.status() === 200, {timeout: 60000}),
      page.getByRole('button', { name: 'OK' }).click()
    ]);
    await expect(page.getByText('ryan test Lists (0)')).toBeVisible();
    await page.locator('#searchBarBtn').click();
    await page.locator('input[name="cb_lists2039717"]').uncheck();
    await page.getByRole('button', { name: 'ryan test' }).click();
    await page.getByLabel('Search').click();
    await page.getByLabel('Search').fill('test list 1 copy');
    await page.getByLabel('Search').press('Enter');
  }
  await expect(page.getByRole('button', { name: 'test folder' })).toBeHidden();         //new
  await expect(page.getByText('ryan test Lists (0)')).toBeVisible();




});
