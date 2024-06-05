import { test, expect } from '@playwright/test';
const username = process.env.ACCT_LOGIN;
const password = process.env.ACCT_PASSWORD;

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






test.describe('#001', () => {
  test.describe.configure({ mode: 'serial' });

  test('#001: Make list from Create List button', async ({ page }) => {
    await page.locator('div').filter({ hasText: /^Create List$/ }).click();
    await page.getByLabel('List Name').fill('auto list 1');
    const [request] = await Promise.all([
      page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListInfo?accessToken=3F71C6E3-2CF6-41F8-975B-59A373DC03F5&listID=") && response.status() === 200, {timeout: 60000}),
      page.getByRole('button', { name: 'Add' }).click()
    ]);
    await expect(page.getByText('List Details')).toBeVisible();
    await expect(page.locator('#listName-label')).toBeVisible();
    await expect(page).toHaveScreenshot("001-createList-listDetailsNew.png", { fullPage: true });
  });

  test('verify#001 -make list from Create List button', async ({ page }) => {
    await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
    await page.getByRole('button', { name: 'ryan test' }).click();
    await expect(page.getByRole('link', { name: 'auto list 1', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'test list', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'test list 2', exact: true })).toBeVisible();
    await expect(page).toHaveScreenshot("001-my-lists_names-masked.png", {
      fullPage: true,
      mask: [page.locator('.listOfListsRow > td')],
    });
  });
});





/*
test('#001: Make list from Create List button', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^Create List$/ }).click();
  await page.getByLabel('List Name').fill('auto list 1');
  //await page.getByRole('button', { name: 'Add' }).click();

  const [request] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListInfo?accessToken=3F71C6E3-2CF6-41F8-975B-59A373DC03F5&listID=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('button', { name: 'Add' }).click()
  ]);

  await expect(page.getByText('List Details')).toBeVisible();
  await expect(page.locator('#listName-label')).toBeVisible();

  await expect(page).toHaveScreenshot("001-createList-listDetailsNew.png", { fullPage: true });

});

test('verify#001 -make list from Create List button', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();

  await expect(page.getByRole('link', { name: 'auto list 1', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'test list', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'test list 2', exact: true })).toBeVisible();

  await expect(page).toHaveScreenshot("001-my-lists_names-masked.png", {
    fullPage: true,
    mask: [page.locator('.listOfListsRow > td')],
  });
});
*/




test('#002: Create list from my lists page, auto list 2', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('button', { name: 'Select an Action' }).click();
  await page.getByRole('button', { name: 'Create a list' }).click();
  await page.getByLabel('List Name').fill('auto list 2');
  page.getByRole('button', { name: 'Add' }).click();

  //await page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListType?accessToken=3F71C6E3-2CF6-41F8-975B-59A373DC03F5&listID") && response.status() === 200, {timeout: 60000})
  await expect(page.locator('#listName-label')).toBeVisible();
  
  //await expect(page).toHaveScreenshot("auto-list-2-initialpage.png", { fullPage: true });

});

test('verify#002 -create list from my lists page, auto list 2', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 2');
  await page.getByLabel('Search').press('Enter');
  await expect(page.getByRole('link', { name: 'auto list' })).toBeVisible();
});





test('#003: create a folder', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('button', { name: 'Select an Action' }).click();
  await page.getByRole('button', { name: 'Create a folder' }).click();
  await page.getByLabel('Folder Name').fill('auto folder');
  await page.getByRole('button', { name: 'Add' }).click();
});
//add screenshot checks later
test('verify#003 -create a folder', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await expect(page.getByRole('button', { name: 'auto folder' })).toBeVisible();
  await page.getByRole('button', { name: 'auto folder' }).click();
  await expect(page.getByText('auto folder Lists (0)')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Refresh Lists' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Edit Folder Name' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Delete Folder' })).toBeVisible();
  await page.getByRole('button', { name: 'ryan test' }).click();
});





test('#004: create list in new folder', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('button', { name: 'auto folder' }).click();
  await page.getByRole('button', { name: 'Select an Action' }).click();
  await page.getByRole('button', { name: 'Create a list' }).click();
  await page.getByLabel('List Name').fill('auto list import');
  await page.getByRole('button', { name: 'Add' }).click();
});

test('verify#004 -create list in new folder', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByRole('button', { name: 'auto folder' }).click();
  await page.getByRole('link', { name: 'auto list import' }).click();
});





