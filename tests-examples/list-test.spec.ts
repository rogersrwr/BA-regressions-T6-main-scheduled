import { test, expect, firefox } from '@playwright/test';
import * as fs from 'fs';
import { json } from 'stream/consumers';
const { App } = require('@slack/bolt');


const username = process.env.ACCT_LOGIN;
const password = process.env.ACCT_PASSWORD;
const phone = process.env.PHONE_NUMBER;
const parent_pass = process.env.PARENT_PASS;

const app = new App({ 
  token: process.env.O_AUTH,
  signingSecret: process.env.SIGN_SECRET,
});

//const channelId = 'C06KJ8ML7PA';    //channelId for personal test server
const channelId = 'C06LGR0MJRW';       //channelId for BA slack, automated_test_alerts channel

const jsonData = require('D:/a/BA-regressions-T6/BA-regressions-T6/datetime.json');

test.beforeAll('', async ({ }) => {
  if (jsonData.started == false) {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();


    const formattedDateTime = `${year}-${month}-${day}_${hours}-${minutes}`;
    const msgString = `test msg at ${formattedDateTime}`;
    jsonData.datetime = msgString;
    jsonData.started = true;
    jsonData.failures = false;
    jsonData.finished = false;
    const jsonString = JSON.stringify(jsonData, null, 2);
    fs.writeFileSync('D:/a/BA-regressions-T6/BA-regressions-T6/datetime.json', jsonString);

    await app.start(process.env.PORT || 3000 );
    console.log(' app is running??');
  }
});

test.describe.configure({
  mode: 'default',
});


test.beforeEach('', async ({ page }) => {
  await page.goto('https://target110.brightarrow.com/r/');
  await page.getByLabel('Username').click();
  await page.getByLabel('Username').fill(`${username}`);
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill(`${password}`);
  
  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/report/GetWeeklySummary?accessToken=3F71C6E3-2CF6-41F8-975B-59A373DC03F5") && response.status() === 200, {timeout: 60000}),
    page.getByRole('button', { name: 'Sign in' }).click()
  ]);

  await expect(page.getByText('Welcome, Ryan test')).toBeVisible();
  await expect(page.frameLocator('iframe[title="Help Scout Beacon - Messages and Notifications"]').getByText('Hi, I\'m the new BrightArrow')).toBeVisible();
  await page.frameLocator('iframe[title="Help Scout Beacon - Messages and Notifications"]').getByRole('button', { name: 'Close' }).click();  
});


test.afterEach(async ({ page }, testInfo) => {
  console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);
  console.log(`${testInfo.title} finished in ${testInfo.duration}`); 
  
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log(`Did not run as expected, ended up at ${page.url()}`);
    jsonData.failures = true;
    const jsonString = JSON.stringify(jsonData, null, 2);
    fs.writeFileSync('D:/a/BA-regressions-T6/BA-regressions-T6/datetime.json', jsonString);
  }
  
});


test.afterAll(async ({  }) => {
  // if (jsonData.finished == true && jsonData.failures == false) {
  //   await app.client.chat.postMessage({
  //     token: process.env.O_AUTH,
  //     channel: channelId,
  //     text: `:white_check_mark: Tests ran successfully. Visit https://rogersrwr.github.io/BA-regressions-T6/ for full results.`,
  //   });
  // } else if (jsonData.finished == true && jsonData.failures == true ) {
  //   await app.client.chat.postMessage({
  //     token: process.env.O_AUTH,
  //     channel: channelId,
  //     text: `:x: Test run has failed. Visit https://rogersrwr.github.io/BA-regressions-T6/ for full results.`,
  //   });
  // }
});






test('#001: Make list from Create List button', {
  tag: ['@Lists'],
  annotation: [
    { type: 'Test description', description: 'Creates a new list from the Create List button in BrightArrow Central. List is named "auto list 1". A few visual regression screenshot comparisons are made to verify everything is loaded as expected within the new List Details page, My Lists page, and BrightArrow Central.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Create list button doesn\'t work.'},
    { type: '', description: '● A screenshot comparison fails, potentially due to a visual regresion, an unexpected element changing or appearing, or the screenshot capture not working as intended.'},
    { type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],  
}, async ({ page }) => {
  //Starting from the BrightArrow central, click on the Create List button. 
  await page.locator('div').filter({ hasText: /^Create List$/ }).click();
  await page.getByLabel('List Name').fill('auto list 1');
  const [request] = await Promise.all([
    //Failure here means automation was not able to connect to TargetAPI in under 60 secs.
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListInfo?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('button', { name: 'Add' }).click()
  ]);
  await expect(page.getByText('List Details')).toBeVisible();
  //Failure here means screenshot comparison of newly created List Details failed.
  await expect(page).toHaveScreenshot("001-createList-listDetailsNew-chromium-win32-chromium-win32.png", { fullPage: true });

  //Clicks the back button in the top left.
  await page.getByTestId('FastRewindIcon').click();
  //The three lines below check for list names to be visible.
  await expect(page.getByRole('link', { name: 'auto list 1', exact: true })).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole('link', { name: 'test list 1', exact: true })).toBeVisible({timeout: 10000});
  await expect(page.getByRole('link', { name: 'test list 2', exact: true })).toBeVisible();
  //Failure here means screenshot comparison of My Lists page failed.
  await expect(page).toHaveScreenshot("001-myLists-check-chromium-win32-chromium-win32.png", {
    fullPage: true,
    mask: [page.locator('.listOfListsRow > td.listsTableColumns.advanced')],
  });
  
  //await page.getByTestId('FastRewindIcon').click();
  const [request2] = await Promise.all([
    //Failure here means automation was not able to connect to TargetAPI in under 60 secs.
    page.waitForResponse(response => response.url().includes("TargetAPI/api/report/GetWeeklySummary?accessToken=") && response.status() === 200, {timeout: 60000}),
    //Hits back button to access home page
    page.getByTestId('FastRewindIcon').click()
  ]);
  await expect(page.getByText('Welcome, Ryan test')).toBeVisible();
  //Failure here means screenshot comparison of BrightArrow Central failed. 
  await expect(page).toHaveScreenshot("001-homePage-asExpected-check-chromium-win32-chromium-win32.png", { fullPage: true, maxDiffPixels: 100, mask: [page.getByRole('img')], });

});




