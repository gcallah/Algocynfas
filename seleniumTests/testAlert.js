//attempting to test whether alert pops up when invalid input is given
"use strict";

var webdriver = require('selenium-webdriver');
var browser = new webdriver.Builder().usingServer().withCapabilities({ 'browserName': 'firefox' }).build();


var validInputBool = true;
var validOrInvalid = Math.random() * 100; 
if (validOrInvalid > 50) {
    validInputBool = false;
}

console.log(validOrInvalid, validInputBool);
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
    //invalidInput = any non-integers || input.length < 2 
    var charNum = Math.random() * 126;
    if (charNum <= 32) { //input.length = 0
        return '';
    } else { //input.length = 1
        return String.fromCharCode(charNum);
    }
}

function enterInputs(inputBox) {
    if (validInputBool) {
        inputBox.sendKeys(2, ',', 3, ',', 4);
    } else {
        var num = generateInvalidInput();
        inputBox.sendKeys(num);
    }
    return validInputBool;
}

var alertPopUp = true;
browser.get('https://gcallah.github.io/Algocynfas/');
getLink('Sorting Algorithms').click().then(function () {
    var inputBox = getById('number-input');
    enterInputs(inputBox);
    return getById('add-number-button').click();
}).then(function () {
    try {
        //invalid input is given & alert pops up
        return browser.switchTo().alert().accept();
    }
    catch (err) {
        //valid input is given & alert doesn't pop up
        return err;
    }
}).catch(function (err) {
    alertPopUp = false;
}).then(function () {
    console.log('Valid Input:', validInputBool, 'Alert Popup:', alertPopUp);
    if (!validInputBool && !alertPopUp) {
        console.log('Error: Invalid input is given and alert doesn\'t pops up');
    } else if (validInputBool && alertPopUp) {
        console.log('Error: Valid input is given and alert pops up');
    }
    return closeBrowser();
});