import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { json } from 'stream/consumers';


const email = process.env.EMAIL;
const email_pass = process.env.EMAIL_PASS;
const phone = process.env.PHONE_NUMBER;
const parent_pass = process.env.PARENT_PASS;



const jsonData = require('D:/a/BA-regressions-T6/BA-regressions-T6/datetime.json');


/*
test("setup checks", async ({ page }) => {
  test.slow();


});
*/

test('message check in firefox', async ({ page }) => {
  //const browser = await firefox.launch();
  //const page = await browser.newPage();
  //const msgString2 = 'test message at 2024-4-23_16-10';


  /*
  await page.goto('https://voice.google.com/about');
  await page.locator('#getVoiceToggle').getByRole('button', { name: 'For personal use' }).click();
  await page.getByRole('button', { name: 'Web' }).click();
  await page.getByLabel('Email or phone').fill(`${email}`);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('Enter your password').fill(`${email_pass}`);
  await page.getByLabel('Enter your password').press('Enter');
  //await page.getByRole('button', { name: 'Next' }).click();
  
  // await page.getByRole('link', { name: 'Confirm your recovery phone'}).click();
  // await page.getByLabel('Phone Number').click();
  // await page.getByLabel('Phone Number').fill(' ');
  // await page.getByRole('button', {name: 'Next'}).click();
  //await page.goto('https://voice.google.com/u/0/calls');
  
  await page.getByRole('tab', { name: 'Messages' }).click();
  //await page.getByLabel('Message by 79041: test').click();
  //await expect(page.getByLabel('Unread. Message by ‪79041‬:')).toBeVisible();
  await page.getByLabel('Unread. Message by ‪79041‬:').click();
  await expect(page.getByRole('list').getByText(`${jsonData.datetime}`, { exact: true })).toBeVisible();
  



  
  await page.goto('https://www.google.com/gmail/about/');
  await page.getByRole('link', { name: 'Sign in' }).click();
  
  // await page.getByLabel('Email or phone').fill(`${email}`);
  // await page.getByLabel('Email or phone').press('Enter');
  // await page.getByLabel('Enter your password').fill(`${email_pass}`);
  // await page.getByLabel('Enter your password').press('Enter');
  // await page.getByRole('link', { name: `auto: ${jsonData.datetime} - Sent` }).click();
  
  await page.getByRole('link', { name: 'BrightArrow1 brightarrowtest1' }).click();
  await expect(page.getByRole('link', { name: `${jsonData.datetime}` }).first()).toBeVisible();
  await page.getByRole('link', { name: `${jsonData.datetime}` }).first().click();
  //await expect(page.getByText('test contact2', { exact: true })).toBeVisible();
  */

  /*
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
  */
});
