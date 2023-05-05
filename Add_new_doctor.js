// An example of executing some actions before Pa11y runs.
// This example logs in to a fictional site then waits
// until the account page has loaded before running Pa11y
'use strict';

const pa11y = require('pa11y');
const htmlReporter = require('pa11y/lib/reporters/html');
const csvReporter = require('pa11y/lib/reporters/csv');
const jsonReporter = require('pa11y/lib/reporters/json');
const fs = require('fs');


runExample();

// Async function required for us to use await
async function runExample() {
    try {

        // Test http://example.com/
        const result = await pa11y('https://ej2.syncfusion.com/showcase/angular/appointmentplanner/#/doctors', {



            // WCAG2A, WCAG2AA, or WCAG2AAA 
            standard: 'WCAG2AAA',
            includeNotices: true,
            includeWarnings: true,

            // The root element for testing a subset of the page opposed to the full document.
            rootElement: '#_dialog-content',
            // Run some actions before the tests
            actions: [
                'click element .specialization-types button.e-control',
                'set field #Name input to car',

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

        //   jsonReporter-----------
        // const json_r = await jsonReporter.results(result);
        // fs.writeFile(`test_result/result_${testDateTime}.json`, json_r, (err) => { 
        //     if (err) throw err;
        //     console.log('jsonReporter saved!');
        // });
    } catch (error) {

        // Output an error if it occurred
        console.error(error.message);

    }
}




// set field #password to password1234',
//                 'click element #submit',
//                 'wait for url to be http://example.com/myaccount'