test('#005: import csv to new list', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'auto folder' }).click();
  await page.getByRole('link', { name: 'auto list import' }).click();
  await page.locator('div').filter({ hasText: 'Import/Export' }).nth(3).click();
  await page.getByText('CHOOSE FILE').click();
  await page.locator('body').setInputFiles('BrightArrow Fake Constituents List 1 - Sheet1.csv');
  await page.getByRole('button', { name: 'Import File' }).click();
  await page.getByRole('cell', { name: '3 Not Used' }).getByLabel('Not Used').click();
  await page.getByRole('option', { name: 'Contact ID' }).click();
  await page.getByRole('cell', { name: '6 Not Used' }).getByLabel('Not Used').click();
  await page.getByRole('option', { name: 'Building ( [[Field1]] )' }).click();
  await page.getByRole('cell', { name: '7 Not Used' }).getByLabel('Not Used').click();
  await page.getByRole('option', { name: 'Grade ( [[Field2]] )' }).click();
  await page.getByRole('cell', { name: '8 Not Used' }).getByLabel('Not Used').click();
  await page.getByRole('option', { name: 'Language ( [[Field3]] )' }).click();
  await page.getByRole('cell', { name: '9 Not Used' }).getByLabel('Not Used').click();
  await page.getByRole('option', { name: 'Bus Route ( [[Field4]] )' }).click();
  await page.getByRole('cell', { name: '10 Not Used' }).getByLabel('Not Used').click();
  await page.getByRole('option', { name: 'Field 5 ( [[Field5]] )' }).click();
  await page.getByRole('cell', { name: '11 Not Used' }).getByLabel('Not Used').click();
  await page.getByRole('option', { name: 'Field 6 ( [[Field6]] )' }).click();
  await page.getByLabel('Not Used').click();
  await page.getByRole('option', { name: 'Field 7 ( [[Field7]] )' }).click();
  await page.getByRole('button', { name: 'Accept and Proceed' }).click();
  await page.goto('https://target110.brightarrow.com/r/ViewOneList');
  await expect(page.getByRole('cell', { name: 'Andrade, Lilly' })).toBeVisible();
});

test('verify#005 -import csv to new list', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'auto folder' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list import');
  await page.getByLabel('Search').press('Enter');
  await expect(page.getByText('auto folder Lists (1)')).toBeVisible();
  await expect(page.getByText('150')).toBeVisible();
  await page.getByRole('link', { name: 'auto list import' }).click();
  await expect(page.getByRole('cell', { name: 'Andrade, Lilly' })).toBeVisible();
});





//adds contact by going to my lists page, and clicking on list name, then selecting Add Contact button
test('#006: add contact to list, auto list 1', async ({ page }) => {
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
  await page.getByRole('button', { name: 'Apply' }).click();

});

