import { test, expect, firefox } from '@playwright/test';
import * as fs from 'fs';
import { json } from 'stream/consumers';
const { App } = require('@slack/bolt');


const username = process.env.ACCT_LOGIN;
const password = process.env.ACCT_PASSWORD;
const phone = process.env.PHONE_NUMBER;
const parent_pass = process.env.PARENT_PASS;
const username3 = process.env.ACCT_LOGIN3;
const username4 = process.env.ACCT_LOGIN4;




//D:/a/BA-regressions-T6/BA-regressions-T6/datetime.json        





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
    jsonData.tHour = hours;
    jsonData.tMin = minutes;
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
  await page.getByLabel('Username').fill(`${username3}`);
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill(`${password}`);
  
  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/report/GetWeeklySummary?accessToken=") && response.status() === 200, {timeout: 60000}),
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

});




test('#001: Schedule message button ', {
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists, selects list "test list 12" and clicks Edit message button. Selects email tab and changes subject field to include the date and start time of test run. Then goes to Proceed and selects Schedule Message button. Schedules message to be sent at minimum 2 minutes into the future, up to ~10 minutes depending on the exact start time of the test run. I tried to account for all possible times this regression test suite may be ran which resulted in some variation of scheduled message time. But the message should be sent and received before the test at the end of the suite that checks if it was properly received.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Schedule message functionality doesn\'t work.'},
    { type: '', description: '● List used for test unexpectedly is not available.'},
    { type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],  
}, async ({ page }) => {

  const x = jsonData.tHour;
  const y = jsonData.tMin;

  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('link', { name: 'test list 12' }).click();
  await page.locator('div').filter({ hasText: 'Edit Message' }).nth(3).click();
  await page.getByRole('tab', { name: 'Email' }).click();
  await page.getByLabel('Subject').click();
  await page.getByLabel('Subject').fill(`#000 ${jsonData.datetime}`);
  await page.getByRole('tab', { name: 'Proceed' }).click();
  await page.locator('div').filter({ hasText: /^Schedule Message$/ }).click();
  await page.getByLabel('Choose date, selected date is ').click();

  if (y >= 54) {
    switch(x + 1) {
      case 1:
        await page.getByLabel('1 hours', { exact: true }).click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('AM').click();
        break;
      case 2:
        await page.getByLabel('2 hours', { exact: true }).click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('AM').click();
        break;
      case 3:
        await page.getByLabel('3 hours').click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('AM').click();
        break;
      case 4:
        await page.getByLabel('4 hours').click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('AM').click();
        break;
      case 5:
        await page.getByLabel('5 hours').click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('AM').click();
        break;
      case 6:
        await page.getByLabel('6 hours').click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('AM').click();
        break;
      case 7:
        await page.getByLabel('7 hours').click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('AM').click();
        break;
      case 8:
        await page.getByLabel('8 hours').click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('AM').click();
        break;
      case 9:
        await page.getByLabel('9 hours').click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('AM').click();
        break;
      case 10:
        await page.getByLabel('10 hours').click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('AM').click();
        break;
      case 11:
        await page.getByLabel('11 hours').click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('AM').click();
        break;
      case 12: 
        await page.getByLabel('12 hours').click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('PM').click();
        break;
      case 13:
        await page.getByLabel('1 hours', { exact: true }).click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('PM').click();
        break;
      case 14:
        await page.getByLabel('2 hours', { exact: true }).click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('PM').click();
        break;
      case 15:
        await page.getByLabel('3 hours').click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('PM').click();
        break;
      case 16:
        await page.getByLabel('4 hours').click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('PM').click();
        break;
      case 17:
        await page.getByLabel('5 hours').click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('PM').click();
        break;
      case 18:
        await page.getByLabel('6 hours').click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('PM').click();
        break;
      case 19:
        await page.getByLabel('7 hours').click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('PM').click();
        break;
      case 20:
        await page.getByLabel('8 hours').click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('PM').click();
        break;
      case 21:
        await page.getByLabel('9 hours').click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('PM').click();
        break;
      case 22:
        await page.getByLabel('10 hours').click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('PM').click();
        break;
      case 23: 
        await page.getByLabel('11 hours').click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('PM').click();
        break;
      case 24:
        await page.getByLabel('12 hours').click();
        await page.getByLabel('5 minutes', { exact: true }).click();
        await page.getByLabel('AM').click();
        break;
    }
  } else {
    let z = y + 2;
    while (z % 5 != 0) {
      z += 1;
    }
    switch (z) {
      case 5:
        await page.getByLabel('5 minutes', { exact: true }).click();
        break;
      case 10:
        await page.getByLabel('10 minutes').click();
        break;
      case 15:
        await page.getByLabel('15 minutes').click();
        break;
      case 20:
        await page.getByLabel('20 minutes').click();
        break;
      case 25:
        await page.getByLabel('25 minutes').click();
        break;
      case 30:
        await page.getByLabel('30 minutes').click();
        break;
      case 35:
        await page.getByLabel('35 minutes').click();
        break;
      case 40:
        await page.getByLabel('40 minutes').click();
        break;
      case 45:
        await page.getByLabel('45 minutes').click();
        break;
      case 50:
        await page.getByLabel('50 minutes').click();
        break;
      case 55:
        await page.getByLabel('55 minutes').click();
        break;
    }
    await page.getByRole('button', { name: 'OK' }).click();
  }
  await page.getByRole('button', { name: 'Schedule' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  //await page.goto('https://target110.brightarrow.com/r/home');
  await expect(page.getByText('Welcome, Ryan test')).toBeVisible({timeout: 20000 });
  await expect(page.getByText('test list 12 -- 1 contacts.')).toBeVisible();

});







test('#002: Setup for test #044, stop message hover icon test ', {
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'A pre-test setup for test #036 (stop pending msg hover icon). Navigates to My Lists and selects list "test list 14". Clicks the Edit Message button and goes to email tab. Changes subject field to include the date and start time of the test run. Then on the Proceed screen, schedules message to be sent one hour in the future. This pending message is meant to be stopped in a later test.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Schedule message functionality doesn\'t work.'},
    { type: '', description: '● List used for test unexpectedly is not available.'},
    { type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],  
}, async ({ page }) => {
  const x = jsonData.tHour;
  const y = jsonData.tMin;

  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('link', { name: 'test list 14' }).click();
  await page.locator('div').filter({ hasText: 'Edit Message' }).nth(3).click();
  await page.getByRole('tab', { name: 'Email' }).click();
  await page.getByLabel('Subject').click();
  await page.getByLabel('Subject').fill(`#036 ${jsonData.datetime} SHOULD NOT SEND `);
  await page.getByRole('tab', { name: 'Proceed' }).click();
  await page.locator('div').filter({ hasText: /^Schedule Message$/ }).click();
  await page.getByLabel('Choose date, selected date is ').click();

  switch(x + 1) {
    case 1:
        await page.getByLabel('1 hours', { exact: true }).click();
        break;
      case 2:
        await page.getByLabel('2 hours', { exact: true }).click();
        break;
      case 3:
        await page.getByLabel('3 hours').click();
        break;
      case 4:
        await page.getByLabel('4 hours').click();
        break;
      case 5:
        await page.getByLabel('5 hours').click();
        break;
      case 6:
        await page.getByLabel('6 hours').click();
        break;
      case 7:
        await page.getByLabel('7 hours').click();
        break;
      case 8:
        await page.getByLabel('8 hours').click();
        break;
      case 9:
        await page.getByLabel('9 hours').click();
        break;
      case 10:
        await page.getByLabel('10 hours').click();
        break;
      case 11:
        await page.getByLabel('11 hours').click();
        break;
      case 12: 
        await page.getByLabel('12 hours').click();
        break;
      case 13:
        await page.getByLabel('1 hours', { exact: true }).click();
        break;
      case 14:
        await page.getByLabel('2 hours', { exact: true }).click();
        break;
      case 15:
        await page.getByLabel('3 hours').click();
        break;
      case 16:
        await page.getByLabel('4 hours').click();
        break;
      case 17:
        await page.getByLabel('5 hours').click();
        break;
      case 18:
        await page.getByLabel('6 hours').click();
        break;
      case 19:
        await page.getByLabel('7 hours').click();
        break;
      case 20:
        await page.getByLabel('8 hours').click();
        break;
      case 21:
        await page.getByLabel('9 hours').click();
        break;
      case 22:
        await page.getByLabel('10 hours').click();
        break;
      case 23:
        await page.getByLabel('11 hours').click();
        break;
      case 24:
        await page.getByLabel('12 hours').click();
        break;
  }
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByRole('button', { name: 'Schedule' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  //await page.goto('https://target110.brightarrow.com/r/home');
  await expect(page.getByText('Welcome, Ryan test')).toBeVisible({timeout: 20000 });
  await expect(page.getByText('test list 14 -- 1 contacts.')).toBeVisible();
});







test('#003: Setup for test #037, stop message hover icon test ', {
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'A pre-test setup for test #037 (stop pending msg hover icon). Navigates to My Lists and selects list "test list 15". Clicks the Edit Message button and goes to email tab. Changes subject field to include the date and start time of the test run. Then on the Proceed screen, schedules message to be sent one hour in the future. This pending message is meant to be stopped in a later test.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Schedule message functionality doesn\'t work.'},
    { type: '', description: '● List used for test unexpectedly is not available.'},
    { type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],  
}, async ({ page }) => {
  const x = jsonData.tHour;
  const y = jsonData.tMin;

  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('link', { name: 'test list 15' }).click();
  await page.locator('div').filter({ hasText: 'Edit Message' }).nth(3).click();
  await page.getByRole('tab', { name: 'Email' }).click();
  await page.getByLabel('Subject').click();
  await page.getByLabel('Subject').fill(`#037 ${jsonData.datetime} SHOULD NOT SEND `);
  await page.getByRole('tab', { name: 'Proceed' }).click();
  await page.locator('div').filter({ hasText: /^Schedule Message$/ }).click();
  await page.getByLabel('Choose date, selected date is ').click();

  switch(x + 1) {
    case 1:
        await page.getByLabel('1 hours', { exact: true }).click();
        break;
      case 2:
        await page.getByLabel('2 hours', { exact: true }).click();
        break;
      case 3:
        await page.getByLabel('3 hours').click();
        break;
      case 4:
        await page.getByLabel('4 hours').click();
        break;
      case 5:
        await page.getByLabel('5 hours').click();
        break;
      case 6:
        await page.getByLabel('6 hours').click();
        break;
      case 7:
        await page.getByLabel('7 hours').click();
        break;
      case 8:
        await page.getByLabel('8 hours').click();
        break;
      case 9:
        await page.getByLabel('9 hours').click();
        break;
      case 10:
        await page.getByLabel('10 hours').click();
        break;
      case 11:
        await page.getByLabel('11 hours').click();
        break;
      case 12: 
        await page.getByLabel('12 hours').click();
        break;
      case 13:
        await page.getByLabel('1 hours', { exact: true }).click();
        break;
      case 14:
        await page.getByLabel('2 hours', { exact: true }).click();
        break;
      case 15:
        await page.getByLabel('3 hours').click();
        break;
      case 16:
        await page.getByLabel('4 hours').click();
        break;
      case 17:
        await page.getByLabel('5 hours').click();
        break;
      case 18:
        await page.getByLabel('6 hours').click();
        break;
      case 19:
        await page.getByLabel('7 hours').click();
        break;
      case 20:
        await page.getByLabel('8 hours').click();
        break;
      case 21:
        await page.getByLabel('9 hours').click();
        break;
      case 22:
        await page.getByLabel('10 hours').click();
        break;
      case 23:
        await page.getByLabel('11 hours').click();
        break;
      case 24:
        await page.getByLabel('12 hours').click();
        break;
  }
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByRole('button', { name: 'Schedule' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  //await page.goto('https://target110.brightarrow.com/r/home');
  await expect(page.getByText('Welcome, Ryan test')).toBeVisible({timeout: 20000 });
  //await expect(page.getByText('test list 14 -- 1 contacts.')).toBeVisible();
});







test('#004: Make list from Create List button', {
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
  await expect(page).toHaveScreenshot("001-createList-listDetailsNew-chromium-win32.png", { fullPage: true });

  //Clicks the back button in the top left.
  await page.getByTestId('FastRewindIcon').click();
  //The three lines below check for list names to be visible.
  await expect(page.getByRole('link', { name: 'auto list 1', exact: true })).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole('link', { name: 'test list 1', exact: true })).toBeVisible({timeout: 10000});
  await expect(page.getByRole('link', { name: 'test list 2', exact: true })).toBeVisible();
  //Failure here means screenshot comparison of My Lists page failed.
  // await expect(page).toHaveScreenshot("001-myLists-check.png", {
  //   fullPage: true,
  //   maxDiffPixels: 40,
  //   mask: [page.locator('.listOfListsRow > td.listsTableColumns.advanced')],
  // });
  
  //await page.getByTestId('FastRewindIcon').click();
  const [request2] = await Promise.all([
    //Failure here means automation was not able to connect to TargetAPI in under 60 secs.
    page.waitForResponse(response => response.url().includes("TargetAPI/api/report/GetWeeklySummary?accessToken=") && response.status() === 200, {timeout: 60000}),
    //Hits back button to access home page
    page.getByTestId('FastRewindIcon').click()
  ]);
  await expect(page.getByText('Welcome, Ryan test')).toBeVisible();
  //Failure here means screenshot comparison of BrightArrow Central failed. 
  //await expect(page).toHaveScreenshot("001-homePage-asExpected-check.png", { fullPage: true, maxDiffPixels: 100, mask: [page.getByRole('img')], });

});





test('#005: Create list from my lists page, auto list 2', {
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

  // await expect(page).toHaveScreenshot("002-myLists-check.png", {
  //   fullPage: true,
  //   maxDiffPixels: 100,
  //   mask: [page.locator('.listOfListsRow > td.listsTableColumns.advanced')],
  // });

  const [request2] = await Promise.all([
    //Failure here means automation was not able to connect to TargetAPI in under 60 secs.
    page.waitForResponse(response => response.url().includes("TargetAPI/api/report/GetWeeklySummary?accessToken=") && response.status() === 200, {timeout: 60000}),
    //Hits back button to access home page
    page.getByTestId('FastRewindIcon').click()
  ]);

  await expect(page.getByText('Welcome, Ryan test')).toBeVisible();
  //Failure here means screenshot comparison of BrightArrow Central failed. 
  //await expect(page).toHaveScreenshot("002-homePage-asExpected-check.png", { fullPage: true, maxDiffPixels: 100, mask: [page.getByRole('img')], });

});
  
  




//change screenshot comparison to make this test unable to be impacted by either of previous two tests failing.
test('#006: Create a folder', {
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
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListsFromFolder?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('button', { name: 'Add' }).click()
  ]);

  await expect(page.getByRole('button', { name: 'auto folder' })).toBeVisible();
  // await expect(page).toHaveScreenshot("003-myLists-newfolder-check.png", {
  //   fullPage: true,
  //   mask: [page.locator('.listOfListsRow > td.listsTableColumns.advanced')],
  // });

  await page.getByRole('button', { name: 'auto folder' }).click();
  await expect(page.getByText('auto folder Lists (0)')).toBeVisible();
  await expect(page).toHaveScreenshot("003-myLists-inside-newfolder-chromium-win32.png", {
    fullPage: true,
    mask: [page.locator('.listOfListsRow > td.listsTableColumns.advanced')],
  });

  await page.getByRole('button', { name: 'ryan test' }).click();
  await expect(page.getByRole('link', { name: 'test list 1', exact: true })).toBeVisible();
});




