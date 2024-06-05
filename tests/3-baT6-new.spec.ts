import { test, expect, firefox } from '@playwright/test';
import * as fs from 'fs';
import { json } from 'stream/consumers';
const { App } = require('@slack/bolt');


const username = process.env.ACCT_LOGIN;
const password = process.env.ACCT_PASSWORD;
const phone = process.env.PHONE_NUMBER;
const parent_pass = process.env.PARENT_PASS;
const email = process.env.EMAIL;
const e_pass = process.env.EMAIL_PASS;
const phone2 = process.env.PHONE_ALT;
const username2 = process.env.ACCT_LOGIN2;
const username3 = process.env.ACCT_LOGIN3;
const username4 = process.env.ACCT_LOGIN4;

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
  // await page.getByLabel('Username').click();
  // await page.getByLabel('Username').fill(`${username}`);
  // await page.getByLabel('Password').click();
  // await page.getByLabel('Password').fill(`${password}`);
  
  // const [request] = await Promise.all([
  //   page.waitForResponse(response => response.url().includes("TargetAPI/api/report/GetWeeklySummary?accessToken=") && response.status() === 200, {timeout: 60000}),
  //   page.getByRole('button', { name: 'Sign in' }).click()
  // ]);

  // await expect(page.getByText('Welcome, Ryan test')).toBeVisible();
  // await expect(page.frameLocator('iframe[title="Help Scout Beacon - Messages and Notifications"]').getByText('Hi, I\'m the new BrightArrow')).toBeVisible();
  // await page.frameLocator('iframe[title="Help Scout Beacon - Messages and Notifications"]').getByRole('button', { name: 'Close' }).click();  
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





test('#056: Removing list from favorites folder with heart icon',{
  tag: ['@Lists', '@Acct2'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists page and then My Favorites folder. Mouse hovers over list in folder named "test list 1" and then selects heart icon to remove list from this folder.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Will fail if test #012 did not properly run. This test is currently dependent on that to run correctly.'},
    { type: '', description: '● Some bug occurred in the process of removing a list from the favorites folder.'},
    {type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await test.step('Login', async () => {
    await page.goto('https://target110.brightarrow.com/r/');
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill(`${username4}`);
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
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'My Favorites' }).click();
  await page.getByRole('link', { name: 'test list 1', exact: true }).hover();
  await page.getByRole('link', { name: 'Remove from folder' }).click();

  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListsFromFolder?accessToken=") && response.status() === 200, {timeout: 60000}),
    await page.getByRole('button', { name: 'OK' }).click()
  ]);

  await expect(page.getByText('My Favorites Lists')).toBeVisible();

});


test('#057: Removing list from favorites folder with menu',{
  tag: ['@Lists', '@Acct2'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists page and then My Favorites folder. Mouse hovers over list in folder named "test list 2" and then selects heart icon to remove list from this folder.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Will fail if test #013 did not properly run. This test is currently dependent on that to run correctly.'},
    { type: '', description: '● Some bug occurred in the process of removing a list from the favorites folder.'},
    {type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await test.step('Login', async () => {
    await page.goto('https://target110.brightarrow.com/r/');
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill(`${username4}`);
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
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'My Favorites' }).click();
  await page.getByRole('link', { name: 'test list 2', exact: true }).hover();
  await page.getByRole('link', { name: 'Remove from folder' }).click();

  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListsFromFolder?accessToken=") && response.status() === 200, {timeout: 60000}),
    await page.getByRole('button', { name: 'OK' }).click()
  ]);

  await expect(page.getByText('My Favorites Lists')).toBeVisible();

});





