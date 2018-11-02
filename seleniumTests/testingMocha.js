var assert = require('assert');
var webdriver = require('selenium-webdriver');
var browser = new webdriver.Builder().usingServer().withCapabilities({ 'browserName': 'firefox' }).build();
describe('Test Alert', function () {

    before(function () {
        browser.get('https://gcallah.github.io/Algocynfas/');
    });

    after(function () {
        browser.quit();
    });

    function getLink(linkText) {
        return browser.findElement(webdriver.By.linkText(linkText));
    }

    //tests if open to correct link
    it('should open to Website', function () {
        return browser.getTitle().then(function (title) {
            assert.equal(title, 'Algocynfas');
        });
        //need to implement: break out everything if err here
    });
    /*
    
    it('should open to Sorting Algortihms', function () {
        getLink('Sorting Algorithms').click();
        browser.getCurrentUrl().then(function (title) {
            assert.equal(title, 'Sorting Algorithms'); //find way to compare; title returns Algocynfas
        }).catch((err) => {
            console.log('Error:', err);
        });
    });*/
});