test('#007: Create list in new folder', {
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
  await expect(page.getByRole('link', { name: 'auto list 3' })).toBeVisible({timeout: 20000});
  await expect(page).toHaveScreenshot("004-visibleInNewFolder-check-chromium-win32.png", {
    fullPage: true,
    mask: [page.locator('.listOfListsRow > td.listsTableColumns.advanced')],
  });

  await page.getByRole('button', { name: 'ryan test' }).click();
  await expect(page.getByRole('link', { name: 'auto list 3' })).toBeVisible();

  // await expect(page).toHaveScreenshot("004-visibleInMainFolder-check.png", {
  //   fullPage: true,
  //   maxDiffPixels: 100,
  //   mask: [page.locator('.listOfListsRow > td.listsTableColumns.advanced')],
  // });

});



test('#008: add contact to list, auto list 1', {
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
  //await expect(page).toHaveScreenshot("005-MyLists-newContactCheck.png", { fullPage: true, mask: [page.locator('.listOfListsRow > td.listsTableColumns.advanced')], });

  await page.getByRole('link', { name: 'auto list 1' }).click();
  //await page.getByRole('cell', { name: 'Contact1, Auto' }).click();
  const [request3] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialListContact/GetContact?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('cell', { name: 'Contact1, Auto' }).click()
  ]);
  await expect(page).toHaveScreenshot("005-auto-contact1-details-chromium-win32.png", { fullPage: true, maxDiffPixels: 15 });
});





