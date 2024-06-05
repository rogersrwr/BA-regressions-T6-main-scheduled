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
  /*
  if (jsonData.finished == true && jsonData.failures == false) {
    await app.client.chat.postMessage({
      token: process.env.O_AUTH,
      channel: channelId,
      text: `:white_check_mark: Tests ran successfully. Visit https://rogersrwr.github.io/BA-regressions-T6/ for full results.`,
    });
  } else if (jsonData.finished == true && jsonData.failures == true ) {
    await app.client.chat.postMessage({
      token: process.env.O_AUTH,
      channel: channelId,
      text: `:x: Test run has failed. Visit https://rogersrwr.github.io/BA-regressions-T6/ for full results.`,
    });
  }
  */
});





test('#025: Delete folder, auto folder',{
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





test('#026: Delete list, auto list 1',{
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





test('#027: Delete list, auto list 2',{
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
test('#028: Delete list 3, auto list import',{
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





test('#029: ParentHub message received confirmation',{
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
  await page.getByLabel('Enter your phone number').fill(`8624385648`);
  await page.getByLabel('Enter your password').click();
  await page.getByLabel('Enter your password').fill(`RogerOf26`);
  await page.getByLabel('Enter your password').press('Enter');
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.locator('div').filter({ hasText: /^FEEDS$/ }).click();
  await page.locator('div').filter({ hasText: /^CHATS$/ }).click();
  await page.getByRole('button', { name: 'settings' }).click();
  await expect(page.getByText(`${jsonData.datetime}`)).toBeVisible();
  

});




test('wrap up tests',{
  annotation: { type: '', description: 'This can be ignored, just used for test suite wrap up.' },
}, async ({ page }) => {
  jsonData.finished = true;
  const jsonString = JSON.stringify(jsonData, null, 2);
  fs.writeFileSync('D:/a/BA-regressions-T6/BA-regressions-T6/datetime.json', jsonString);
});


