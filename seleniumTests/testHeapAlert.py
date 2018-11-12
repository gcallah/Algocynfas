from selenium import webdriver

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException


mydriver = webdriver.Chrome()

def loadPage():
        mydriver.get('https://gcallah.github.io/Algocynfas/')
    
def closePage():
    mydriver.quit()

def getLink(linkText):
    return mydriver.find_element_by_link_text(linkText)

def getById(_id):
    return mydriver.find_element_by_id(_id)

def testAlert():
    loadPage()
    getLink('Hash table').click()
    inputBox = getById('InputValue')
    inputBox.send_keys(1)
    getById('run-button').click()