/*
* verifies contact has been added to list, ui changes have been made (ex: contacts column changes from 0 to 1), 
* and uses visual comparison to confirm all info has been saved into contact details
*/
test('verify#006 -add contact to list, auto list 1', async ({ page }) => {
  //await page.frameLocator('iframe[title="Help Scout Beacon - Messages and Notifications"]').getByRole('button', { name: 'Close' }).click();
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 1');
  await page.getByLabel('Search').press('Enter');
  await expect(page.getByRole('cell', { name: '1', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'auto list' }).click();
  await expect(page.getByRole('cell', { name: 'Contact1, Auto' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'email@email.com' })).toBeVisible();
  await page.getByRole('cell', { name: 'Contact1, Auto' }).click();

  await expect(page.locator('#firstName-label')).toBeVisible();
  await expect(page.locator('#phone1-label')).toBeVisible();
  await expect(page.locator('#email1-label')).toBeVisible();
  await expect(page.locator('#CustomField1-label')).toBeVisible();

  await expect(page).toHaveScreenshot("auto-contact1-details.png", { fullPage: true });

});





//adds another contact by accessing list through pen icon
test('#007: edit list from pen icon, auto list 1', async ({ page }) => {
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
  await page.getByRole('button', { name: 'Apply' }).click();

});

test('verify#007 -edit list from pen icon, auto list 1', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 1');
  await page.getByLabel('Search').press('Enter');
  await expect(page.getByRole('cell', { name: '2', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'auto list' }).click();
  await expect(page.getByRole('cell', { name: 'Contact2, Auto' })).toBeVisible();
  await page.getByRole('cell', { name: 'Contact2, Auto' }).click();
  await expect(page.locator('#firstName-label')).toBeVisible();
  await expect(page.locator('#phone1-label')).toBeVisible();
  await expect(page.locator('#email1-label')).toBeVisible();
  await expect(page.locator('#CustomField1-label')).toBeVisible();

  await expect(page).toHaveScreenshot("auto-contact2-details.png", { fullPage: true });

});





//accesses list settings from gear icon, and makes changes on each page
test('#008: click on gear icon, auto list 1', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByLabel('Search').fill('auto list 1');
  await page.getByLabel('Search').press('Enter');
  await page.getByRole('link', { name: 'auto list 1' }).hover();
  await page.getByRole('link', { name: 'List Settings' }).click();

  await page.getByLabel('Disable deleting current').check();
  await page.getByRole('tab', { name: 'Phone Call Settings' }).click();
  await page.getByLabel('Number of retries upon busy').click();
  await page.getByLabel('Number of retries upon busy').fill('1');
  await page.getByLabel('Call specific numbers').check();
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

test('verify#008 -click on gear icon, auto list 1', async ({ page }) => {
  test.slow();
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 1');
  await page.getByLabel('Search').press('Enter');
  await page.getByRole('link', { name: 'auto list' }).click();
  await page.locator('div').filter({ hasText: 'List Settings' }).nth(3).click();
  await expect(page.getByText('Disable deleting this list')).toBeVisible();
  await expect(page.getByText('Users with access to')).toBeVisible();
  await expect(page.getByText('ryan test')).toBeVisible();

  await expect(page).toHaveScreenshot("auto-list1-settings-listmanagement.png", { fullPage: true });

  await page.getByRole('tab', { name: 'Phone Call Settings' }).click();
  await expect(page.locator('#strCallerID-label')).toBeVisible();
  await expect(page.getByText('Phones to call for each')).toBeVisible();
  await expect(page).toHaveScreenshot("auto-list1-settings-phonecallsettings.png", { fullPage: true });

  await page.getByRole('tab', { name: 'Text Settings' }).click();
  await expect(page.getByText('Phones to text for each')).toBeVisible();
  await expect(page).toHaveScreenshot("auto-list1-settings-textsettings.png", { fullPage: true });

  await page.getByRole('tab', { name: 'Email Settings' }).click();
  await expect(page.locator('#strEmailSubject-label')).toBeVisible();
  await expect(page.getByText('Message Sent Reports', { exact: true })).toBeVisible();
  await expect(page.getByText('Report Emailing')).toBeVisible();
  await expect(page).toHaveScreenshot("auto-list1-settings-emailsettings.png", { fullPage: true });

  await page.getByRole('tab', { name: 'Portal Settings' }).click();
  await expect(page.getByText('Portal for recipients to')).toBeVisible();
  await expect(page).toHaveScreenshot("auto-list1-settings-portalsettings.png", { fullPage: true });

  await page.getByRole('tab', { name: 'CC Settings' }).click();
  await expect(page.getByText('Phones and emails to receive')).toBeVisible();
  await expect(page).toHaveScreenshot("auto-list1-settings-CCsettings.png", { fullPage: true });
});





test('#009: add list to favorites with heart icon, auto list 1', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 1');
  await page.getByLabel('Search').press('Enter');
  await page.getByRole('link', { name: 'auto list 1' }).hover();
  await page.getByRole('link', { name: 'Add to favorite' }).click();
  await expect(page.getByLabel('My Favorites')).toBeVisible();
  await expect(page.getByLabel('Favorite Folder').getByText('auto list')).toBeVisible();
  await page.getByRole('button', { name: 'OK' }).click();

});

test('verify#009 -add list to favorites with heart icon, auto list 1', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'My Favorites' }).click();
  await expect(page.getByText('My Favorites Lists (1)')).toBeVisible();
  await expect(page.getByRole('link', { name: 'auto list' })).toBeVisible();
  await page.getByRole('button', { name: 'ryan test' }).click();
});





test('#010: changing contact email from pen icon in list details page', async ({ page }) => {
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
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.locator('tbody')).toContainText('5555555555, newemail@email.com');

});

