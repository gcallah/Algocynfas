from selenium import webdriver

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException

from unittest import TestCase, main
from random import randint

path = r'C:\Users\dli19\Desktop\chromedriver\lib\chromedriver\chromedriver.exe'
mydriver = webdriver.Chrome(executable_path=path)

def validOrInvalid():
    if (randint(0, 100) > 50):
        return False 
    return True

validInputBool = validOrInvalid()

def closePage():
    mydriver.quit()
        
class TestAlert(TestCase):
    def loadPage(self):
        mydriver.get('https://gcallah.github.io/Algocynfas/')
    
    def getLink(self, linkText):
        return mydriver.find_element_by_link_text(linkText)
    
    def getById(self, _id):
        return mydriver.find_element_by_id(_id)

class TestAlertSort(TestAlert):
    def generateValidInput(self):
        #valid input = any list of nums (-99 < num < 99)
        keys = '';
        validInput = randint(0,99);
        for i in range(1,6):
            keys += str(validInput) + ',';
            validInput = randint(0,99);
            if (validInput % i == 1): #randomize negative inputs
                validInput *= -1;
        keys += str(validInput);
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
        
class TestAlertHeap(TestAlert):
    def generateInvalidInput(self):
            #invalidInput = < 2 || > 20
            invalidInput = randint(21, 100) 
            if invalidInput % 2 == 0:
                invalidInput = randint(-50, 1)
            print(invalidInput)
            return invalidInput
        
    def testAlert(self):
        self.loadPage()
        self.getLink('Hash table').click()
        inputBox = self.getById('InputValue')
        inputBox.send_keys(self.generateInvalidInput())
        self.getById('run-button').click()
        try:
            mydriver.switch_to.alert.accept()    
            print("Ran as expected: Invalid input is given and alert pops up")
        except:
            print("Error: invalid input is given and alert doesn\'t pop up")
        
sort = TestAlertSort()
sort.testAlert()
heap = TestAlertHeap()
heap.testAlert()
closePage()