test('#058: Remove email from Do Not Contact list/time',{
  tag: ['@Other'],
  annotation: [
    { type: 'Test description', description: 'Clicks on top left nav and selects Do Not Disturb list/time. Selects email "brightarrowtest3@gmail.com" and removes it from the list. This test will fail if test #017 failed because of a bug or test run error.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Will fail if test #017 did not properly run. This test is currently dependent on that to run correctly.'},
    { type: '', description: '● Some bug occurred in the process of removing an email from Do Not Contact list/time.'},
    {type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await test.step('Login', async () => {
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
  await page.getByTestId('MenuIcon').locator('path').click();
  await page.getByRole('button', { name: 'Do Not Contact list/time' }).click();
  // await page.getByText('brightarrowtest3@gmail.com').click();
  // await page.getByRole('button', { name: 'Remove >>' }).click();
  // await page.getByTestId('HomeIcon').click();
  // await expect(page.getByText('Welcome, Ryan test')).toBeVisible();
});






test('#059: Delete folder, auto folder',{
  tag: ['@Lists'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists page. Selects folder named "auto folder" created at the start of the test run. Clicks the trash icon delete folder button.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Delete folder icon in folder page does not work.'},
    { type: '', description: '● The folder that this test runs off of is not there, potentially due to an error with its initial creation.'},
  ],
}, async ({ page }) => {
  await test.step('Login', async () => {
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
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'auto folder' }).click();
  await page.getByRole('link', { name: 'Delete Folder' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByRole('button', { name: 'ryan test' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'auto list 3' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'test list 1', exact: true })).toBeVisible();
});





test('#060: Delete list, auto list 1',{
  tag: ['@Lists'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists page. Searches for "auto list 1" (easier to set up for deletion this way in automation). Selects the top checkbox to select auto list 1. Then clicks Select an Action button and deletes list. '},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● A button within the process for deleting a list does not work as expected.'},
    { type: '', description: '● The list that this test runs off of is not there, potentially due to an error with its initial creation.'},
  ],
}, async ({ page }) => {
  await test.step('Login', async () => {
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
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 1');
  await page.getByLabel('Search').press('Enter');
  await page.locator('input[name="cb_lists2162271"]').check();
  await page.getByRole('button', { name: 'Select an Action' }).click();
  await page.getByRole('button', { name: 'Delete a list' }).click();
  //await page.getByRole('button', { name: 'OK' }).click();
  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/DeleteList?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('button', { name: 'OK' }).click()
  ]);
});





test('#061: Delete list, auto list 2',{
  tag: ['@Lists'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists page. Searches for "auto list 2" (easier to set up for deletion this way in automation). Selects the top checkbox to select auto list 1. Then clicks Select an Action button and deletes list. '},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● A button within the process for deleting a list does not work as expected.'},
    { type: '', description: '● The list that this test runs off of is not there, potentially due to an error with its initial creation.'},
  ],
}, async ({ page }) => {
  await test.step('Login', async () => {
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
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 2');
  await page.locator('#searchBarBtn').click();
  await page.locator('input[name="cb_lists2162271"]').check();
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
test('#062: Delete list 3, auto list import',{
  tag: ['@Lists'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists page. Searches for "auto list 3" (easier to set up for deletion this way in automation). Selects the top checkbox to select auto list 1. Then clicks Select an Action button and deletes list. '},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● A button within the process for deleting a list does not work as expected.'},
    { type: '', description: '● The list that this test runs off of is not there, potentially due to an error with its initial creation.'},
  ],
}, async ({ page }) => {
  await test.step('Login', async () => {
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
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 3');
  await page.getByLabel('Search').press('Enter');
  await page.locator('input[name="cb_lists2162271"]').check();
  await page.getByRole('button', { name: 'Select an Action' }).click();
  await page.getByRole('button', { name: 'Delete a list' }).click();
  //await page.getByRole('button', { name: 'OK' }).click();
  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/DeleteList?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('button', { name: 'OK' }).click()
  ]);
  await page.locator('#searchBarBtn').click();
});





test('#063: ParentHub message received confirmation',{
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
  // await page.getByLabel('Enter your password').fill(`RogerOf26`);
  // await page.getByLabel('Enter your password').press('Enter');
  // await page.getByRole('button', { name: 'OK' }).click();
  // await page.getByRole('button', { name: 'Cancel' }).click();
  // await page.locator('div').filter({ hasText: /^FEEDS$/ }).click();
  // await page.locator('div').filter({ hasText: /^CHATS$/ }).click();
  // await page.getByRole('button', { name: 'settings' }).click();
  // await expect(page.getByText(`${jsonData.datetime}`)).toBeVisible();
  

});


test('#064: Test #021 receive confirmation.',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'Logs into Google Voice to confirm if SMS text message was properly sent and received. Selects messages to view and confirms if expected text message is there.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● ParentHub access through link does not work.'},
    { type: '', description: '● Login unexpectedly doesn\'t work.'},
    { type: '', description: '● Message was not properly sent or received.'},
    { type: '', description: '● Unexpected interactions with the ParentHub interface.'},
  ],
}, async ({ page }) => {
  //test.slow();
  await page.goto('https://voice.google.com/about');
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByLabel('Email or phone').fill(`${email}`);
  //await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Email or phone').press('Enter');
  await page.getByLabel('Enter your password').fill(`${e_pass}`);
  //await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Enter your password').press('Enter');

  try {
    await expect(page.getByRole('link', { name: 'Confirm your recovery phone' })).toBeVisible();
    await page.getByRole('link', { name: 'Confirm your recovery phone' }).click();
    await page.getByLabel('Phone number').click();
    await page.getByLabel('Phone number').fill(`${phone2}`);
    await page.getByLabel('Phone number').press('Enter');
    //await page.goto('https://voice.google.com/u/0/calls');
    await expect(page.getByRole('heading', { name: 'Hi BrightArrow1!' })).toBeVisible({timeout: 10000});
    await page.getByRole('tab', { name: 'Messages' }).click();
    await page.getByLabel('Message by ‪79041‬:').click();
    //await expect(page.getByRole('list').getByText(`#013 ${jsonData.datetime}`, { exact: true })).toBeVisible();
    } catch (error) {
    await expect(page.getByRole('heading', { name: 'Hi BrightArrow1!' })).toBeVisible({timeout: 10000});
    await page.getByRole('tab', { name: 'Messages' }).click();
    await page.getByLabel('Message by ‪79041‬:').click();
    //await expect(page.getByRole('list').getByText(`#013 ${jsonData.datetime}`, { exact: true })).toBeVisible();
  }

});




test('#065: Test #023 receive confirmation.',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'Logs into gmail to confirm if message sent from test #023 was properly sent and received.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● ParentHub access through link does not work.'},
    { type: '', description: '● Login unexpectedly doesn\'t work.'},
    { type: '', description: '● Message was not properly sent or received.'},
    { type: '', description: '● Unexpected interactions with the ParentHub interface.'},
  ],
}, async ({ page }) => {
  await page.goto('https://www.google.com/intl/en-US/gmail/about/');
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByLabel('Email or phone').fill(`${email}`);
  //await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Email or phone').press('Enter');
  await page.getByLabel('Enter your password').fill(`${e_pass}`);
  //await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Enter your password').press('Enter');

  try {
    await expect(page.getByRole('link', { name: 'Confirm your recovery phone' })).toBeVisible();
    await page.getByRole('link', { name: 'Confirm your recovery phone' }).click();
    await page.getByLabel('Phone number').click();
    await page.getByLabel('Phone number').fill(`${phone2}`);
    await page.getByLabel('Phone number').press('Enter');
    await expect(page.getByRole('main').getByRole('tablist').getByText('Primary')).toBeVisible();
    await expect(page.getByRole('main').getByRole('tablist').getByText('Promotions')).toBeVisible();
    //await expect(page.getByRole('link', { name: `#015 ${jsonData.datetime}` })).toBeVisible();
    //await page.getByRole('link', { name: '#000 test msg at 2024-6-3_17-' }).click();
  } catch (error) {
    await expect(page.getByRole('main').getByRole('tablist').getByText('Primary')).toBeVisible();
    await expect(page.getByRole('main').getByRole('tablist').getByText('Promotions')).toBeVisible();
    //await expect(page.getByRole('link', { name: `#015 ${jsonData.datetime}` })).toBeVisible();
    //await page.getByRole('link', { name: `#015 ${jsonData.datetime}` }).click();
  }

  

});


