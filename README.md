# GETTING STARTED:

1. **Clone the Project**:
    ```
    git clone https://github.com/PaolaRod/octo-umbrella.git
    ``` 
___
2. **Install all dependencies**: 
    ```
    npm ci
    ``` 
    * (the `ci` command is used to install all Locked Dependencies of the Project)
___
3. **To open the Cypress App, run the command**: 
    ```
    npm test
    ``` 
     * you can also use `npx cypress open` (since we have the "test" variable as "cypress open" in Package.json) to open Cypress.
___
4. **To run tests and generate XML and HTML Reports, execute**:
    ```
    npm run file */**/<filename>
    ```
       * where the "file" variable is:
   `cypress run --browser chrome --reporter cypress-multi-reporters --reporter-options configFile=jsconfig.json --record --key {key} --spec`,
   which is a shortcut to run the tests from a specific directory, using the Chrome browser, generating 1 XML Report to import into Jira and another to generate a beautiful HTML report, and additionally update the Cypress Dashboard of the Project.
___
5. **To generate the Cucumber JSON file and HTML Report**,
   - *First, Download the Formatter based on your OS:*
      - [Json-Formatter for Windows](https://github.com/cucumber/json-formatter/releases/download/v19.0.0/cucumber-json-formatter-windows-amd64)
      - [Json-Formatter for Linux](https://github.com/cucumber/json-formatter/releases/download/v19.0.0/cucumber-json-formatter-linux-amd64)
      - [Json-Formatter for MacOs](https://github.com/cucumber/json-formatter/releases/download/v19.0.0/cucumber-json-formatter-darwin-amd64)
   - *Then, move the downloaded file to the `cucumber-formatter` folder in your local repository for this project.*
   - *Follow these installation instructions:* [github.com/cucumber/json-formatter](https://github.com/cucumber/json-formatter)
   - *Modify the file `.cypress-cucumber-preprocessorrc.json` to change the formatter name:*
      - Rename: `cucumber-json-formatter.exe` to `cucumber-json-formatter` if you're using Linux or MacOs.
   - *Afterwards, you'll be able to generate the Cucumber JSON file to import the tests into Jira.*
   - *To generate HTML Cucumber reports after running the tests, execute*:
      ```
      npm run report:cucumber
      ```
      * where the "report:cucumber" variable is equal to:
      `node ./cucumber-html-report.js`, which is a shortcut to generate the Cucumber Report index.html in the `reports/cucumber-html-report` folder to evaluate the OVERALL Cucumber Test Result.
___
6. **To run a REGRESSION and generate a single global HTML Report, execute**:

    ```
    npm run regression:report
    ```
    Then run these commands one by one:
    ````
    npm run report:json
    npm run report:html
    ````
    * Thanks to this, a single mochawesome HTML Report will be generated to evaluate ALL Regression Test Results.
___
7. **NOW WITH CYPRESS DASHBOARD**, you can view all project test executions and results!
Visit: [CYPRESS DASHBOARD](https://dashboard.cypress.io/projects/mu3icw/analytics/runs-over-time)
