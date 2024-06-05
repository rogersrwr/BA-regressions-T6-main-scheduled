import { test, expect } from '@playwright/test';


//test.step
test('test', async ({ page }) => {
  await test.step('Log in', async () => {
    // ...
  });

  await test.step('Outer step', async () => {
    // ...
    // You can nest steps inside each other.
    await test.step('Inner step', async () => {
      // ...
    });
  });
});




//test.describe
//You can declare a group of tests with a title. The title will be visible in the test report as a part of each test's title.
test.describe('two tests', () => {
  test('one', async ({ page }) => {
    // ...
  });

  test('two', async ({ page }) => {
    // ...
  });
});




//test.describe serial mode
// https://stackoverflow.com/questions/73338339/playwright-framework-is-there-a-way-we-can-execute-dependent-tests-in-playwrig
// https://github.com/microsoft/playwright/issues/17266
test.describe.serial("Running test sequentially", ()=>{

  test.beforeAll(async ({ page }) => {

  });

  test("Test block 1 : ", async()=>{
      //enter code here
  });

  test("Test block 2 : ", async()=>{
      //enter code here
  });

});



//test.extend
//https://playwright.dev/docs/api/class-test#test-extend



//parallelism
// https://playwright.dev/docs/test-parallel#parallelize-tests-in-a-single-file





// Run multiple describes in parallel, but tests inside each describe in order.
test.describe.configure({ mode: 'parallel' });

test.describe('A, runs in parallel with B', () => {
  test.describe.configure({ mode: 'default' });
  test('in order A1', async ({ page }) => {});
  test('in order A2', async ({ page }) => {});
});

test.describe('B, runs in parallel with A', () => {
  test.describe.configure({ mode: 'default' });
  test('in order B1', async ({ page }) => {});
  test('in order B2', async ({ page }) => {});
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
    await expect(page.getByRole('link', { name: 'test list 1', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'test list 2', exact: true })).toBeVisible();
    await expect(page).toHaveScreenshot("001-myLists-check.png", {
      fullPage: true,
      mask: [page.locator('.listOfListsRow > td.listsTableColumns.advanced')],
    });

  });
});

