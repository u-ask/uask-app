# uask-UI
User interface for uask project

## Installation and build
```
npm install
npm run build
```

## Starting the app
```
npm start
```

to start on a specific port :
```
PORT=3434 npm start
```

## Testing the app
Run unit tests :
```
npm test
```
To run integration tests when the development server is running :
```
npm run it-test
```
To run integration tests on production build (the development server must be stopped prior runnig this script) :
```
npm run ci
```
It builds the app, starts the production server and run integration tests. It should be used prior a production deployment.
For a complete continuous integration chain :
```
npm ci ; npm run ci
```

## Writing tests
Our tests use a specific syntax :
```ts
const testName: ITtest = browser =>
  [
    "Your message", 
    async t => {
    const page = await browser.newPage();
    await page.goto("Your test url");
    /** Write your test logic */
    t.end();
  }];

export default [login("administrator"), testName]
```
If you want a specific role while performing your tests, you can use login(role: string) available in the test-helpers.ts file by importing it in your test file. 

Every tests must be written in a suite() function. They will be called synchronously from first to last element in the suite array.

An example :
```ts
import { login, ITtest, forceLanguage } from "../test-helpers";

const test1: ITtest = browser =>
  [
    "This is a test", 
    async t => {
      const page = await browser.newPage();
      await page.goto(
        "http://localhost:8080/P11-05/patient/edit?patientCode=00001"
      );
      t.true(true);
      t.end();
  }];

export default [login("administrator"), test1]
```