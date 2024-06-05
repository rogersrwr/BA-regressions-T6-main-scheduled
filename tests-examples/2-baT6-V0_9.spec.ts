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
  mode: 'parallel',
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

});








test('#008: add list to favorites with heart icon, auto list 1',{
  tag: ['@Lists'],
  annotation: [
    {type: 'Test description', description: 'Tests the heart icon that appears by hovering over a list within the My Lists page. Hovers over list named "auto list 1" and uses heart icon to add this list to "My Favorites" folder. '},
    {type: 'Potential Sources of Failure', description: ''},
    {type: '', description: '● Heart hover icon does not work.'},
    {type: '', description: '● List which is used to test this ("auto list 1") is not found. Potentially due to error or bug in its creation in test #001.'},
    {type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  test.setTimeout(50000);
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('test list 1');
  await page.getByLabel('Search').press('Enter');
  await page.getByRole('link', { name: 'test list 1' }).hover();
  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/folder/GetFavoriteFolders?accessToken=") && response.status() === 200, {timeout: 60000}),
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
    page.waitForResponse(response => response.url().includes("TargetAPI/api/folder/AddToFavoriteFolder?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('button', { name: 'OK' }).click()
  ]);
  await expect(page.getByRole('button', { name: 'ryan test' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'test list 1' })).toBeVisible();
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
  await page.getByLabel('Search').fill('test list 1');
  await page.getByLabel('Search').press('Enter');
  await page.getByRole('link', { name: 'test list' }).click();
  await page.getByRole('row', { name: 'contact, test' }).getByRole('button').first().click();
  // await page.getByLabel('Email 1').click();
  // await page.getByLabel('Email 1').click();
  // await page.getByLabel('Email 1').fill('newemail@email.com');
  // const [request] = await Promise.all([
  //   page.waitForResponse(response => response.url().includes("TargetAPI/api/dialListContact/LoadContacts?accessToken=") && response.status() === 200, {timeout: 60000}),
  //   page.getByRole('button', { name: 'Apply' }).click()
  // ]);
  // await expect(page.locator('tbody')).toContainText('5555555555, newemail@email.com');
  // await expect(page).toHaveScreenshot("009-listDetailsEdit-check.png", { fullPage: true });
});





test('#010: Disabling a contact', {
  tag: ['@Lists'],
  annotation: [
    { type: 'Test Description', description: 'Navigates to list named "Test List 1", and disables contact named "phone, ryan". Then verifies changes by backing out and back into same list to verify change has been saved in same browser session.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Failure navigating to list. Potentially caused by list being accidentally deleted, prior page elements not working, or slow connectivity to APIs or server.'},
    { type: '', description: '● Contact disabling not working for some reason. '},
    { type: '', description: '● Test suite setup/cleanup failed and contact was not properly reset, causing test to run into unexpected conditions.'},
    { type: '', description: '● Random failures of web page components not working as expected, slow connectivity, or an abnormality with how Playwright interacts with the web app.'},
  ],
}, async ({ page }) => {
  await test.step('Navigate to list', async () => {
    await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
    await page.getByRole('button', { name: 'ryan test' }).click();
    await page.getByRole('link', { name: 'test list 4' }).click();
  });
  await test.step('Disable a contact', async () => {
    //old one was #cb_list438620451
    await expect(page.locator('#cb_list492061458'), 'Error here means test was likely not properly setup due to pre-test setup failing.').toBeChecked();
    await page.locator('#cb_list492061458').uncheck();
  });
  await test.step('Back out and re-enter list to verify changes have been saved', async () => {
    await page.getByTestId('FastRewindIcon').click();
    await expect(page.getByRole('link', { name: 'test list 4' })).toBeVisible();
    await page.getByRole('link', { name: 'test list 4' }).click();
    await expect(page.getByRole('cell', { name: 'phone, ryan' })).toBeVisible();
    //await expect(page.locator('#cb_list438620451'), 'Error here means contact disable did not save correctly.').not.toBeChecked();
  });
});






test('#011: Testing "Hide Disabled Contacts" checkbox within List Details page.', {
  tag: ['@Lists'],
  annotation: [
    { type: 'Test Description', description: 'Goes to list named "test list 1" that now has 1 disabled contact. Within List Details page, clicks checkbox to Hide Disabled Contacts. Backs out and re-enters list to make sure changes have been made. A couple visual regression screenshot comparison tests are made to ensure that info is saved and displayed as expected.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Hide Disabled Contacts button does not work.'},
    { type: '', description: '● Failure navigating to list. Potentially caused by list being accidentally deleted, prior page elements not working, or slow connectivity to APIs or server.'},
    { type: '', description: '● Test suite setup/cleanup failed and contact was not properly reset, causing test to run into unexpected conditions.'},
    { type: '', description: '● A screenshot comparison fails, potentially due to a visual regresion, an unexpected element changing or appearing, info not changing or saving, or the screenshot capture not working as intended.'},
    { type: '', description: '● Random failures of web page components not working as expected, slow connectivity, or an abnormality with how Playwright interacts with the web app.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('link', { name: 'test list 5' }).click();
  await expect(page.getByRole('cell', { name: 'phone, ryan' })).toBeVisible();
  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialListContact/LoadContacts?accessToken=") && response.status() === 200, {timeout: 60000}),
    await page.locator('#hideDisabledButton').check()
  ]);
  await expect(page.getByRole('cell', { name: 'phone, ryan' })).toBeHidden();
  await expect(page).toHaveScreenshot("011-hideDisabledContactsCheckbox-check-chromium2-win32.png", { fullPage: true });

  await page.getByTestId('FastRewindIcon').click();
  await page.getByRole('link', { name: 'test list 5' }).click();
  await expect(page.getByRole('cell', { name: 'contact, test' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'parent, phone' })).toBeVisible();
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
    { type: 'Test description', description: 'Navigates to list named "test list 2". Clicks Edit Message button in List Details page. Unchecks text option, and checks email message option instead. In email subject, inputs a short message with the date and start time of this specific test run. Also inputs one mail merge field of [[fullName]]. At end of this process, clicks Save Message instead of send.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Edit Message button does not work.'},
    { type: '', description: '● Some part of the edit message process does not work as expected.'},
    { type: '', description: '● List this is tested with is unexpectedly not there. '},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('link', { name: 'test list 2' }).click();
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
  await expect(page.getByRole('cell', { name: 'parent, phone' })).toBeVisible();
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
  await page.getByRole('link', { name: 'test list 2' }).click();
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
  await page.getByLabel('Search').fill('test list 2');
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
  // await expect(page.getByText('Invites Received')).toBeVisible();
  // await page.getByTestId('FastRewindIcon').click();
  // await expect(page.getByRole('link', { name: 'ryan test & test contact1' })).toBeVisible();
  // await page.locator('#channelFilter').selectOption('InvitesSent');
  // await expect(page.getByRole('link', { name: 'start brightchat (ryan test)' })).toBeVisible();
});





test('#020: Access reports page from BA Central Reports button',{
  tag: ['@Reports'],
  annotation: [
    { type: 'Test description', description: 'Clicks on Reports button from BrightArrow Central. Clicks through various tabs to confirm everything is at least visually working.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Reports button is not working.'},
    { type: '', description: '● Some part of navigating through Reports tabs does not work as expected.'},
    { type: '', description: '● Extra slow network connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^Reports$/ }).click();
  await expect(page.getByText('Reports of Messages')).toBeVisible();
  await expect(page.getByRole('tab', { name: 'All Messages' })).toBeVisible();
  await page.getByRole('tab', { name: 'Monthly Totals' }).click();
  await page.getByRole('tab', { name: 'All Portal User Edits' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByRole('tab', { name: 'Texting Opt Ins' }).click();
  await page.getByRole('tab', { name: 'BrightChat Logs' }).click();
  await expect(page.getByRole('link', { name: 'ryan test & test contact1' })).toBeVisible();
});




test('#021: Access user settings',{
  tag: ['@Settings'],
  annotation: [
    { type: 'Test description', description: 'Clicks on User Settings from BrightArrow Central top left navigation icon. Ensures everything is visually where it should be.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● User Settings button is not working.'},
    { type: '', description: '● Extra slow network connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.getByTestId('MenuIcon').click();
  await page.getByRole('button', { name: 'User settings' }).click();
  await expect(page.getByText('ryantest')).toBeVisible();
  await expect(page.getByText('ryanrogers99@yahoo.com')).toBeVisible();
});



test('#022: Access My Lists from top left nav icon in BrightArrow Central',{
  tag: ['@Lists'],
  annotation: [
    { type: 'Test description', description: 'Clicks on navigation icon in top left corner from BrightArrow Central and navigates to My Lists. Ensures that this button is working as expected.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● My Lists button in this navigation menu is not working.'},
    { type: '', description: '● Extra slow network connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.getByTestId('MenuIcon').click();
  await page.getByRole('button', { name: 'My Lists' }).click();
  await expect(page.getByRole('button', { name: 'ryan test' })).toBeVisible();
});



test('#023: Access Active BrightChats from top left nav icon in BrightArrow Central',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'Clicks on navigation icon in top left corner from BrightArrow Central and navigates to Active BrightChats. Ensures that this button is working as expected.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Active BrightChats button in this navigation menu is not working.'},
    { type: '', description: '● Extra slow network connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.getByTestId('MenuIcon').click();
  await page.getByRole('button', { name: 'Active BrightChats' }).click();
  await expect(page.getByRole('link', { name: 'ryan test & test contact1' })).toBeVisible();
});






test('#024: Access Reports from top left nav icon in BrightArrow Central',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'Clicks on navigation icon in top left corner from BrightArrow Central and navigates to Reports. Ensures that this button is working as expected.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Active BrightChats button in this navigation menu is not working.'},
    { type: '', description: '● Extra slow network connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.getByTestId('MenuIcon').locator('path').click();
  await page.getByRole('button', { name: 'Reports' }).click();
  await expect(page.getByText('Reports of Messages')).toBeVisible();
  await expect(page.getByRole('tab', { name: 'All Messages' })).toBeVisible();
});