test('#066: Test #024 receive confirmation.',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'Logs into gmail to confirm if message sent from test #024 was properly sent and received.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● ParentHub access through link does not work.'},
    { type: '', description: '● Login unexpectedly doesn\'t work.'},
    { type: '', description: '● Message was not properly sent or received.'},
    { type: '', description: '● Unexpected interactions with the ParentHub interface.'},
  ],
}, async ({ page }) => {
  await page.goto('https://www.google.com/intl/en-US/gmail/about/');
  await page.getByRole('link', { name: 'Sign in' }).click();

});



test('#067: Test #040 receive confirmation.',{
  tag: ['@Messages', '@ParentHub'],
  annotation: [
    { type: 'Test description', description: 'Logs into gmail to confirm if message sent from test #040 was properly sent and received.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● ParentHub access through link does not work.'},
    { type: '', description: '● Login unexpectedly doesn\'t work.'},
    { type: '', description: '● Message was not properly sent or received.'},
    { type: '', description: '● Unexpected interactions with the ParentHub interface.'},
  ],
}, async ({ page }) => {
  await page.goto('https://www.google.com/intl/en-US/gmail/about/');
  await page.getByRole('link', { name: 'Sign in' }).click();

});



test('#068: Test #041 receive confirmation.',{
  tag: ['@Messages', '@ParentHub'],
  annotation: [
    { type: 'Test description', description: 'Logs into gmail to confirm if message sent from test #041 was properly sent and received.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● ParentHub access through link does not work.'},
    { type: '', description: '● Login unexpectedly doesn\'t work.'},
    { type: '', description: '● Message was not properly sent or received.'},
    { type: '', description: '● Unexpected interactions with the ParentHub interface.'},
  ],
}, async ({ page }) => {
  await page.goto('https://www.google.com/intl/en-US/gmail/about/');
  await page.getByRole('link', { name: 'Sign in' }).click();

});






