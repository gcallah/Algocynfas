from selenium import webdriver
from selenium.webdriver.support.ui import Select
from unittest import TestCase, main

from random import randint

#path = #change path to path of chromedriver.exe
path = r"C:\Users\dli19\Desktop\chromedriver\lib\chromedriver\chromedriver.exe"
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
        print("TestAlertSort")
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
        
        print()
#Child Class - TestAlert for Heap
class TestAlertHeap(TestAlert):
    
    def generateInvalidInput(self, low, high):
            invalidInput = randint(high + 1, high * 10) 
            if invalidInput % 2 == 0:
                #negative invalidInput
                invalidInput = randint(high * -1 , low - 1)
            print(invalidInput)
            return invalidInput
    
    def setSize(self):
        #setSizeDefaultValue = 10
        self.getById("set-button").click()
        
    def chooseFunc(self, validInput):
        inputBox = self.getById("funcChoices")
        options = inputBox.find_elements_by_tag_name('option')
        validRandInt = randint(1, 4)
        if validInput:
            #validFunc = options[1 to 4]
            options[validRandInt].click()
        else:
            #invalidFunc = Select One (options[0]) || Customize (options[5]) with no input
            if (validRandInt % 2 == 0): 
                options[5].click()
        
    def testAlert(self):
        print("TestAlertHash")
        self.loadPage()
        self.getLink("Hash table").click()
        inputID = "tableSize"
        
        choices = randint(0, 100) #!! randint(0, 100)
        if (choices < 33): #test Set Size with invalid input
            inputBox = self.getById(inputID)
            inputBox.clear()
            #invalidInput = < 2 || > 20
            inputBox.send_keys(self.generateInvalidInput(2, 20))
            self.setSize()
            
        elif (33 < choices < 66): #test choose func with invalid func
            inputID = "funcChoices"
            validFunc = True
            #need to set a valid size to test invalid func
            self.setSize()
            self.chooseFunc(False)
            self.getById("run-button").click()
            
        else: #test Hash with invalid input
            inputID = "InputValue"
            validFunc = True
            #need to set a valid size and choose a valid func to best invalid hash
            self.setSize()
            self.chooseFunc(validFunc)
            inputBox = self.getById(inputID)
            #invalidInput = < 0 || > 999
            inputBox.send_keys(self.generateInvalidInput(0, 999))
            self.getById("run-button").click()
            
        try:
            driver.switch_to.alert.accept()  
            if inputID == "tableSize":
                print("Ran as expected: Set Size: Invalid input is given and alert pops up")
            elif inputID == "funcChoices":
                print("Ran as expected: Function Choices: Invalid input is given and alert pops up")
            else:
                print("Ran as expected: Hash: Invalid input is given and alert pops up")
        
        except:
            if inputID == "tableSize":
                print("Error: Set Size: invalid input is given and alert doesn\'t pop up")
            elif inputID == "funcChoices":
                print("Error: Function Choices: invalid input is given and alert doesn\'t pop up")
            else:
                print("Error: Hash: invalid input is given and alert doesn\'t pop up")
        print()
        
if __name__ == "__main__": 
    
    testAlert = TestAlert()
    testAlert.loadPage()
    
    sort = TestAlertSort()
    sort.testAlert()
    
    heap = TestAlertHeap()
    heap.testAlert()
    
    testAlert.closePage()
    

