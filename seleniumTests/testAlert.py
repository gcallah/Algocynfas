from selenium import webdriver

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException

from unittest import TestCase, main
from random import randint

mydriver = webdriver.Chrome()

def validOrInvalid():
    if (randint(0, 100) > 50):
        return False 
    return True

validInputBool = validOrInvalid()

class TestAlert(TestCase):
    def loadPage(self):
        mydriver.get('https://gcallah.github.io/Algocynfas/')
    
    def closePage(self):
        mydriver.quit()
    
    def getLink(self, linkText):
        return mydriver.find_element_by_link_text(linkText)
    
    def getById(self, _id):
        return mydriver.find_element_by_id(_id)
    
    def generateValidInput(self):
        #valid input = 3,5,7,8, || -99 < num < 99
        keys = '';
        randInput = randint(0,99);
        for i in range(1,6):
            keys += str(randInput) + ',';
            randInput = randint(0,99);
            if (randInput % i == 1): #randomize negative inputs
                randInput *= -1;
        keys += str(randInput);
        return keys;
    
    def generateInvalidInput(self):
        #invalidInput = any non-integers || input.length < 2 
        charNum = randint(0, 126);
        if (charNum <= 32): #input.length = 0
            return '';
        else:
            if (charNum % 2 == 0): #input.length = 1
                return chr(charNum);
            else: #input.length > 1
                return (self.generateValidInput() + ',' + chr(charNum))
    
    def enterInputs(self, inputBox):
        _input = ''
        if (validInputBool):
            _input = self.generateValidInput();
        else:
            _input = self.generateInvalidInput();
        inputBox.send_keys(_input);
        print(_input)
    
    def testAlert(self):
        self.loadPage()
        self.getLink('Sorting Algorithms').click()
        inputBox = self.getById('number-input')
        self.enterInputs(inputBox)
        self.getById('add-number-button').click()
        try:
            mydriver.switch_to.alert.accept()    
            if validInputBool:
                print('Error: Valid input is given and alert pops up')
            else:
                print("Ran as expected: Invalid input is given and alert pops up")
        except:
            if validInputBool:
               print('Ran as expected: Valid input is given and alert doesn\'t pop up')
            else:
               print("Error: invalid input is given and alert doesn\'t pop up")
        self.closePage()

if __name__ == '__main__':
    main()