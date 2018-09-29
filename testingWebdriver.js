// testing webdriver 

"use strict";

var webdriver = require('selenium-webdriver');
var browser = new webdriver.Builder().usingServer().withCapabilities({ 'browserName': 'firefox' }).build();

function getLink(linkText) {
    return browser.findElement(webdriver.By.linkText(linkText));
}

browser.get('https://gcallah.github.io/Algocynfas/');
var sortingAlgoLink = getLink('Sorting Algorithms');
sortingAlgoLink.click();