test('#009: Access list from pen icon to make another contact, auto list 1', {
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

  //await expect(page).toHaveScreenshot("006-myLists-add2ndContact-check.png", { fullPage: true, mask: [page.locator('.listOfListsRow > td.listsTableColumns.advanced')], });
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



test('#010: Delete contact with trash icon on List Details page',{
  tag: ['@Lists'],
  annotation: [
    {type: 'Test description', description: 'Navigates to List Details page of list named "auto list 1". Clicks on trash icon to delete contact named "Auto Contact1". Uses a screenshot comparison after deletion to verify List Details page is correctly updated. Then clicks top left back button to navigate to My Lists page and verify that is correctly updated as well.'},
    {type: 'Potential Sources of Failure:', description: ''},
    {type: '', description: '● Tests #001 or #005 did not run correctly. This test is currently dependent on these to function.'},
    {type: '', description: '● Screenshot comparison fails, potentially due to unexpected bug.'},
    {type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('link', { name: 'auto list 1' }).click();
  await page.locator('td:nth-child(3) > button').first().click();

  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialListContact/DeleteContact?accessToken=") && response.status() === 200, {timeout: 60000}),
    await page.getByRole('button', { name: 'Yes' }).click()
  ]);
  await expect(page).toHaveScreenshot("007-listDetails-after-contactDeletion-chromium-win32.png", { 
    fullPage: true, 
  });

  const [request2] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListsFromFolder?accessToken=") && response.status() === 200, {timeout: 60000}),
    await page.getByTestId('FastRewindIcon').click()
  ]);

  await expect(page.getByRole('link', { name: 'auto list 1' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'test list 1', exact: true })).toBeVisible();

  // await expect(page).toHaveScreenshot("007-myLists-after-contactDeletion.png", { 
  //   fullPage: true, 
  //   mask: [page.locator('.listOfListsRow > td.listsTableColumns.advanced')],
  //   });
  
});