/*
test('#002: Create list from my lists page, auto list 2', {
  tag: ['@Lists'],
  annotation: [
    { type: 'Test description', description: 'Creates a new list by going to My Lists from the My Lists button within BrightArrow Central, then clicks the Select Action button to create a new list. List is named "auto list 2". A few visual regression screenshot comparisons are made to verify everything is loaded as expected within the new List Details page, My Lists page, and BrightArrow Central.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Creating list from Select Action button doesn\'t work.'},
    { type: '', description: '● A screenshot comparison fails, potentially due to a visual regresion, an unexpected element changing or appearing, or the screenshot capture not working as intended.'},
    { type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'Select an Action' }).click();
  await page.getByRole('button', { name: 'Create a list' }).click();
  await page.getByLabel('List Name').fill('auto list 2');
  const [request] = await Promise.all([
    //Failure here means automation was not able to connect to TargetAPI in under 60 secs.
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListInfo?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('button', { name: 'Add' }).click()
  ]);
  await expect(page.getByText('List Details')).toBeVisible();
  await expect(page).toHaveScreenshot("002-auto-list-2-initialpage-chromium-win32.png", { fullPage: true });

  await page.getByTestId('FastRewindIcon').click();
  await expect(page.getByRole('link', { name: 'auto list 2' })).toBeVisible({timeout: 10000});

  await expect(page).toHaveScreenshot("002-myLists-check-chromium-win32.png", {
    fullPage: true,
    maxDiffPixels: 100,
    mask: [page.locator('.listOfListsRow > td.listsTableColumns.advanced')],
  });

  const [request2] = await Promise.all([
    //Failure here means automation was not able to connect to TargetAPI in under 60 secs.
    page.waitForResponse(response => response.url().includes("TargetAPI/api/report/GetWeeklySummary?accessToken=") && response.status() === 200, {timeout: 60000}),
    //Hits back button to access home page
    page.getByTestId('FastRewindIcon').click()
  ]);

  await expect(page.getByText('Welcome, Ryan test')).toBeVisible();
  //Failure here means screenshot comparison of BrightArrow Central failed. 
  await expect(page).toHaveScreenshot("002-homePage-asExpected-check-chromium-win32.png", { fullPage: true, maxDiffPixels: 100, mask: [page.getByRole('img')], });

});
  
  




//change screenshot comparison to make this test unable to be impacted by either of previous two tests failing.
test('#003: Create a folder', {
  tag: ['@Lists'],
  annotation: [
    {type: 'Test description', description: 'Creates a new folder by going to the My Lists page, then clicking the Select Action button to create a list. New list is named "auto folder". A couple of visual regression screenshot comparisons are made to verify everything is visually where it should be '},
    {type: 'Potential Sources of Failure:', description: ''},
    {type: '', description: '● Creating folder from My Lists page doesn\'t work.'},
    { type: '', description: '● A screenshot comparison fails, potentially due to a visual regresion, an unexpected element changing or appearing, or the screenshot capture not working as intended.'},
    { type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('button', { name: 'Select an Action' }).click();
  await page.getByRole('button', { name: 'Create a folder' }).click();
  await page.getByLabel('Folder Name').fill('auto folder');

  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListsFromFolder?accessToken=3F71C6E3-2CF6-41F8-975B-59A373DC03F5&folderID=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('button', { name: 'Add' }).click()
  ]);

  await expect(page.getByRole('button', { name: 'auto folder' })).toBeVisible();
  await expect(page).toHaveScreenshot("003-myLists-newfolder-check-chromium-win32.png", {
    fullPage: true,
    mask: [page.locator('.listOfListsRow > td.listsTableColumns.advanced')],
  });

  await page.getByRole('button', { name: 'auto folder' }).click();
  await expect(page.getByText('auto folder Lists (0)')).toBeVisible();
  await expect(page).toHaveScreenshot("003-myLists-inside-newfolder-chromium-win32.png", {
    fullPage: true,
    mask: [page.locator('.listOfListsRow > td.listsTableColumns.advanced')],
  });

  await page.getByRole('button', { name: 'ryan test' }).click();
  await expect(page.getByRole('link', { name: 'test list 1' })).toBeVisible();
});




test('#004: Create list in new folder', {
  tag: ['@Lists'],
  annotation: [
    {type: 'Test description', description: 'Creates new list within the newly created folder (auto folder), this new list is named "auto list 3". This is to test if lists will remain in the folder they were created in. List is created with Select an Action button. A few visual screenshot comparison tests are made to verify everything is visually where it should be. '},
    {type: 'Potential Sources of Failure:', description: ''},
    {type: '', description: '● Creating new list within newly created folder doesn\'t work.'},
    {type: '', description: '● List is not found within folder.'},
    {type: '', description: '● A screenshot comparison fails, potentially due to a visual regresion, an unexpected element changing or appearing, or the screenshot capture not working as intended.'},
    {type: '', description: '● Extra slow connectivity to server or APIs.'},
    {type: '', description: ''},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('button', { name: 'auto folder' }).click();
  await page.getByRole('button', { name: 'Select an Action' }).click();
  await page.getByRole('button', { name: 'Create a list' }).click();
  await page.getByLabel('List Name').fill('auto list 3');
  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListInfo?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('button', { name: 'Add' }).click()
  ]);
  await expect(page.getByText('List Details')).toBeVisible();
  await expect(page.locator('#listName-label')).toBeVisible();
  await expect(page).toHaveScreenshot("004-createList-listDetailsNew-chromium-win32.png", { fullPage: true });

  await page.getByTestId('FastRewindIcon').click();
  await expect(page.getByRole('link', { name: 'auto list 3' })).toBeVisible({timeout: 10000});
  await expect(page).toHaveScreenshot("004-visibleInNewFolder-check-chromium-win32.png", {
    fullPage: true,
    mask: [page.locator('.listOfListsRow > td.listsTableColumns.advanced')],
  });

  await page.getByRole('button', { name: 'ryan test' }).click();
  await expect(page.getByRole('link', { name: 'auto list 3' })).toBeVisible();

  await expect(page).toHaveScreenshot("004-visibleInMainFolder-check-chromium-win32.png", {
    fullPage: true,
    maxDiffPixels: 100,
    mask: [page.locator('.listOfListsRow > td.listsTableColumns.advanced')],
  });

});



test('#005: add contact to list, auto list 1', {
  tag: ['@Lists'],
  annotation: [
    {type: 'Test description', description: 'Adds a contact to recently created list "auto list 1". Uses the "Add Contact" button in List Details page to do this. Information is added to most fields except the portal fields. One number and one email added. Contact is named "Auto Contact1". There are a few visual regression tests to make sure List Details, My Lists, and Edit Contact pages are all updated correctly.'},
    {type: 'Potential Sources of Failure:', description: ''},
    {type: '', description: '● Add Contact button does not work.'},
    {type: '', description: '● List to add contact to is not found.'},
    {type: '', description: '● A screenshot comparison fails, potentially due to a visual regresion, an unexpected element changing or appearing, info not changing or saving, or the screenshot capture not working as intended.'},
    {type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('link', { name: 'auto list 1' }).click();
  await page.getByRole('button', { name: 'Add Contact' }).click();

  await page.getByLabel('First Name').click();
  await page.getByLabel('First Name').fill('Auto');
  await page.getByLabel('Last Name').click();
  await page.getByLabel('Last Name').fill('Contact1');
  await page.locator('#btnPhoneAdd').click();
  await page.getByLabel('Phone').click();
  await page.getByLabel('Phone').fill('555-555-5555');
  await page.locator('#btnEmailAdd').click();
  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill('email@email.com');
  await page.getByLabel('Contact ID').click();
  await page.getByLabel('Contact ID').fill('12345');
  await page.getByLabel('Building').click();
  await page.getByLabel('Building').fill('1');
  await page.getByLabel('Grade').click();
  await page.getByLabel('Grade').fill('2');
  await page.getByLabel('Language').click();
  await page.getByLabel('Language').fill('English');
  await page.getByLabel('Bus Route').click();
  await page.getByLabel('Bus Route').fill('2');
  await page.getByLabel('Field 5').click();
  await page.getByLabel('Field 5').fill('field 5 test');
  await page.getByLabel('Field 6').click();
  await page.getByLabel('Field 6').fill('field 6 test');
  await page.getByLabel('Field 7').click();
  await page.getByLabel('Field 7').fill('field 7 test');
  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialListContact/LoadContacts?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('button', { name: 'Apply' }).click()
  ]);
  await expect(page.getByRole('cell', { name: 'Contact1, Auto' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'email@email.com' })).toBeVisible();
  await expect(page).toHaveScreenshot("005-listDetails-addContact-chromium-win32.png", { fullPage: true });


  const [request2] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListsFromFolder?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByTestId('FastRewindIcon').click()
  ]);
  await expect(page.getByRole('link', { name: 'auto list 1' })).toBeVisible();
  await expect(page).toHaveScreenshot("005-MyLists-newContactCheck-chromium-win32.png", { fullPage: true, mask: [page.locator('.listOfListsRow > td.listsTableColumns.advanced')], });

  await page.getByRole('link', { name: 'auto list 1' }).click();
  //await page.getByRole('cell', { name: 'Contact1, Auto' }).click();
  const [request3] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialListContact/GetContact?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('cell', { name: 'Contact1, Auto' }).click()
  ]);
  await expect(page).toHaveScreenshot("005-auto-contact1-details-chromium-win32.png", { fullPage: true, maxDiffPixels: 15 });
});



test('#006: Access list from pen icon to make another contact, auto list 1', {
  tag: ['@Lists'],
  annotation: [
    {type: 'Test description', description: 'Tests the pen icon that appears by mouse hovering over a list in the My Lists page. Clicks on this to then add another contact to the list "auto list 1". New contact is named "Auto Contact2". Information is added to most fields except the portal fields. One number and one email added. Contact is named "Auto Contact1". There are a few visual regression tests to make sure List Details, My Lists, and Edit Contact pages are all updated correctly.'},
    {type: 'Potential Sources of Failure:', description: ''},
    {type: '', description: '● Pen hover icon does not work.'},
    {type: '', description: '● List to add contact to is not found.'},
    {type: '', description: '● A screenshot comparison fails, potentially due to a visual regresion, an unexpected element changing or appearing, info not changing or saving, or the screenshot capture not working as intended.'},
    {type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').fill('auto list 1');
  await page.getByLabel('Search').press('Enter');
  await page.getByRole('link', { name: 'auto list 1' }).hover();
  await page.getByRole('link', { name: 'Edit List' }).click();

  await page.getByRole('button', { name: 'Add Contact' }).click();
  await page.getByLabel('First Name').fill('Auto');
  await page.getByLabel('Last Name').click();
  await page.getByLabel('Last Name').fill('Contact2');
  await page.locator('#btnPhoneAdd').click();
  await page.getByLabel('Phone').click();
  await page.getByLabel('Phone').fill('555-555-5555');
  await page.locator('#btnEmailAdd').click();
  await page.getByLabel('Email').click();
  await page.getByLabel('Email').fill('email@email.com');
  await page.getByLabel('Contact ID').click();
  await page.getByLabel('Contact ID').fill('12345');
  await page.getByLabel('Building').click();
  await page.getByLabel('Building').fill('11');
  await page.getByLabel('Grade').click();
  await page.getByLabel('Grade').fill('2');
  await page.getByLabel('Language').click();
  await page.getByLabel('Language').fill('English');
  await page.getByLabel('Bus Route').click();
  await page.getByLabel('Bus Route').fill('5');
  await page.getByLabel('Field 5').click();
  await page.getByLabel('Field 5').fill('field 5 test');
  await page.getByLabel('Field 6').click();
  await page.getByLabel('Field 6').fill('field 6 test');
  await page.getByLabel('Field 7').click();
  await page.getByLabel('Field 7').fill('field 7 test');
  //await page.getByRole('button', { name: 'Apply' }).click();
  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialListContact/LoadContacts?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('button', { name: 'Apply' }).click()
  ]);
  await expect(page.getByRole('cell', { name: 'Contact1, Auto' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Contact2, Auto' })).toBeVisible();
  await expect(page).toHaveScreenshot("006-listWithTwoContacts-check-chromium-win32.png", { fullPage: true });

  const [request2] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListsFromFolder?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByTestId('FastRewindIcon').click()
  ]);

  await expect(page).toHaveScreenshot("006-myLists-add2ndContact-check.png", { fullPage: true, mask: [page.locator('.listOfListsRow > td.listsTableColumns.advanced')], });
  await page.getByRole('link', { name: 'auto list 1' }).click();
  //await page.getByRole('cell', { name: 'Contact2, Auto' }).click();
  const [request3] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialListContact/GetContact?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('cell', { name: 'Contact2, Auto' }).click()
  ]);

  await expect(page).toHaveScreenshot("006-auto-contact2-details-chromium-win32.png", { 
    fullPage: true, 
    maxDiffPixels: 15, 
    mask: [page.locator('.listOfListsRow > td.listsTableColumns.advanced')], });

});




test('#007: Click on gear icon, auto list 1',{
  tag: ['@Lists'],
  annotation: [
    {type: 'Test description', description: 'Tests the gear icon that appears by mouse hovering over a list in the My Lists page. Clicks on this to access list named "auto list 1". Then goes to List Settings and changes settings in most subpages.'},
    {type: 'Potential Sources of Failure:', description: ''},
    {type: '', description: '● Gear hover icon does not work.'},
    {type: '', description: '● List to change the settings of is not found.'},
    {type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').fill('auto list 1');
  await page.getByLabel('Search').press('Enter');
  await page.getByRole('link', { name: 'auto list 1' }).hover();
  await page.getByRole('link', { name: 'List Settings' }).click();

  //await page.getByLabel('Disable deleting current').check();
  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/SetListSetting") && response.status() === 200, {timeout: 60000}),
    page.getByLabel('Disable deleting current').check()
  ]);
  await page.getByRole('tab', { name: 'Phone Call Settings' }).click();
  await page.getByLabel('Number of retries upon busy').click();
  await page.getByLabel('Number of retries upon busy').fill('1');
  await page.getByLabel('Call specific numbers').check();
  await expect(page.getByText('Phone 1')).toBeVisible();
  await expect(page.getByLabel('Phone 1')).toBeVisible();
  await page.getByLabel('Phone 1').check();
  await page.getByRole('tab', { name: 'Text Settings' }).click();
  await page.getByLabel('Other phones').uncheck();
  await page.getByLabel('Phone 3').uncheck();
  await page.getByRole('tab', { name: 'Email Settings' }).click();
  await page.getByLabel('Email Subject').click();
  await page.getByLabel('Email Subject').fill('BrightArrow Test Email Subject');
  await page.getByRole('tab', { name: 'Portal Settings' }).click();
  await page.getByRole('tab', { name: 'CC Settings' }).click();
  await page.getByLabel('CC list (comma-separated)').fill('ryanrogers99@yahoo.com');
  await page.locator('#root div').filter({ hasText: 'List ManagementPhone Call' }).nth(1).click();
});
*/

