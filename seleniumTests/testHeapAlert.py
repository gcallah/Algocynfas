from selenium import webdriver

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException

from unittest import TestCase, main
from random import randint

mydriver = webdriver.Chrome()

def loadPage():
        mydriver.get('https://gcallah.github.io/Algocynfas/')
    
def closePage():
    mydriver.quit()

def getLink(linkText):
    return mydriver.find_element_by_link_text(linkText)

def getById(_id):
    return mydriver.find_element_by_id(_id)

def generateInvalidInput():
        #invalidInput = < 2 || > 20
        invalidInput = randint(21, 100) 
        if invalidInput % 2 == 0:
            invalidInput = randint(-50, 1)
        return invalidInput
    
def testAlert():
    loadPage()
    getLink('Hash table').click()
    inputBox = getById('InputValue')
    inputBox.send_keys(generateInvalidInput())
    getById('run-button').click()
    try:
        mydriver.switch_to.alert.accept()    
        print("Ran as expected: Invalid input is given and alert pops up")
    except:
        print("Error: invalid input is given and alert doesn\'t pop up")
    closePage()
    