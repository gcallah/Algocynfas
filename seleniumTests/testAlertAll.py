from selenium import webdriver

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException

from unittest import TestCase, main
from random import randint


path = #change path to path of chromedriver.exe
driver = webdriver.Chrome(executable_path=path)

def validOrInvalid():
    if (randint(0, 100) > 50):
        return False 
    return True

validInputBool = validOrInvalid()
        
class TestAlert(TestCase):
    def loadPage(self):
        driver.get("https://gcallah.github.io/Algocynfas/")
    
    def getLink(self, linkText):
        return driver.find_element_by_link_text(linkText)
    
    def getById(self, _id):
        return driver.find_element_by_id(_id)

class TestAlertSort(TestAlert):
    def generateValidInput(self):
        #valid input = any list of nums (-99 < num < 99)
        keys = "";
        validInput = randint(0,99);
        for i in range(1,6):
            keys += str(validInput) + ",";
            validInput = randint(0,99);
            if (validInput % i == 1): #randomize negative inputs
                validInput *= -1;
        keys += str(validInput);
        return keys;
    
    def generateInvalidInput(self):
        #invalidInput = any non-integers || input.length < 2 
        charNum = randint(0, 126);
        if (charNum <= 32): #input.length = 0
            return "";
        else:
            if (charNum % 2 == 0): #input.length = 1
                return chr(charNum);
            else: #input.length > 1
                return (self.generateValidInput() + "," + chr(charNum))
    
    def enterInputs(self, inputBox):
        _input = ""
        if (validInputBool):
            _input = self.generateValidInput();
        else:
            _input = self.generateInvalidInput();
        inputBox.send_keys(_input);
        print(_input)
    
    def testAlert(self):
        self.loadPage()
        self.getLink("Sorting Algorithms").click()
        inputBox = self.getById("number-input")
        self.enterInputs(inputBox)
        self.getById("add-number-button").click()
        try:
            driver.switch_to.alert.accept()    
            if validInputBool:
                print("Error: Valid input is given and alert pops up")
            else:
                print("Ran as expected: Invalid input is given and alert pops up")
        except:
            if validInputBool:
               print("Ran as expected: Valid input is given and alert doesn\"t pop up")
            else:
               print("Error: invalid input is given and alert doesn\"t pop up")
        
class TestAlertHeap(TestAlert):
    def generateInvalidInput(self, low, high):
            invalidInput = randint(high + 1, high * 10) 
            if invalidInput % 2 == 0:
                #negative invalidInput
                invalidInput = randint(high * -1 , low-1)
            print(invalidInput)
            return invalidInput
        
    def testAlert(self):
        self.loadPage()
        self.getLink("Hash table").click()
        inputID = "tableSize"
        if (randint(0, 100) > 50):
            inputBox = self.getById(inputID)
            inputBox.clear()
            #invalidInput = < 2 || > 20
            low = 2
            high = 20
        else:
            inputID = "InputValue"
            inputBox = self.getById(inputID)
            #invalidInput = < 0 || > 999
            low = 0
            high = 999
        inputBox.send_keys(self.generateInvalidInput(low,high))
        self.getById("run-button").click()
        try:
            driver.switch_to.alert.accept()  
            if inputID == "tableSize":
                print("TableSize: Ran as expected: Invalid input is given and alert pops up")
            else:
                print("InputValue: Ran as expected: Invalid input is given and alert pops up")
        except:
            if inputID == "tableSize":
                print("TableSize: Error: invalid input is given and alert doesn\"t pop up")
            else:
                print("InputValue: Error: invalid input is given and alert doesn\"t pop up")

if __name__ == "__main__": 
    sort = TestAlertSort()
    sort.testAlert()
    heap = TestAlertHeap()
    heap.testAlert()
    