/*
test('verify#007 -click on gear icon, auto list 1',{
  tag: ['@Lists'],
  annotation: [
    {type: 'Test description', description: ''},
    {type: '', description: '● '},
    {type: '', description: '● '},
    {type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 1');
  await page.getByLabel('Search').press('Enter');
  await page.getByRole('link', { name: 'auto list' }).click();
  await expect(page.locator('div').filter({ hasText: 'List Settings' }).nth(3)).toBeVisible();
  //await page.locator('div').filter({ hasText: 'List Settings' }).nth(3).click();
  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListSettings?accessToken=3F71C6E3-2CF6-41F8-975B-59A373DC03F5&listID=") && response.status() === 200, {timeout: 60000}),
    page.locator('div').filter({ hasText: 'List Settings' }).nth(3).click()
  ]);
  await expect(page.getByText('Disable deleting this list')).toBeVisible();
  await expect(page.getByText('Users with access to')).toBeVisible();
  await expect(page.getByText('ryan test')).toBeVisible();

  await expect(page).toHaveScreenshot("007-auto-list1-settings-listmanagement-chromium-win32.png", { fullPage: true, mask: [page.locator('#root div').filter({ hasText: 'List ManagementPhone Call' }).nth(3)], maxDiffPixels: 15, });

  await page.getByRole('tab', { name: 'Phone Call Settings' }).click();
  await expect(page.locator('#strCallerID-label')).toBeVisible();
  await expect(page.getByText('Phones to call for each')).toBeVisible();
  //await expect(page).toHaveScreenshot("007-auto-list1-settings-phonecallsettings.png", { fullPage: true, mask: [page.locator('#root div').filter({ hasText: 'List ManagementPhone Call' }).nth(3)], maxDiffPixels: 20,  });

  await page.getByRole('tab', { name: 'Text Settings' }).click();
  await expect(page.getByText('Phones to text for each')).toBeVisible();
  await expect(page).toHaveScreenshot("007-auto-list1-settings-textsettings-chromium-win32.png", { fullPage: true, mask: [page.locator('#root div').filter({ hasText: 'List ManagementPhone Call' }).nth(3)], maxDiffPixels: 15, });

  await page.getByRole('tab', { name: 'Email Settings' }).click();
  await expect(page.locator('#strEmailSubject-label')).toBeVisible();
  await expect(page.getByText('Message Sent Reports', { exact: true })).toBeVisible();
  await expect(page.getByText('Report Emailing')).toBeVisible();
  await expect(page).toHaveScreenshot("007-auto-list1-settings-emailsettings-chromium-win32.png", { fullPage: true, mask: [page.locator('#root div').filter({ hasText: 'List ManagementPhone Call' }).nth(3)], maxDiffPixels: 15, });

  await page.getByRole('tab', { name: 'Portal Settings' }).click();
  await expect(page.getByText('Portal for recipients to')).toBeVisible();
  await expect(page).toHaveScreenshot("007-auto-list1-settings-portalsettings-chromium-win32.png", { fullPage: true, mask: [page.locator('#root div').filter({ hasText: 'List ManagementPhone Call' }).nth(3)], maxDiffPixels: 15,});

  await page.getByRole('tab', { name: 'CC Settings' }).click();
  await expect(page.getByText('Phones and emails to receive')).toBeVisible();
  await expect(page).toHaveScreenshot("007-auto-list1-settings-CCsettings-chromium-win32.png", { fullPage: true, mask: [page.locator('#root div').filter({ hasText: 'List ManagementPhone Call' }).nth(3)], maxDiffPixels: 15, });
});
*/


