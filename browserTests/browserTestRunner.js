// TODO: Move to use CLI to run tests
const createTestCafe = require('testcafe');

let testcafe = null;

createTestCafe('localhost')
  .then((tc) => {
    testcafe = tc;
    const runner = testcafe.createRunner();

    return runner
      .src([
        'browserTests/accessibilityTest.js',
        'browserTests/browserTest.js',
        'browserTests/searchTest.js',
        // 'browserTests/titleBarTest.js',
        'browserTests/unitPageTest.js',
        'browserTests/unitListPageTest.js',
      ])
      .browsers(['chrome:headless'])
      // .reporter('list')
      .run();
  })
  .then((failedCount) => {
    console.log(`Tests failed: ${failedCount}`);
    testcafe.close();
  });