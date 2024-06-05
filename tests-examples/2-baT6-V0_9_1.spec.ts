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







test('#009: add list to favorites with heart icon, test list 1',{
  tag: ['@Lists'],
  annotation: [
    {type: 'Test description', description: 'Tests the heart icon that appears by hovering over a list within the My Lists page. Hovers over list named "test list 1" and uses heart icon to add this list to "My Favorites" folder. '},
    {type: 'Potential Sources of Failure', description: ''},
    {type: '', description: '● Heart hover icon does not work.'},
    {type: '', description: '● List which is used to test this ("test list 1") is not found.'},
    {type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  //test.setTimeout(50000);
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('test list 1');
  await page.getByLabel('Search').press('Enter');
  await page.getByRole('link', { name: 'test list 1', exact: true }).hover();
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
  await expect(page.getByRole('link', { name: 'test list 1', exact: true })).toBeVisible();
});






test('#009-1: add list to favorites with menu, test list 2',{
  tag: ['@Lists'],
  annotation: [
    {type: 'Test description', description: 'Navigates to My Lists, selects checkbox of list "test list 2", clicks Select An Action button, and selects Add list to favorites. Adds list to My Favorites folder. Selects My Favorites folder and verifies list is there.'},
    {type: 'Potential Sources of Failure', description: ''},
    {type: '', description: '● Add to list to favorites function does not work.'},
    {type: '', description: '● List which is used to test this ("test list 2") is not found.'},
    {type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('test list 2');
  await page.getByLabel('Search').press('Enter');
  await page.locator('input[name="cb_lists2039717"]').check();
  await page.getByRole('button', { name: 'Select an Action' }).click();
  //await page.getByRole('button', { name: 'Add list to favorites' }).click();
  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/folder/GetFavoriteFolders?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('button', { name: 'Add list to favorites' }).click()
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
  //await page.getByRole('button', { name: 'OK' }).click();
  await page.locator('.MuiPaper-root > div').first().click();
  await page.locator('#searchBarBtn').click();
  await page.getByRole('button', { name: 'My Favorites' }).click();
  await expect(page.getByRole('link', { name: 'test list 2' })).toBeVisible();

});






test('#009-2: Copy list feature from menu (My Lists page)',{
  tag: ['@Lists'],
  annotation: [
    {type: 'Test description', description: 'Navigates to My Lists, clicks Select An Action button, and selects Copy a list. Inputs "test list 1 copy" into list name field. Selects source list as "test list 1". After hitting "OK", verifies new list is there when My Lists page loads, and then selects newly created list and verifies contacts are there. '},
    {type: 'Potential Sources of Failure', description: ''},
    {type: '', description: '● Copy a list button or functionality does not work.'},
    {type: '', description: '● List which is used to test this ("test list 1") is not found.'},
    {type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'Select an Action' }).click();
  await page.getByRole('button', { name: 'Copy a list' }).click();
  await page.getByLabel('New list name').click();
  await page.getByLabel('New list name').fill('test list 1 copy');
  await page.getByLabel('Please select the source list').click();
  await page.getByRole('option', { name: 'test list 1 (3 entries)' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByRole('link', { name: 'test list 1 copy (linked)' })).toBeVisible();
  await page.getByRole('link', { name: 'test list 1 copy (linked)' }).click();
  await expect(page.getByRole('cell', { name: 'contact, test' })).toBeVisible();
});





test('#009-3: Edit a message, make a change and then try backing out of page. Select yes in the "Do you wish to save your changes?" popup. Re-enter edit message and verify changes have been saved.',{
  tag: ['@Lists'],
  annotation: [
    {type: 'Test description', description: 'Navigates to My Lists and selects list "test list 3". Clicks Edit Message button, goes to email tab, and changes email subject field to a string that contains the date and start time of test regression test suite. Then hits the top left back button to trigger the popup of "Do you wish to save your changes?". Clicks "yes". Then re-enters Edit Message process and verifies change has been saved.'},
    {type: 'Potential Sources of Failure', description: ''},
    {type: '', description: '● Save changes popup does not work.'},
    {type: '', description: '● List which is used to test this ("test list 3") is not found.'},
    {type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('link', { name: 'test list 3' }).click();
  await page.locator('div').filter({ hasText: 'Edit Message' }).nth(3).click();
  await page.getByRole('tab', { name: 'Email' }).click();
  await page.getByLabel('Subject').click();
  await page.getByLabel('Subject').fill(`${jsonData.datetime}`);
  await page.getByTestId('FastRewindIcon').click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByText('List Details')).toBeVisible();
  await page.locator('div').filter({ hasText: 'Edit Message' }).nth(3).click();
  await page.getByRole('tab', { name: 'Email' }).click();


});







test('#009-4: Save message button on Create Message page',{
  tag: ['@Lists'],
  annotation: [
    {type: 'Test description', description: 'Navigates to My Lists,'},
    {type: 'Potential Sources of Failure', description: ''},
    {type: '', description: '● Save changes popup does not work.'},
    {type: '', description: '● List which is used to test this ("test list 3") is not found.'},
    {type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
});






test.skip('#009-5: Send saved message to a list with 0 contacts/all disabled contacts/contacts with no phone number or email. Should be prevented from sending message.',{
  tag: ['@Lists'],
  annotation: [
    {type: 'This feature is currently bugged. Skipping this test until bug is resolved.', description: ''},
    {type: 'Test description', description: 'Navigates to My Lists,'},
    {type: 'Potential Sources of Failure', description: ''},
    {type: '', description: '● Save changes popup does not work.'},
    {type: '', description: '● List which is used to test this ("test list 3") is not found.'},
    {type: '', description: '● Extra slow connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
});





test('#010: Changing contact email from pen icon in List Details page',{
  tag: ['@Lists'],
  annotation: [
    {type: 'Test description', description: 'Tests the pen hover icon found within the List Details page. This is tested within list named "test list 1". Uses pen icon to access Contact Details of "Auto Contact1". Changes email. A screenshot comparison test is made to check that List Details page is properly updated after changing info.'},
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
  await page.getByRole('link', { name: 'test list 1', exact: true }).click();
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






test('#011: Disabling a contact', {
  tag: ['@Lists'],
  annotation: [
    { type: 'Test Description', description: 'Navigates to list named "test List 4", and disables contact named "phone, ryan". Then verifies changes by backing out and back into same list to verify change has been saved.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Failure navigating to list. Potentially caused by list being accidentally deleted, prior page elements not working, or slow connectivity to APIs or server.'},
    { type: '', description: '● Contact disabling not working for some reason. '},
    { type: '', description: '● Test suite setup/cleanup failed and contact was not properly reset, causing test to run into unexpected conditions.'},
    { type: '', description: '● Random failures of web page components not working as expected, slow connectivity, or an abnormality with how Playwright interacts with the web app.'},
  ],
}, async ({ page }) => {
  await test.step('Navigate to list', async () => {
    await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
    const [request] = await Promise.all([
      page.waitForResponse(response => response.url().includes("TargetAPI/api/Folder/SetSelectedFolderSettings?accessToken=") && response.status() === 200, {timeout: 60000}),
      await page.getByRole('button', { name: 'ryan test' }).click()
    ]);
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
    await expect(page.locator('tr').filter({ hasText: 'phone, ryan5555555557' }).getByTestId('CheckBoxIcon'), 'Error here means contact disable did not save correctly').toBeHidden();
  });
});






test('#012: Testing "Hide Disabled Contacts" checkbox within List Details page.', {
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





test('#013: Create Message button from List Details page and send text message',{
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
  await page.getByRole('link', { name: 'test list 1', exact: true }).click();
  await page.locator('div').filter({ hasText: 'Create Message' }).nth(3).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByLabel('Texting').check();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Text Message').click();
  await page.getByLabel('Text Message').fill(`#013 ${jsonData.datetime}`);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('div').filter({ hasText: /^Send Message Now$/ }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByText('Welcome, Ryan test')).toBeVisible();
});





test('#014: Edit message, email only, and save.',{
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







test('#015: Send Message button from List Details page',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'Navigates to list named "test list 6". Clicks Send Message button to send recently edited email message.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Send Message button in List Details page does not work.'},
    { type: '', description: '● List used to test this is unexpectedly not available.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('link', { name: 'test list 6' }).click();

  await page.locator('div').filter({ hasText: 'Edit Message' }).nth(3).click();
  await expect(page.getByText('Message Types to SendNext')).toBeVisible();
  await expect(page.locator('#vertical-tabpanel-0').getByText('Email')).toBeVisible();
  await page.getByRole('tab', { name: 'Email' }).click();
  await page.getByLabel('Subject').click();
  await page.getByLabel('Subject').fill(`#015 ${jsonData.datetime}`);
  await page.getByRole('tab', { name: 'Proceed' }).click();
  await page.locator('div').filter({ hasText: /^Save Message$/ }).click();
  await expect(page.getByRole('cell', { name: 'contact, test' })).toBeVisible();

  await page.locator('div').filter({ hasText: 'Send Message' }).nth(3).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByText('Welcome, Ryan test')).toBeVisible();
});





test('#016: Send Message hover icon from My Lists page',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test Description', description: 'Navigates to My Lists page. Mouse hovers over list named "test list 7" and clicks send message hover icon. Confirms message sending.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Send message hover icon does not work.'},
    { type: '', description: '● List used to test this is unexpectedly not available.'},
    { type: '', description: '● '},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('test list 7');
  await page.getByLabel('Search').press('Enter');
  await page.locator('.listOfListsRow > td').first().hover();
  await page.getByRole('link', { name: 'Send' }).click();
  await expect(page.getByText('Do you wish to start sending')).toBeVisible();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByText('Welcome, Ryan test')).toBeVisible();
});





test('#017: Do not contact list/time feature from menu',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'Clicks the top left nav icon, and then selects Do Not Contact list/time. Adds email "brightarrowtest3@gmail.com". Then goes to My Lists and selects "test list 16". Then clicks Edit Message button, goes to the email tab and inserts the date and start time of the test run in the subject field. Goes to Proceed page and hits Send Message. A later test checks and makes sure the email was not received to the specified email.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Message is sent due to bug.'},
    { type: '', description: '● List this is tested with is unexpectedly not there.'},
  ],
}, async ({ page }) => {
  await page.getByTestId('MenuIcon').locator('path').click();
  await page.getByRole('button', { name: 'Do Not Contact list/time' }).click();
  await page.getByLabel('Phone Number or Email Address').click();
  await page.getByLabel('Phone Number or Email Address').fill('brightarrowtest3@gmail.com');
  await page.getByRole('button', { name: '<< Add' }).click();
  await page.getByTestId('FastRewindIcon').click();
  await expect(page.getByText('Welcome, Ryan test')).toBeVisible();

  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('link', { name: 'test list 16' }).click();
  await page.locator('div').filter({ hasText: 'Edit Message' }).nth(3).click();
  await page.getByRole('tab', { name: 'Email' }).click();
  await page.getByLabel('Subject').click();
  await page.getByLabel('Subject').fill(`#038 ${jsonData.datetime} SHOULD NOT BE RECEIVED`);
  await page.getByRole('tab', { name: 'Proceed' }).click();
  await page.locator('div').filter({ hasText: /^Send Message Now$/ }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByText('Welcome, Ryan test')).toBeVisible();

});





test('#018: Active BrightChats feature from main menu',{
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





test('#019: Start BrightChat button from List Details page',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Currently refactoring this test, is not currently being run.', description: ''},
  ],
}, async ({ page }) => {
  
});





test('#020: Interacting from Active BrightChats page on computer',{
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







test('#021: Access reports page from BA Central Reports button',{
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




test('#022: Access user settings',{
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



test('#023: Access My Lists from top left nav icon in BrightArrow Central',{
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
  await expect(page.getByRole('button', { name: 'ryan test' })).toBeVisible({timeout: 25000});
});



test('#024: Access Active BrightChats from top left nav icon in BrightArrow Central',{
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






test('#025: Access Reports from top left nav icon in BrightArrow Central',{
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






test('#026: Create a subset list',{
  tag: ['@Lists'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists page, then clicks Select Action and Create a subset list. Creates a subset of list named "subset list 1". Sets filter to building=0. New list created only has one contact. Expects list to be visible in My Lists page. Then clicks on newly created list to verify contacts are correctly set up.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Unexpected bug occurs within process of creating a subset list.'},
    { type: '', description: '● Extra slow network connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('button', { name: 'Select an Action' }).click();
  await page.getByRole('button', { name: 'Create a subset list' }).click();
  await page.getByLabel('New list name').click();
  await page.getByLabel('New list name').fill('subset list 1');
  await page.locator('#strSourceList').click();
  await page.getByRole('option', { name: 'test list 1 (3 entries)' }).click();
  await page.getByLabel('0').click();
  await page.getByRole('option', { name: '0' }).click();
  await page.getByRole('button', { name: 'Add >>' }).click();
  await expect(page.getByText('Building =')).toBeVisible();
  await page.getByRole('button', { name: 'OK' }).click();
  //await page.goto('https://target110.brightarrow.com/r/ViewLists');
  await expect(page.getByRole('link', { name: 'test list 1', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'subset list 1 (linked)' })).toBeVisible();
  await page.getByRole('link', { name: 'subset list 1 (linked)' }).click();
  await expect(page.getByRole('cell', { name: 'phone, ryan' })).toBeVisible();
});




test('#027: Create a superset list',{
  tag: ['@Lists'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists page, then clicks Select Action and Create a superset list. Creates a superset of list named "superset list 1". Uses two source lists, "test list 1" and "test list 2". New list created has 4 contacts. Expects list to be visible in My Lists page. Then clicks on newly created list to verify contacts are correctly set up.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Unexpected bug occurs within process of creating a subset list.'},
    { type: '', description: '● Extra slow network connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('button', { name: 'Select an Action' }).click();
  await page.getByRole('button', { name: 'Create a superset list' }).click();
  await page.getByLabel('New list name').click();
  await page.getByLabel('New list name').fill('superset list 1');
  await page.getByLabel('', { exact: true }).click();
  await page.getByText('test list 1 (3 entries)').click();
  await page.getByText('test list 2 (1 entries)').click();
  await page.locator('.MuiBackdrop-root').click();
  await page.getByRole('button', { name: 'OK' }).click();
  //await page.goto('https://target110.brightarrow.com/r/ViewLists');
  await expect(page.getByRole('link', { name: 'test list 1', exact: true })).toBeVisible({timeout: 30000});
  await expect(page.getByRole('link', { name: 'superset list 1 (superset' })).toBeVisible();
  await page.getByRole('link', { name: 'superset list 1 (superset' }).click();
  await expect(page.getByRole('cell', { name: 'phone, ryan' })).toBeVisible();
});




test('#028: Create Message feature from Select An Action dropdown in My Lists page',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists. Selects checkbox for list "test list 8" and then clicks Select An Action and Create a New Message. Creates a text message and then saves.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Create Message button does not work.'},
    { type: '', description: '● Some part of the create message process does not work as expected.'},
    { type: '', description: '● List this is tested with is unexpectedly not there.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.locator('#cb_list8409118').check();
  await page.getByRole('button', { name: 'Select an Action' }).click();
  await page.getByRole('button', { name: 'Create a new message' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.locator('#vertical-tabpanel-0').getByText('Email')).toBeVisible();
  await page.getByLabel('Email').check();
  await page.getByRole('tab', { name: 'Email' }).click();
  await page.getByLabel('From Name').click();
  await page.getByLabel('From Name').fill('test message ');
  await page.getByLabel('Subject').click();
  await page.getByLabel('Subject').fill('#028 create msg feature from menu');
  await page.getByRole('combobox', { name: '​' }).click();
  await page.getByRole('option', { name: '[[today]]' }).click();
  await page.getByRole('tab', { name: 'Proceed' }).click();
  await page.locator('div').filter({ hasText: /^Save Message$/ }).click();
  await expect(page.getByText('List Details')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'contact, test8' })).toBeVisible();
});





test('#029: Edit message hover icon in My Lists page',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists. Mouse hovers over list named "test list 9" and clicks Edit message icon. Edits email subject line and saves message.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Edit message hover icon does not work.'},
    { type: '', description: '● Some part of the edit message process does not work as expected.'},
    { type: '', description: '● List this is tested with is unexpectedly not there.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('test list 9');
  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListsFromFolder?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByLabel('Search').press('Enter')
  ]);
  await expect(page.getByRole('button', { name: 'test folder' })).toBeHidden();  
  await page.getByRole('link', { name: 'test list 9' }).hover();
  await page.getByRole('link', { name: 'Edit message' }).click();
  await expect(page.getByText('Message Types to SendNext')).toBeVisible();
  await expect(page.locator('#vertical-tabpanel-0').getByText('Email')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Subject').click();
  await page.getByLabel('Subject').fill('#029 hover icon test');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('div').filter({ hasText: /^Save Message$/ }).click();
  await expect(page.getByRole('cell', { name: 'contact, test9' })).toBeVisible({timeout: 30000});

});





test('#030: Edit prior message button within My Lists > Select an action button.',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists. Selects list named "test list 4", selects an action and clicks Edit prior message. Checks that all contents of the saved message are displaying correctly. Clicks Cancel at end of Edit Message process to exit out of feature.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Edit prior message button does not work.'},
    { type: '', description: '● Some part of the edit message process does not work as expected.'},
    { type: '', description: '● Message contents are not properly displayed.'},
    { type: '', description: '● List this is tested with is unexpectedly not there.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.locator('#cb_list8329402').check();
  await page.getByRole('button', { name: 'Select an Action' }).click();
  await page.getByRole('button', { name: 'Edit prior message' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText('from test list')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('div').filter({ hasText: /^Cancel$/ }).click();
  await expect(page.getByRole('cell', { name: 'contact, test' })).toBeVisible();
});



test('#031: Access List Settings from button in List Details page',{
  tag: ['@Lists'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists. Selects list named "test list 1". Clicks List Settings button. Confirms list settings is accessible and functioning from this button.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● List Settings button does not work.'},
    { type: '', description: '● List this is tested with is unexpectedly not there.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('link', { name: 'test list 1', exact: true }).click();
  await page.locator('div').filter({ hasText: 'List Settings' }).nth(3).click();
  await expect(page.getByText('List Settings')).toBeVisible();
});



test('#032: "Send saved message now" button within My Lists > Select An Action dropdown menu',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists. Selects checkbox of list "test list 10". Then clicks Select An Action and Send saved message now button.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Somewhere within the navigation to the Send saved message button does not work as expected.'},
    { type: '', description: '● List this is tested with is unexpectedly not there.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.locator('#cb_list8409786').check();
  await page.getByRole('button', { name: 'Select an Action' }).click();
  await page.getByRole('button', { name: 'Send saved message now' }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByText('Welcome, Ryan test')).toBeVisible();
});




test('#033: Apply contact filter and send saved message.',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists and selects list "test list 1". In List Details page, clicks the Advanced drop down, and selects Apply Contact Filter. Contact filter set as building=0. Creates new filter list with one contact. Automatically places you in message creation process. Selects Proceed tab and hits send message.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Apply contact filter feature does not work.'},
    { type: '', description: '● List this is tested with is unexpectedly not there.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('link', { name: 'test list 1', exact: true }).click();
  await page.getByLabel('', { exact: true }).click();
  await page.getByRole('option', { name: 'Apply Contact Filter' }).click();
  await page.locator('#strSelectedFieldName').click();
  await page.getByRole('option', { name: 'Building' }).click();
  await page.locator('#strSelectedComparator').click();
  await page.getByRole('option', { name: 'Is equal to' }).click();
  await page.getByRole('combobox', { name: '​', exact: true }).click();
  await page.getByRole('option', { name: '0' }).click();
  await page.getByRole('button', { name: 'Add >>' }).click();
  await expect(page.getByText('Building =')).toBeVisible();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await page.getByRole('tab', { name: 'Proceed' }).click();
  await page.locator('div').filter({ hasText: /^Send Message Now$/ }).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByText('Welcome, Ryan test')).toBeVisible();
});



test('#034: Preview Message button within message editing/creating process.',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists and selects list "test list 11". In List Details page, clicks the Edit Message button, then the Proceed tab. Selects Preview Message button, and sends preview message to brightarrowtest1@gmail.com. There is a later test check to confirm that email was correctly received.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Preview Message feature does not work.'},
    { type: '', description: '● List this is tested with is unexpectedly not there.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('link', { name: 'test list 11' }).click();
  await page.locator('div').filter({ hasText: 'Edit Message' }).nth(3).click();
  await expect(page.getByText('Message Types to SendNext')).toBeVisible();
  await expect(page.locator('#vertical-tabpanel-0').getByText('Email')).toBeVisible();
  await page.getByRole('tab', { name: 'Proceed' }).click();
  await expect(page.getByText('Schedule Message')).toBeVisible();
  await page.locator('div').filter({ hasText: /^Preview Message$/ }).click();
  await page.getByLabel('Email Address').click();
  await page.getByLabel('Email Address').fill('brightarrowtest1@gmail.com');
  await page.getByRole('button', { name: 'Preview' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.locator('div').filter({ hasText: /^Cancel$/ }).click();
  await expect(page.getByText('List Details')).toBeVisible();
});





test('#035: Send message with apostrophes in the from name and subject fields',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists and selects list "test list 13". Hits Send Message to test if email message with apostrophes goes out properly. Another test later checks if it was properly received.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Message is not able to be sent due to bug.'},
    { type: '', description: '● List this is tested with is unexpectedly not there.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('link', { name: 'test list 13' }).click();
  await page.locator('div').filter({ hasText: 'Send Message' }).nth(3).click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await expect(page.getByText('Welcome, Ryan test')).toBeVisible();
});






test('#036: Stop message icon from hovering over a list',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists and hovers over list "test list 14". Clicks the Cancel scheduled message hover icon to stop message from going out.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Message is sent due to bug.'},
    { type: '', description: '● List this is tested with is unexpectedly not there.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('test list 14');
  //await page.getByLabel('Search').press('Enter');
  const [request2] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListsFromFolder?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByLabel('Search').press('Enter')
  ]);
  await expect(page.getByRole('button', { name: 'test folder' })).toBeHidden();  
  
  await page.getByRole('link', { name: 'test list 14' }).hover();
  await page.getByRole('link', { name: 'Cancel scheduled message' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByText('Welcome, Ryan test')).toBeVisible();
});





test('#037: Stop sending/pending message from menu',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists and selects checkbox of list "test list 15". Then accesses menu from Select An Action button and selects Stop sending/pending message now button.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Message is sent due to bug.'},
    { type: '', description: '● List this is tested with is unexpectedly not there.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.locator('#cb_list8411095').check();
  await page.getByRole('button', { name: 'Select an Action' }).click();
  await page.getByRole('button', { name: 'Stop sending/pending message' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByText('Welcome, Ryan test')).toBeVisible();
});





test('#038: Start BrightChat button from List Details page',{
  tag: ['@Messages'],
  annotation: [
    { type: 'Test description', description: 'Goes to My Lists page, selects list "test list 15", and then clicks Start BrightChat button. Inputs "topic test" into topic field, and "test #038 [insert of test start run time and date]" in the description field.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Start BrightChat button does not work.'},
    { type: '', description: '● List this is tested with is unexpectedly not there.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('link', { name: 'test list 15' }).click();
  await page.locator('div').filter({ hasText: /^Start BrightChat$/ }).nth(1).click();
  await page.getByLabel('Topic').click();
  await page.getByLabel('Topic').fill('topic test');
  await page.getByLabel('Type initial message here...').click();
  await page.getByLabel('Type initial message here...').fill(`test #038 ${jsonData.datetime}`);
  await page.getByRole('button', { name: 'Send' }).click();
  await page.getByRole('button', { name: 'Active Brightchats' }).click();
  //await expect(page.getByRole('link', { name: '[1] topic test (ryan test)' })).toBeVisible();
  await expect(page.getByText('Active BrightChats')).toBeVisible();
});





test('#039: BrightArrow Central feature from menu',{
  tag: ['@General'],
  annotation: [
    { type: 'Test description', description: 'Goes to My Lists page, clicks the nav icon in the top left and then selects BrightArrow Central button in the menu. The BrightArrow Central button is already used in several of the tests in this test suite so if it stops working, other tests will fail because of it. This test serves as an isolated instance that can help identify if this single button stops working.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● BrightArrow Central button stops working'},
    { type: '', description: '● Extra slow network connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByTestId('MenuIcon').click();
  await page.getByRole('button', { name: 'BrightArrow Central' }).click();
  await expect(page.getByText('Welcome, Ryan test')).toBeVisible();
});






test('#040: Home icon at top of page',{
  tag: ['@General'],
  annotation: [
    { type: 'Test description', description: 'Goes to My Lists page, and then clicks on home icon in the top right corner to go back to BrightArrow Central homepage. Ensures that home button works as expected.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Home icon stops working'},
    { type: '', description: '● Extra slow network connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByTestId('MenuIcon').click();
  await page.getByRole('button', { name: 'BrightArrow Central' }).click();
  await expect(page.getByText('Welcome, Ryan test')).toBeVisible();
});






test('#041: Preview button from reports',{
  tag: ['@General'],
  annotation: [
    { type: 'Test description', description: 'Clicks on the Reports button from BrightArrow Central, selects a report for "test list 17". Then clicks the preview button, and sends a preview to email "brightarrowtest1@gmail.com". Another test later in the suite confirms the delivery of this preview.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Preview button stops working'},
    { type: '', description: '● Extra slow network connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^Reports$/ }).click();
  await page.getByRole('button', { name: '/02/24 04:47AM: test list 17' }).click();
  //await page.getByRole('button', { name: 'View Full Message' }).click();
  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/message/LoadMessage?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('button', { name: 'View Full Message' }).click()
  ]);
  await page.getByRole('button', { name: 'Preview' }).click();
  await page.getByLabel('Email Address').click();
  await page.getByLabel('Email Address').fill('brightarrowtest1@gmail.com');
  await page.getByRole('button', { name: 'Preview' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByTestId('FastRewindIcon').click();
  await expect(page.getByText('Welcome, Ryan test')).toBeVisible();
});





test('#042: Preview button from load prior message',{
  tag: ['@General'],
  annotation: [
    { type: 'Test description', description: 'Goes to My Lists and selects list "test list 18". Clicks Edit Message button, and goes to Load Prior Messages tab. Selects prior message and sends preview to email "brightarrowtest1@gmail.com". '},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Preview button stops working'},
    { type: '', description: '● Extra slow network connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('link', { name: 'test list 18' }).click();
  await page.locator('div').filter({ hasText: 'Edit Message' }).nth(3).click();
  await page.getByRole('tab', { name: 'Load Prior Message' }).click();
  await page.getByRole('row', { name: 'BrightChat: topic test (ryan' }).getByRole('button').first().click();
  await page.getByRole('button', { name: 'Preview' }).click();
  await page.locator('#emailPreviewButton').click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('div').filter({ hasText: /^Cancel$/ }).click();
  await expect(page.getByRole('cell', { name: 'contact, test18' })).toBeVisible();
});





test('#043: Disable all contacts in a list using upper checkbox, then refresh using dropdown box',{
  tag: ['@General'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists, selects list, and then uses the 2nd from the top checkbox to select all icons. Then clicks refresh from dropdown box.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Checkbox for selecting all contacts not working as expected.'},
    { type: '', description: '● Extra slow network connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
});







test('#044: Edit message for a list with a pending message ',{
  tag: ['@General'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists, selects list, and then uses the 2nd from the top checkbox to select all icons. Then clicks refresh from dropdown box.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Checkbox for selecting all contacts not working as expected.'},
    { type: '', description: '● Extra slow network connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
});





test('#045: Create message for a list with a pending message ',{
  tag: ['@General'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists, selects list, and then uses the 2nd from the top checkbox to select all icons. Then clicks refresh from dropdown box.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Checkbox for selecting all contacts not working as expected.'},
    { type: '', description: '● Extra slow network connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
});






test('#046: Search bar from reports page (reports search) ',{
  tag: ['@General'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists, selects list, and then uses the 2nd from the top checkbox to select all icons. Then clicks refresh from dropdown box.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Checkbox for selecting all contacts not working as expected.'},
    { type: '', description: '● Extra slow network connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
});





test('#047: Most recent/view all feature on my lists page (most recent folders) ',{
  tag: ['@General'],
  annotation: [
    { type: 'Test description', description: 'Navigates to My Lists, selects list, and then uses the 2nd from the top checkbox to select all icons. Then clicks refresh from dropdown box.'},
    { type: 'Potential Sources of Failure:', description: ''},
    { type: '', description: '● Checkbox for selecting all contacts not working as expected.'},
    { type: '', description: '● Extra slow network connectivity to server or APIs.'},
  ],
}, async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
});