/*
test('#008: add list to favorites with heart icon, auto list 1',{
  tag: ['@Lists'],
  annotation: [
    {type: 'Test description', description: 'Tests the heart icon that appears by hovering over a list within the My Lists page. Hovers over list named "auto list 1" and uses heart icon to add this list to "My Favorites" folder. '},
    {type: 'Potential Sources of Failure', description: ''},
    {type: '', description: '● Heart hover icon does not work.'},
    {type: '', description: '● List which is used to test this is not found.'},
    {type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  test.setTimeout(50000);
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 1');
  await page.getByLabel('Search').press('Enter');
  await page.getByRole('link', { name: 'auto list 1' }).hover();
  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/folder/GetFavoriteFolders?accessToken=3F71C6E3-2CF6-41F8-975B-59A373DC03F5") && response.status() === 200, {timeout: 60000}),
    page.getByRole('link', { name: 'Add to favorite' }).click()
  ]);

  if (await page.getByLabel('My Favorites').isVisible()) {
    await expect(page.getByLabel('My Favorites')).toBeVisible();
    await page.getByLabel('My Favorites').click();
    await page.getByRole('option', { name: 'My Favorites' }).click();
  }

  if (await page.getByLabel('auto folder').isVisible()) {
    await expect(page.getByLabel('auto folder')).toBeVisible();
    await page.getByLabel('auto folder').click();
    await page.getByRole('option', { name: 'My Favorites' }).click();
  }
  const [request2] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/folder/AddToFavoriteFolder?accessToken=3F71C6E3-2CF6-41F8-975B-59A373DC03F5&folderID=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('button', { name: 'OK' }).click()
  ]);
  await expect(page.getByRole('button', { name: 'ryan test' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'auto list 1' })).toBeVisible();
});





test('#009: Changing contact email from pen icon in List Details page',{
  tag: ['@Lists'],
  annotation: [
    {type: 'Test description', description: 'Tests the pen hover icon found within the List Details page. This is tested within list named "auto list 1". Uses pen icon to access Contact Details of "Auto Contact1". Changes email. A screenshot comparison test is made to check that List Details page is properly updated after changing info.'},
    {type: 'Potential Sources of Failure', description: ''},
    {type: '', description: '● Pen hover icon in List Details page does not work.'},
    {type: '', description: '● List used to test this feature is not found.'},
    {type: '', description: '● Info change is not properly saved.'},
    {type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 1');
  await page.getByLabel('Search').press('Enter');
  await page.getByRole('link', { name: 'auto list' }).click();
  await page.getByRole('row', { name: 'Contact1, Auto 5555555555,' }).getByRole('button').first().click();
  await page.getByLabel('Email 1').click();
  await page.getByLabel('Email 1').click();
  await page.getByLabel('Email 1').fill('newemail@email.com');
  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialListContact/LoadContacts?accessToken=3F71C6E3-2CF6-41F8-975B-59A373DC03F5&listID=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('button', { name: 'Apply' }).click()
  ]);
  await expect(page.locator('tbody')).toContainText('5555555555, newemail@email.com');
  await expect(page).toHaveScreenshot("009-listDetailsEdit-check.png", { fullPage: true });
});





test('#010: Disabling a contact', {
  tag: ['@Lists'],
  annotation: [
    { type: 'CURRENTLY REFACTORING. THIS TEST IS NOT CURRENTLY ACTIVE', description: ''},
    { type: 'Test Description', description: 'Navigates to list named "Test List 1", and disables contact named "phone, ryan". Then verifies changes by backing out and back into same list to verify change has been saved in same browser session.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Failure navigating to list. Potentially caused by list being accidentally deleted, prior page elements not working, or slow connectivity to APIs or server.'},
    { type: '', description: '● Contact disabling not working for some reason. '},
    { type: '', description: '● Test suite setup/cleanup failed and contact was not properly reset, causing test to run into unexpected conditions.'},
    { type: '', description: '● Random failures of web page components not working as expected, slow connectivity, or an abnormality with how Playwright interacts with the web app.'},
  ],
}, async ({ page }) => {
  // await test.step('Navigate to list', async () => {
  //   await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  //   await page.getByRole('button', { name: 'ryan test' }).click();
  //   await page.getByRole('link', { name: 'test list 1' }).click();
  // });
  // await test.step('Disable a contact', async () => {
  //   await expect(page.locator('#cb_list438620451'), 'Error here means test was not properly setup.').toBeChecked();
  //   await page.locator('#cb_list438620451').uncheck();
  // });
  // await test.step('Back out and re-enter list to verify changes have been saved', async () => {
  //   await page.getByTestId('FastRewindIcon').click();
  //   await expect(page.getByRole('link', { name: 'test list 1' })).toBeVisible();
  //   await page.getByRole('link', { name: 'test list 1' }).click();
  //   await expect(page.getByRole('cell', { name: 'phone, ryan' })).toBeVisible();
  //   await expect(page.locator('#cb_list438620451'), 'Error here means contact disable did not save correctly.').not.toBeChecked();
  // });
});





test('#011: Testing "Hide Disabled Contacts" checkbox within List Details page.', {
  tag: ['@Lists'],
  annotation: [
    { type: 'CURRENTLY REFACTORING. THIS TEST IS NOT CURRENTLY ACTIVE', description: ''},
    { type: 'Test Description', description: 'Goes to list named "test list 1" that now has 1 disabled contact. Within List Details page, clicks checkbox to Hide Disabled Contacts. Backs out and re-enters list to make sure changes have been made. A couple visual regression screenshot comparison tests are made to ensure that info is saved and displayed as expected.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Hide Disabled Contacts button does not work.'},
    { type: '', description: '● Failure navigating to list. Potentially caused by list being accidentally deleted, prior page elements not working, or slow connectivity to APIs or server.'},
    { type: '', description: '● Test suite setup/cleanup failed and contact was not properly reset, causing test to run into unexpected conditions.'},
    { type: '', description: '● A screenshot comparison fails, potentially due to a visual regresion, an unexpected element changing or appearing, info not changing or saving, or the screenshot capture not working as intended.'},
    { type: '', description: '● Random failures of web page components not working as expected, slow connectivity, or an abnormality with how Playwright interacts with the web app.'},
  ],
}, async ({ page }) => {
  // await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  // await page.getByRole('button', { name: 'ryan test' }).click();
  // await page.getByRole('link', { name: 'test list 1' }).click();
  // await expect(page.getByRole('cell', { name: 'phone, ryan' })).toBeVisible();
  // const [request] = await Promise.all([
  //   page.waitForResponse(response => response.url().includes("TargetAPI/api/dialListContact/LoadContacts?accessToken=") && response.status() === 200, {timeout: 60000}),
  //   await page.locator('#hideDisabledButton').check()
  // ]);
  // await expect(page.getByRole('cell', { name: 'phone, ryan' })).toBeHidden();
  // await expect(page).toHaveScreenshot("011-hideDisabledContactsCheckbox-check.png", { fullPage: true });

  // await page.getByTestId('FastRewindIcon').click();
  // await page.getByRole('link', { name: 'test list 1' }).click();
  // await expect(page.getByRole('cell', { name: 'contact, test' })).toBeVisible();
  // await expect(page.getByRole('cell', { name: 'parent, phone' })).toBeVisible();
});





test('#012: Create Message button from List Details page and send text message',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'Navigates to list named "test list 1" and clicks Create Message button. Only selects text message option. In message field, inputs a short message with the date and start time of this specific test run. Then hits Send Message Now. Message is to be received by a Google Voice phone number which is accessed later in the automated test run.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Create Message button does not work.'},
    { type: '', description: '● Some part of the create message process does not work as expected.'},
    { type: '', description: '● List this is tested with is unexpectedly not there.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('link', { name: 'test list 1' }).click();
  await page.locator('div').filter({ hasText: 'Create Message' }).nth(3).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByLabel('Texting').check();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Text Message').click();
  await page.getByLabel('Text Message').fill(`${jsonData.datetime}`);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('div').filter({ hasText: /^Send Message Now$/ }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByText('Welcome, Ryan test')).toBeVisible();
});





test('#013: Edit message, email only, and save.',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'Navigates to list named "test list 1". Clicks Edit Message button in List Details page. Unchecks text option, and checks email message option instead. In email subject, inputs a short message with the date and start time of this specific test run. Also inputs one mail merge field of [[fullName]]. At end of this process, clicks Save Message instead of send.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Edit Message button does not work.'},
    { type: '', description: '● Some part of the edit message process does not work as expected.'},
    { type: '', description: '● List this is tested with is unexpectedly not there. '},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('link', { name: 'test list 1' }).click();
  await page.locator('div').filter({ hasText: 'Edit Message' }).nth(3).click();
  await expect(page.locator('#vertical-tabpanel-0').getByText('Texting')).toBeVisible();
  await expect(page.locator('#vertical-tabpanel-0').getByText('Email')).toBeVisible();
  await expect(page.getByText('Mark as Urgent in App Until (')).toBeVisible();
  await page.getByLabel('Texting').uncheck();
  await page.getByLabel('Email').check();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Subject').click();
  await page.getByLabel('Subject').fill(`${jsonData.datetime}`);
  await page.getByRole('combobox', { name: '​' }).click();
  await page.getByRole('option', { name: '[[fullName]]' }).click();
  
  // await page.getByRole('combobox', { name: '​' }).click();
  // await page.getByRole('option', { name: '[[today]]' }).click();
  
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('div').filter({ hasText: /^Save Message$/ }).click();
  await expect(page.getByText('List Details')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Contact, Phone' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'contact1, test' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'contact2, test' })).toBeVisible();
});





test('#014: Send Message button from List Details page',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'Navigates to list named "test list 1". Clicks Send Message button to send recently edited email message.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Send Message button in List Details page does not work.'},
    { type: '', description: '● List used to test this is unexpectedly not available.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('link', { name: 'test list 1' }).click();
  await page.locator('div').filter({ hasText: 'Send Message' }).nth(3).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByText('Welcome, Ryan test')).toBeVisible();
});





test('#015: Send Message hover icon from My Lists page',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test Description', description: 'Navigates to My Lists page. Mouse hovers over list named "test list 1" and clicks send message hover icon. Confirms message sending.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Send message hover icon does not work.'},
    { type: '', description: '● List used to test this is unexpectedly not available.'},
    { type: '', description: '● '},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('test list 1');
  await page.getByLabel('Search').press('Enter');
  await page.locator('.listOfListsRow > td').first().hover();
  await page.getByRole('link', { name: 'Send' }).click();
  await expect(page.getByText('Do you wish to start sending')).toBeVisible();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByText('Welcome, Ryan test')).toBeVisible();
});





test('#016: Do not contact list/time feature from menu',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Currently refactoring this test, is not currently being run.', description: ''},
  ],
}, async ({ page }) => {
  
});





test('#017: Active BrightChats feature from main menu',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'Clicks Active BrightChats button from BrightArrow Central. Navigates to chat panel labeled "ryan test & test contact1". Inputs a short message with the date and start time of this specific test run and clicks send icon. A different test verifies that chat is properly received in ParentHub app.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Active BrightChats button does not work.'},
    { type: '', description: '● Some part of the BrightChat sending process does not work as expected.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^Active BrightChats$/ }).click();
  await expect(page.getByRole('link', { name: 'ryan test & test contact1' })).toBeVisible();
  await page.getByRole('link', { name: 'ryan test & test contact1' }).click();
  await page.getByLabel('Type message here...').click();
  await page.getByLabel('Type message here...').fill(`${jsonData.datetime}`);
  const [request] = await Promise.all([
    //Failure here means automation was not able to connect to TargetAPI in under 60 secs.
    page.waitForResponse(response => response.url().includes("TargetAPI/api/InstantMessaging/PostChannelMessage?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('button', { name: 'Send Message' }).click()
  ]);
});





test('#018: Start BrightChat button from List Details page',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Currently refactoring this test, is not currently being run.', description: ''},
  ],
}, async ({ page }) => {
  
});





test('#019: Interacting from Active BrightChats page on computer',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'Clicks on Active BrightChats button from BrightArrow Central. Navigates through all the page filters (Choose a filter dropdown on the top left) and verifies they are all working.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Active BrightChats button is not working.'},
    { type: '', description: '● Some part of navigating through BrightChat filtered pages does not work as expected.'},
    { type: '', description: '● Extra slow network connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^Active BrightChats$/ }).click();
  await page.getByRole('link', { name: 'ryan test & Phone Contact' }).click();
  await expect(page.getByText('04/30/24 3:10 PMryan testtest')).toBeVisible();
  await page.getByRole('link', { name: 'ryan test & test contact1' }).click();
  await page.locator('#channelFilter').selectOption('PrivateChats');
  await expect(page.getByRole('link', { name: 'ryan test & test contact1' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'ryan test & Phone Contact' })).toBeVisible();
  await page.locator('#channelFilter').selectOption('GroupChats');
  await expect(page.getByText('Invites Received')).toBeVisible();
  await page.getByTestId('FastRewindIcon').click();
  await expect(page.getByRole('link', { name: 'ryan test & test contact1' })).toBeVisible();
  await page.locator('#channelFilter').selectOption('InvitesSent');
  await expect(page.getByRole('link', { name: 'start brightchat (ryan test)' })).toBeVisible();
});





test('#020: Delete folder, auto folder',{
  tag: ['@Lists'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists page. Selects folder named "auto folder" created at the start of the test run. Clicks the trash icon delete folder button.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Delete folder icon in folder page does not work.'},
    { type: '', description: '● The folder that this test runs off of is not there, potentially due to an error with its initial creation.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'auto folder' }).click();
  await page.getByRole('link', { name: 'Delete Folder' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByRole('button', { name: 'ryan test' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'auto list 3' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'test list 1' })).toBeVisible();
});





test('#021: Delete list, auto list 1',{
  tag: ['@Lists'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists page. Searches for "auto list 1" (easier to set up for deletion this way in automation). Selects the top checkbox to select auto list 1. Then clicks Select an Action button and deletes list. '},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● A button within the process for deleting a list does not work as expected.'},
    { type: '', description: '● The list that this test runs off of is not there, potentially due to an error with its initial creation.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 1');
  await page.getByLabel('Search').press('Enter');
  await page.locator('input[name="cb_lists2039717"]').check();
  await page.getByRole('button', { name: 'Select an Action' }).click();
  await page.getByRole('button', { name: 'Delete a list' }).click();
  //await page.getByRole('button', { name: 'OK' }).click();
  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/DeleteList?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('button', { name: 'OK' }).click()
  ]);
});





test('#022: Delete list, auto list 2',{
  tag: ['@Lists'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists page. Searches for "auto list 2" (easier to set up for deletion this way in automation). Selects the top checkbox to select auto list 1. Then clicks Select an Action button and deletes list. '},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● A button within the process for deleting a list does not work as expected.'},
    { type: '', description: '● The list that this test runs off of is not there, potentially due to an error with its initial creation.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 2');
  await page.locator('#searchBarBtn').click();
  await page.locator('input[name="cb_lists2039717"]').check();
  await page.getByRole('button', { name: 'Select an Action' }).click();
  await page.getByRole('button', { name: 'Delete a list' }).click();
  //await page.getByRole('button', { name: 'OK' }).click();
  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/DeleteList?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('button', { name: 'OK' }).click()
  ]);

});





//deletes final(?) list made. this list should end up in the main user 'ryan test' folder. 
//add some screenshot verification later to further ensure functionality
test('#023: Delete list 3, auto list import',{
  tag: ['@Lists'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists page. Searches for "auto list 3" (easier to set up for deletion this way in automation). Selects the top checkbox to select auto list 1. Then clicks Select an Action button and deletes list. '},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● A button within the process for deleting a list does not work as expected.'},
    { type: '', description: '● The list that this test runs off of is not there, potentially due to an error with its initial creation.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 3');
  await page.getByLabel('Search').press('Enter');
  await page.locator('input[name="cb_lists2039717"]').check();
  await page.getByRole('button', { name: 'Select an Action' }).click();
  await page.getByRole('button', { name: 'Delete a list' }).click();
  //await page.getByRole('button', { name: 'OK' }).click();
  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/DeleteList?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('button', { name: 'OK' }).click()
  ]);
  await page.locator('#searchBarBtn').click();
});




test('#024: ParentHub message received confirmation',{
  tag: ['@Messages', '@ParentHub'],
  annotation: [
    { type: 'Test description', description: 'Uses the BrightArrow URL with a "/m/" ending to access the ParentHub app through desktop. Logs into account. Goes to Chats and verifies if chat sent earlier in test run was properly received.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● ParentHub access through link does not work.'},
    { type: '', description: '● Login unexpectedly doesn\'t work.'},
    { type: '', description: '● Message was not properly sent or received.'},
    { type: '', description: '● Unexpected interactions with the ParentHub interface.'},
  ],
}, async ({ page }) => {
  await page.goto('https://target110.brightarrow.com/m/');
  await page.getByRole('button', { name: 'Parent / Student Login' }).click();
  await page.getByLabel('Enter your phone number').click();
  await page.getByLabel('Enter your phone number').fill(`${phone}`);
  await page.getByLabel('Enter your password').click();
  await page.getByLabel('Enter your password').fill(`${parent_pass}`);
  await page.getByLabel('Enter your password').press('Enter');
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.locator('div').filter({ hasText: /^FEEDS$/ }).click();
  await page.locator('div').filter({ hasText: /^CHATS$/ }).click();
  await page.getByRole('button', { name: 'settings' }).click();
  await expect(page.getByText(`${jsonData.datetime}`)).toBeVisible();
  

});




test('wrap up tests', async ({ page }) => {
  jsonData.finished = true;
  const jsonString = JSON.stringify(jsonData, null, 2);
  fs.writeFileSync('D:/a/BA-regressions-T6/BA-regressions-T6/datetime.json', jsonString);
});


*/