test('#011: Click on gear icon, test list 2',{
  tag: ['@Lists'],
  annotation: [
    {type: 'Test description', description: 'Tests the gear icon that appears by mouse hovering over a list in the My Lists page. Clicks on this to access list named "test list 2". Then goes to List Settings and changes settings in most subpages.'},
    {type: 'Potential Sources of Failure:', description: ''},
    {type: '', description: '● Gear hover icon does not work.'},
    {type: '', description: '● List ("auto list 1") to change the settings of is not found. Potentially due to error or bug in its creation in test #001.'},
    {type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').fill('test list 2');
  await page.getByLabel('Search').press('Enter');
  await page.getByRole('link', { name: 'test list 2' }).hover();
  await page.getByRole('link', { name: 'List Settings' }).click();

  //await page.getByLabel('Disable deleting current').check();
  // const [request] = await Promise.all([
  //   page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/SetListSetting") && response.status() === 200, {timeout: 60000}),
  //   page.getByLabel('Disable deleting current').check()
  // ]);
  // await page.getByRole('tab', { name: 'Phone Call Settings' }).click();
  // await page.getByLabel('Number of retries upon busy').click();
  // await page.getByLabel('Number of retries upon busy').fill('1');
  // await page.getByLabel('Call specific numbers').check();
  // await expect(page.getByText('Phone 1')).toBeVisible();
  // await expect(page.getByLabel('Phone 1')).toBeVisible();
  // await page.getByLabel('Phone 1').check();
  // await page.getByRole('tab', { name: 'Text Settings' }).click();
  // await page.getByLabel('Other phones').uncheck();
  // await page.getByLabel('Phone 3').uncheck();
  await page.getByRole('tab', { name: 'Email Settings' }).click();
  await page.getByLabel('Email Subject').click();
  await page.getByLabel('Email Subject').fill(`${jsonData.datetime}`);
  // await page.getByRole('tab', { name: 'Portal Settings' }).click();
  // await page.getByRole('tab', { name: 'CC Settings' }).click();
  // await page.getByLabel('CC list (comma-separated)').fill('ryanrogers99@yahoo.com');
  // await page.locator('#root div').filter({ hasText: 'List ManagementPhone Call' }).nth(1).click();
});


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