test('verify#010 -changing contact email from pen icon in list details page', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 1');
  await page.getByLabel('Search').press('Enter');
  await page.getByRole('link', { name: 'auto list' }).click();
  await expect(page.getByRole('cell', { name: 'newemail@email.com' })).toBeVisible();
  await page.getByRole('cell', { name: 'Contact1, Auto' }).click();

  await expect(page.locator('div').filter({ hasText: /^Email 1Email 1Email 2Email 2$/ })).toHaveScreenshot(
    "only-email-field.png");

});





test('#011: disabling a contact', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 1');
  await page.getByLabel('Search').press('Enter');
  await page.getByRole('link', { name: 'auto list' }).click();
  await page.locator('#cb_list1958591530').uncheck();
});

test('verify#011 -disabling a contact', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 1');
  await page.getByLabel('Search').press('Enter');
  await expect(page.getByRole('cell', { name: '1/' })).toBeVisible();
  await page.getByRole('link', { name: 'auto list' }).click();
  await expect(page.getByRole('cell', { name: 'Contact1, Auto' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Contact2, Auto' })).toBeVisible();

  await expect(page.locator('#listsBox')).toHaveScreenshot(
    "one-disabled-contact.png");

});





test('#012: testing hide disabled contacts, auto list 1', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 1');
  await page.getByLabel('Search').press('Enter');
  await page.getByRole('link', { name: 'auto list' }).click();
  await expect(page.getByRole('cell', { name: 'Contact2, Auto' })).toBeVisible();
  await page.locator('#hideDisabledButton').check();
  await expect(page.getByRole('cell', { name: 'Contact1, Auto' })).toBeVisible();

  await expect(page.locator('#listsBox')).toHaveScreenshot(
    "hide-disabled-contact-verify.png");

});

test('verify#012 -testing hide disabled contacts, auto list 1', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 1');
  await page.getByLabel('Search').press('Enter');
  await page.getByRole('link', { name: 'auto list' }).click();
  await expect(page.getByRole('cell', { name: 'Contact1, Auto' })).toBeVisible();

  await expect(page.locator('#listsBox')).toHaveScreenshot(
    "hide-disabled-contact-verify.png");
});





test('#013: Delete folder, auto folder', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'auto folder' }).click();
  await page.getByRole('link', { name: 'Delete Folder' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByRole('button', { name: 'ryan test' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'auto list import' })).toBeVisible();
});
//potentially add more assertions to verify folder does not exist
test('verify#013 -Delete folder, auto folder', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await expect(page.getByRole('button', { name: 'auto folder' })).toBeHidden();
});





test('#014: delete list, auto list 1', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 1');
  await page.getByLabel('Search').press('Enter');
  await page.locator('input[name="cb_lists2039717"]').check();
  await page.getByRole('button', { name: 'Select an Action' }).click();
  await page.getByRole('button', { name: 'Delete a list' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
});

test('verify#014 -delete list, auto list 1', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 1');
  await page.getByLabel('Search').press('Enter');
  await expect(page.getByText('ryan test Lists (0)')).toBeVisible();
});





test('#015: delete list, auto list 2', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 2');
  await page.locator('#searchBarBtn').click();
  await page.locator('input[name="cb_lists2039717"]').check();
  await page.getByRole('button', { name: 'Select an Action' }).click();
  await page.getByRole('button', { name: 'Delete a list' }).click();
  await page.getByRole('button', { name: 'OK' }).click();

});

test('verify#015 -delete list, auto list 2', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list 2');
  await page.getByLabel('Search').press('Enter');
  await expect(page.getByText('ryan test Lists (0)')).toBeVisible();
});





//deletes final(?) list made. this list should end up in the main user 'ryan test' folder. 
//add some screenshot verification later to further ensure functionality
test('#016: delete list 3, auto list import', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list import');
  await page.getByLabel('Search').press('Enter');
  await page.locator('input[name="cb_lists2039717"]').check();
  await page.getByRole('button', { name: 'Select an Action' }).click();
  await page.getByRole('button', { name: 'Delete a list' }).click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.locator('#searchBarBtn').click();
});

test('verify#016 -delete list 3, auto list import', async ({ page }) => {
  await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
  await page.getByRole('button', { name: 'ryan test' }).click();
  await page.getByLabel('Search').click();
  await page.getByLabel('Search').fill('auto list import');
  await page.getByLabel('Search').press('Enter');
  await expect(page.getByText('ryan test Lists (0)')).toBeVisible();
});
