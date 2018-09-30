//attempting to test whether alert pops up 
//when invalid input is given for Sorting Algorithms

"use strict";

var webdriver = require('selenium-webdriver');
var browser = new webdriver.Builder().usingServer().withCapabilities({ 'browserName': 'firefox' }).build();


function closeBrowser() {
    browser.quit();
}

function getLink(linkText) {
    return browser.findElement(webdriver.By.linkText(linkText));
}

function getById(id) {
    return browser.findElement(webdriver.By.id(id));
}
/*
function generateInvalidInput() {
    //invalidInput = any non-integers || size(input) < 2

}
*/

browser.get('https://gcallah.github.io/Algocynfas/').
    then(function () {
        return getLink('Sorting Algorithms');
    }).
    then(function (link) {
        return link.click();
    }).
    then(function(){
        return getById('number-input');
    }).
    then(function (numberInput) {
        return numberInput.sendKeys('hi');
    }).
    then(function () {
        return getById('add-number-button');
    }).
    then(function (runButton) {
        return runButton.click();
    }).
    then(function () {
        /*
        //test whether alert pops up when invalid input is given
        browser.wait(function () {
            try {
                driver.switchTo().alert().accept();
                console.log('alert');
                return true;
            }
            catch (err) {
                console.log('err');
                return false;
            }
        }, 10);
        */
        closeBrowser();
});