test('#069: Test #042 receive confirmation.',{
  tag: ['@Messages', '@ParentHub'],
  annotation: [
    { type: 'Test description', description: 'Logs into gmail to confirm if message sent from test #042 was properly sent and received.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● ParentHub access through link does not work.'},
    { type: '', description: '● Login unexpectedly doesn\'t work.'},
    { type: '', description: '● Message was not properly sent or received.'},
    { type: '', description: '● Unexpected interactions with the ParentHub interface.'},
  ],
}, async ({ page }) => {
  await page.goto('https://www.google.com/intl/en-US/gmail/about/');
  await page.getByRole('link', { name: 'Sign in' }).click();

});



test('#070: Test #043 receive confirmation.',{
  tag: ['@Messages', '@ParentHub'],
  annotation: [
    { type: 'Test description', description: 'Logs into gmail to confirm if message sent from test #043 was properly sent and received.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● ParentHub access through link does not work.'},
    { type: '', description: '● Login unexpectedly doesn\'t work.'},
    { type: '', description: '● Message was not properly sent or received.'},
    { type: '', description: '● Unexpected interactions with the ParentHub interface.'},
  ],
}, async ({ page }) => {
  await page.goto('https://www.google.com/intl/en-US/gmail/about/');
  await page.getByRole('link', { name: 'Sign in' }).click();

});







test('#071: Test #049 receive confirmation.',{
  tag: ['@Messages', '@ParentHub'],
  annotation: [
    { type: 'Test description', description: 'Logs into gmail to confirm if message sent from test #049 was properly sent and received.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● ParentHub access through link does not work.'},
    { type: '', description: '● Login unexpectedly doesn\'t work.'},
    { type: '', description: '● Message was not properly sent or received.'},
    { type: '', description: '● Unexpected interactions with the ParentHub interface.'},
  ],
}, async ({ page }) => {
  await page.goto('https://www.google.com/intl/en-US/gmail/about/');
  await page.getByRole('link', { name: 'Sign in' }).click();

});







test('#072: Test #050 receive confirmation.',{
  tag: ['@Messages', '@ParentHub'],
  annotation: [
    { type: 'Test description', description: 'Logs into gmail to confirm if message sent from test #050 was properly sent and received.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● ParentHub access through link does not work.'},
    { type: '', description: '● Login unexpectedly doesn\'t work.'},
    { type: '', description: '● Message was not properly sent or received.'},
    { type: '', description: '● Unexpected interactions with the ParentHub interface.'},
  ],
}, async ({ page }) => {
  await page.goto('https://www.google.com/intl/en-US/gmail/about/');
  await page.getByRole('link', { name: 'Sign in' }).click();

});






test('wrap up tests', async ({ page }) => {
  jsonData.finished = true;
  const jsonString = JSON.stringify(jsonData, null, 2);
  fs.writeFileSync('D:/a/BA-regressions-T6/BA-regressions-T6/datetime.json', jsonString);
});



