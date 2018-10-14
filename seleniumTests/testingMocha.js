var assert = require('assert');
var webdriver = require('selenium-webdriver');
var browser = new webdriver.Builder().usingServer().withCapabilities({ 'browserName': 'firefox' }).build();

describe('Test Suite', function () {

    before(function () {
        browser.get('https://gcallah.github.io/Algocynfas/');
    });

    after(function () {
        browser.quit();
    });

    it('Test Case', function () {

        browser.getTitle().then(function (title) {
            assert.equal(title, 'Algocynfas');
        }).catch((err) => {
            console.log('Error:', err);
        });
        browser.sleep();
    });

});
