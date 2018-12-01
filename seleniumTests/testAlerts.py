from selenium import webdriver

from unittest import TestCase, main
from random import randint

path = #change path to path of chromedriver.exe
driver = webdriver.Chrome(executable_path=path)

#Parent Class - General TestAlert
class TestAlert(TestCase):
    
    def loadPage(self):
        driver.get("https://gcallah.github.io/Algocynfas/")
    
    def closePage(self):
        driver.quit()
        
    def getLink(self, linkText):
        return driver.find_element_by_link_text(linkText)
    
    def getById(self, _id):
        return driver.find_element_by_id(_id)

#Child Class - TestAlert for Sort
class TestAlertSort(TestAlert):
    
    def __init__(self):
        self.validInput = self.validOrInvalid()
        
    def validOrInvalid(self):
        if (randint(0, 100) > 50):
            return False 
        return True
    
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
        if (self.validInput):
            _input = self.generateValidInput();
        else:
            _input = self.generateInvalidInput();
        inputBox.send_keys(_input);
        print(_input)
    
    def testAlert(self):
        self.getLink("Sorting Algorithms").click()
        inputBox = self.getById("number-input")
        self.enterInputs(inputBox)
        self.getById("add-number-button").click()
        
        try:
            driver.switch_to.alert.accept()    
            if self.validInput:
                print("Error: Valid input is given and alert pops up")
            else:
                print("Ran as expected: Invalid input is given and alert pops up")
        except:
            if self.validInput:
               print("Ran as expected: Valid input is given and alert doesn\'t pop up")
            else:
               print("Error: invalid input is given and alert doesn\'t pop up")

#Child Class - TestAlert for Heap
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
        
        if (randint(0, 100) > 50): #test Set Size with invalid input
            inputBox = self.getById(inputID)
            inputBox.clear()
            #invalidInput = < 2 || > 20
            inputBox.send_keys(self.generateInvalidInput(2, 20))
            self.getById("set-button").click()
            
        else: #test Hash with invalid input
            inputID = "InputValue"
            inputBox = self.getById(inputID)
            #invalidInput = < 0 || > 999
            inputBox.send_keys(self.generateInvalidInput(0, 999))
            self.getById("run-button").click()
        
        try:
            driver.switch_to.alert.accept()  
            if inputID == "tableSize":
                print("Ran as expected: Set Size: Invalid input is given and alert pops up")
            else:
                print("Ran as expected: Hash: Invalid input is given and alert pops up")
        except:
            if inputID == "tableSize":
                print("Error: Set Size: invalid input is given and alert doesn\'t pop up")
            else:
                print("Error: Hash: invalid input is given and alert doesn\'t pop up")

if __name__ == "__main__": 
    
    testAlert = TestAlert()
    testAlert.loadPage()
    
    sort = TestAlertSort()
    sort.testAlert()
    
    heap = TestAlertHeap()
    heap.testAlert()
    
    testAlert.closePage()
    

