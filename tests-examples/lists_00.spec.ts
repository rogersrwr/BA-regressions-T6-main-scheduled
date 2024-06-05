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


test('#001: Make list from Create List button', async ({ page }) => {
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
  await expect(page.getByRole('link', { name: 'test list 1', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'test list 2', exact: true })).toBeVisible();
  //Failure here means screenshot comparison of My Lists page failed.
  await expect(page).toHaveScreenshot("001-myLists-check-chromium-win32.png", {
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
  await expect(page).toHaveScreenshot("001-homePage-asExpected-check-chromium-win32.png", { fullPage: true, maxDiffPixels: 100, mask: [page.getByRole('img')], });

});




test.describe('#002', () => {
  test.describe.configure({ mode: 'serial' });
  test('#002: Create list from my lists page, auto list 2', async ({ page }) => {
    await page.locator('div').filter({ hasText: /^My Lists$/ }).click();
    await page.getByRole('button', { name: 'Select an Action' }).click();
    await page.getByRole('button', { name: 'Create a list' }).click();
    await page.getByLabel('List Name').fill('auto list 2');
    const [request] = await Promise.all([
      page.waitForResponse(response => response.url().includes("TargetAPI/api/dialList/GetListInfo?accessToken=") && response.status() === 200, {timeout: 60000}),
      page.getByRole('button', { name: 'Add' }).click()
    ]);
    await expect(page.getByText('List Details')).toBeVisible();
    await expect(page).toHaveScreenshot("002-auto-list-2-initialpage-chromium-win32.png", { fullPage: true });

    await page.getByTestId('FastRewindIcon').click();
    await expect(page.getByRole('link', { name: 'auto list 2' })).toBeVisible();

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
  
  
});




test('#003: create a folder', async ({ page }) => {
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




test('#004: create list in new folder', async ({ page }) => {
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
  await expect(page.getByRole('link', { name: 'auto list 3' })).toBeVisible();
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



test('#005: add contact to list, auto list 1', async ({ page }) => {
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
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialListContact/LoadContacts?accessToken=3F71C6E3-2CF6-41F8-975B-59A373DC03F5&listID=") && response.status() === 200, {timeout: 60000}),
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
  const [request3] = await Promise.all([
    page.waitForResponse(response => response.url().includes("TargetAPI/api/dialListContact/GetContact?accessToken=") && response.status() === 200, {timeout: 60000}),
    page.getByRole('cell', { name: 'Contact1, Auto' }).click()
  ]);
  await expect(page).toHaveScreenshot("005-auto-contact1-details-chromium-win32.png", { fullPage: true, maxDiffPixels: 15 });
});



test('#006: Access list from pen icon to make another contact, auto list 1', async ({ page }) => {
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

  await expect(page).toHaveScreenshot("006-myLists-add2ndContact-check-chromium-win32.png", { fullPage: true, mask: [page.locator('.listOfListsRow > td.listsTableColumns.advanced')], });
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




test('#007: click on gear icon, auto list 1', async ({ page }) => {
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



test('verify#007 -click on gear icon, auto list 1', async ({ page }) => {
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

  await expect(page).toHaveScreenshot("007-auto-list1-settings-listmanagement-chromium-win32.png", { fullPage: true, mask: [page.locator('#root div').filter({ hasText: 'List ManagementPhone Call' }).nth(3)], });

  await page.getByRole('tab', { name: 'Phone Call Settings' }).click();
  await expect(page.locator('#strCallerID-label')).toBeVisible();
  await expect(page.getByText('Phones to call for each')).toBeVisible();
  await expect(page).toHaveScreenshot("007-auto-list1-settings-phonecallsettings-chromium-win32.png", { fullPage: true, mask: [page.locator('#root div').filter({ hasText: 'List ManagementPhone Call' }).nth(3)], });

  await page.getByRole('tab', { name: 'Text Settings' }).click();
  await expect(page.getByText('Phones to text for each')).toBeVisible();
  await expect(page).toHaveScreenshot("007-auto-list1-settings-textsettings-chromium-win32.png", { fullPage: true, mask: [page.locator('#root div').filter({ hasText: 'List ManagementPhone Call' }).nth(3)], });

  await page.getByRole('tab', { name: 'Email Settings' }).click();
  await expect(page.locator('#strEmailSubject-label')).toBeVisible();
  await expect(page.getByText('Message Sent Reports', { exact: true })).toBeVisible();
  await expect(page.getByText('Report Emailing')).toBeVisible();
  await expect(page).toHaveScreenshot("007-auto-list1-settings-emailsettings-chromium-win32.png", { fullPage: true, mask: [page.locator('#root div').filter({ hasText: 'List ManagementPhone Call' }).nth(3)], });

  await page.getByRole('tab', { name: 'Portal Settings' }).click();
  await expect(page.getByText('Portal for recipients to')).toBeVisible();
  await expect(page).toHaveScreenshot("007-auto-list1-settings-portalsettings-chromium-win32.png", { fullPage: true, mask: [page.locator('#root div').filter({ hasText: 'List ManagementPhone Call' }).nth(3)], });

  await page.getByRole('tab', { name: 'CC Settings' }).click();
  await expect(page.getByText('Phones and emails to receive')).toBeVisible();
  await expect(page).toHaveScreenshot("007-auto-list1-settings-CCsettings-chromium-win32.png", { fullPage: true, mask: [page.locator('#root div').filter({ hasText: 'List ManagementPhone Call' }).nth(3)], });
});




test('#008: add list to favorites with heart icon, auto list 1', async ({ page }) => {
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





test('#009: changing contact email from pen icon in list details page', async ({ page }) => {
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
  await expect(page).toHaveScreenshot("009-listDetailsEdit-check-chromium-win32.png", { fullPage: true });
});


