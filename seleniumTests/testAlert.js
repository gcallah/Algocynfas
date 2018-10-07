//attempting to test whether alert pops up when invalid input is given
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

function generateInvalidInput() {
    //invalidInput = any non-integers || size(input) < 2
    var charNum = Math.random() * 126;
    if (charNum <= 32) { //size(input) = 0
        return '';
    } else { //size(input) = 1
        return String.fromCharCode(charNum);
    }
}

browser.get('https://gcallah.github.io/Algocynfas/');
getLink('Sorting Algorithms').click().then(function () {
    getById('number-input').sendKeys(generateInvalidInput());
    return getById('add-number-button').click();
}).then(function () {
    //trying to test whether alert pops up when invalid input is given
    /*
    try {
        browser.switchTo().alert().then(function (alert) {
            console.log('alert');
            return alert.accept();
        });
    }
    catch (err) {
        console.log('err');
        return false;
    }
}).then(function () {*/
    return closeBrowser();
});

