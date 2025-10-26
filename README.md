# AI-Job-Risk-Calculator
Will AI Replace YOUR Job? Take the 60-second quiz.

## FAQ

### Can you execute commands from Google Sheets?

Not directly. This project does not include any Google Sheets integrations, so there is no supported way to trigger shell commands from a spreadsheet. If you need to run commands in response to Google Sheets activity you would have to build a separate workflow, such as:

* Creating an Apps Script inside Google Sheets that sends webhooks to a secure backend service you control.
* Having that backend validate the request, perform the required command-line operations in a controlled environment, and return the results.

That kind of automation sits outside the scope of this repository because it introduces security, authentication, and infrastructure considerations that must be handled carefully to avoid exposing command execution to untrusted users.
