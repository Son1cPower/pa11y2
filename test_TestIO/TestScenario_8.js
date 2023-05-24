// An example of executing some actions before Pa11y runs.
// This example logs in to a fictional site then waits
// until the account page has loaded before running Pa11y

require('dotenv').config().parsed;
const pa11y = require('pa11y');
const htmlReporter = require('pa11y/lib/reporters/html');
const csvReporter = require('pa11y/lib/reporters/csv');
const jsonReporter = require('pa11y/lib/reporters/json');
const fs = require('fs');
const Email = process.env.LOGIN
const Password = process.env.PASSWORD
// An example of running Pa11y programmatically, reusing
// existing Puppeteer browsers and pages


const puppeteer = require('puppeteer');

runExample();

// Async function required for us to use await
async function runExample() {
    let browser;
    // let pages;
    try {

        // Launch our own browser
        browser = await puppeteer.launch({
            headless: false,
            args: ['--start-maximized']
        });

        // Create a page for the test runs
        // (Pages cannot be used in multiple runs)
        // pages = [
        //     await browser.newPage(),
        //     await browser.newPage()
        // ];

        // Test http://example.com/ with our shared browser
        const result = await pa11y('https://tester.test.io/', {
            browser,
            page: await browser.newPage(),


            // Test http://example.com/otherpage/ with our shared browser


            // WCAG2A, WCAG2AA, or WCAG2AAA 
            standard: 'WCAG2AAA',
            includeNotices: true,
            includeWarnings: true,

            // The root element for testing a subset of the page opposed to the full document.
            //rootElement: '#notice_items',
            // Run some actions before the tests
            hideElements: '#top-nav-bar, #main-sidebar',
            actions: [
                `set field #user_email to ${Email}`,
                `set field #user_password to ${Password}`,
                "click element .btn.btn-primary.btn-block",
                "wait for element img[title='test IO'] to be visible",
                "click element .icon.icon-bell.mr-0",
                "wait for element div[aria-label='Open Intercom Messenger'] to be visible",
            ],

            // Log what's happening to the console
            log: {
                debug: console.log,
                error: console.error,
                info: console.log
            },


        });

        // Output the raw result object
        //console.log(result);
        const testDateTime = `${new Date().getFullYear()}.${new Date().getMonth()}.${new Date().getDate()}_${new Date().getHours()}.${new Date().getMinutes()}.${new Date().getSeconds()}`;

        //   htmlReporter-----------
        const html = await htmlReporter.results(result);
        fs.writeFile(`test_result/Test_add_new_doctor_${testDateTime}.html`, html, (err) => { // создаем файл "result.html" и записываем в него данные
            if (err) throw err;
            console.log('htmlReporter saved!');
        });

        //   csvReporter-----------
        const csv = await csvReporter.results(result);
        fs.writeFile(`test_result/Test_add_new_doctor_${testDateTime}.csv`, csv, (err) => {
            if (err) throw err;
            console.log('csvReporter saved!');
        });






        // Output the raw result objects
        //dconsole.log(result);


        // Close the browser instance and pages now we're done with it
        // for (const page of pages) {
        //     await page.close();
        // }
        await browser.close();

    } catch (error) {

        // Output an error if it occurred
        console.error(error.message);

        // Close the browser instance and pages if theys exist
        // if (pages) {
        //     for (const page of pages) {
        //         await page.close();
        //     }
        // }
        if (browser) {
            await browser.close();
        }

    }
}