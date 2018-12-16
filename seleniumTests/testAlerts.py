from selenium import webdriver
from selenium.common.exceptions import NoAlertPresentException
from unittest import TestCase

from random import randint

# path = # change path to path of chromedriver.exe
path = r"C:\Users\dli19\Desktop\chromedriver\lib\chromedriver\chromedriver.exe"
driver = webdriver.Chrome(executable_path=path)


# Parent Class - General TestAlert
class TestAlert(TestCase):

    def loadPage(self):
        driver.get("https://gcallah.github.io/Algocynfas/")

    def closePage(self):
        driver.quit()

    def getLink(self, linkText):
        return driver.find_element_by_link_text(linkText)

    def getById(self, _id):
        return driver.find_element_by_id(_id)

    def randNum(self):
        return randint(0, 100)


# Child Class - TestAlert for Sort
class TestAlertSort(TestAlert):

    def __init__(self):
        self.validInput = self.valid()

    def valid(self):
        if (self.randNum() > 50):
            return False
        return True

    def generateValidInput(self):
        # valid input = any list of nums (-99 < num < 99)
        keys = ""
        validInput = randint(0, 99)
        for i in range(1, 6):
            keys += str(validInput) + ","
            validInput = randint(0, 99)
            if (validInput % i == 1):  # randomize negative inputs
                validInput *= -1
        keys += str(validInput)
        return keys

    def generateInvalidInput(self):
        # invalidInput = any non-integers || input.length < 2
        charNum = randint(0, 126)
        if (charNum <= 32):  # input.length = 0
            return ""
        else:
            if (charNum % 2 == 0):  # input.length = 1
                return chr(charNum)
            else:  # input.length > 1
                return (self.generateValidInput() + "," + chr(charNum))

    def enterInputs(self, inputBox):
        _input = ""
        if (self.validInput):
            _input = self.generateValidInput()
        else:
            _input = self.generateInvalidInput()
        inputBox.send_keys(_input)
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
                print("Ran as expected: Invalid input is given ", end="")
                print("and alert pops up")
        except NoAlertPresentException:
            if self.validInput:
                print("Ran as expected: Valid input is given and ", end="")
                print("alert doesn\'t pop up")
            else:
                print("Error: invalid input is given and alert ", end="")
                print("doesn\'t pop up")

        print()


# Child Class - TestAlert for Heap
class TestAlertHeap(TestAlert):

    def generateInvalidInput(self, low, high):
            invalidInput = randint(high + 1, high * 10)
            if invalidInput % 2 == 0:
                # negative invalidInput
                invalidInput = randint(high * -1, low - 1)
            print(invalidInput)
            return invalidInput

    def setSize(self):
        # defaultValue = 10
        self.getById("set-button").click()

    def chooseFunc(self, validInput):
        inputBox = self.getById("funcChoices")
        options = inputBox.find_elements_by_tag_name('option')
        validRandInt = randint(1, 4)
        if validInput:
            # validFunc = options[1 to 4]
            options[validRandInt].click()
        else:
            # invalidFunc = Select One (options[0]) ||
            # Customize (options[5]) with no input
            if (validRandInt % 2 == 0):
                options[5].click()
                print("Selected customize function but didn't input ", end="")
                print("a function")
            else:
                print("Didn't select an option")

    def testAlert(self):
        print("TestAlertHash")
        self.loadPage()
        self.getLink("Hash table").click()
        inputID = "tableSize"

        choices = self.randNum()
        if (choices <= 33):  # test Set Size with invalid input
            inputBox = self.getById(inputID)
            inputBox.clear()
            # invalidInput = < 2 || > 20
            inputBox.send_keys(self.generateInvalidInput(2, 20))
            self.setSize()

        elif (33 < choices <= 66):  # test chooseFunc with invalid function
            inputID = "funcChoices"
            validFunc = False
            # need to set a valid size to test invalid function
            self.setSize()
            self.chooseFunc(validFunc)
            self.getById("run-button").click()

        else:  # test Hash with invalid input
            inputID = "InputValue"
            validFunc = True
            # need to set a validSize and a validFunc to test invalid hash
            self.setSize()
            self.chooseFunc(validFunc)
            inputBox = self.getById(inputID)
            # invalidInput = < 0 || > 999
            inputBox.send_keys(self.generateInvalidInput(0, 999))
            self.getById("run-button").click()

        try:
            driver.switch_to.alert.accept()
            if inputID == "tableSize":
                print("Ran as expected: Set Size: ", end="")
                print("Invalid input is given and alert pops up")
            elif inputID == "funcChoices":
                print("Ran as expected: Function Choices: ", end="")
                print("Invalid input is given and alert pops up")
            else:
                print("Ran as expected: Hash: ", end="")
                print("Invalid input is given and alert pops up")

        except NoAlertPresentException:
            if inputID == "tableSize":
                print("Error: Set Size: invalid input is given ", end="")
                print("and alert doesn\'t pop up")
            elif inputID == "funcChoices":
                print("Error: Function Choices: ", end="")
                print("invalid input is given and alert doesn\'t pop up")
            else:
                print("Error: Hash: invalid input is given and ", end="")
                print("alert doesn\'t pop up")

        print()


# Child Class - TestAlert for Minimum Spanning Tree
class TestAlertMST(TestAlert):
    
    def __init__(self):
        self.maxNodes = 16
        
        
    def addNodes(self, validInput):
        inputBox = self.getById("nodeNum")
        lowestValidInput = 2  # 1
        highestValidInput = self.maxNodes
        numOfNodes = 0
        if validInput:
            numOfNodes = randint(lowestValidInput, highestValidInput)
        else:
            numOfNodes = randint(highestValidInput * -1,
                                   lowestValidInput - 1)
            print(numOfNodes)
        inputBox.send_keys(numOfNodes)
        self.getById("add-node-button").click()
        return numOfNodes
    
    
    def sendEdgesInput(self, numOfNodes, validInput):
        inputEdges = ""
        asciiOfA = 97
        
        #generate validEsdges
        for i in range(numOfNodes - 1):
            if i == numOfNodes - 2:
                #Every node connected to its prev node
                inputEdges += chr(asciiOfA + i) + "-" + chr(asciiOfA + i + 1)
            else:
                inputEdges += chr(asciiOfA + i) + "-" + chr(asciiOfA + i + 1) + ", "
        
        #generate invalidEdges
        if validInput == False:
            #InvalidEdges = repeatedEdge || self-loop
            randOrd = randint(0, numOfNodes - 1)
            if randOrd == "0":
                inputEdges += ", a-a"
                print("Self-assignment:", inputEdges + "a-a")
            else:
                randNum = asciiOfA + randOrd
                inputEdges += ", " + chr(randNum) + "-" + chr(randNum + 1)
                print("Repeated edge:", inputEdges)
        
        print("SendEdges:", inputEdges)
        self.getById("edges").send_keys(inputEdges)    
        
    def sendWeightsInput(self, numOfNodes, validInput):
        inputWeights = ""
        
        for i in range(numOfNodes):
            # assumed valid max weight = 100
            randNum = self.randNum()
            if validInput == False and i == numOfNodes - 2:
                #invalidWeights = negativeWeights
                inputWeights += str(randNum * -1)
                pass
            elif validInput and i == numOfNodes - 1:
                inputWeights += str(randNum)
            else:
                inputWeights += str(randNum) + ", "
                
        self.getById("weights").send_keys(inputWeights)    
        
    def testAlert(self):
        print("TestAlertMST")
        self.loadPage()
        self.getLink("Find a Minimum Spanning Tree").click()
        inputID = ""

        choices = 50  # self.randNum()
        if (choices <= 33):  # test Create Nodes with invalid input
            inputID = "nodeNum"
            validNodeNum = False
            self.addNodes(validNodeNum)

        elif (33 < choices <= 66):  # test Create Edges with invalid edges
            inputID = "edges"
            validNodeNum = True
            validWeights = True
            validEdges = False
            # need to add a valid number of nodes to test invalid edges
            numOfNodes = self.addNodes(validNodeNum)
            # need to send valid weights to test invalid edges
            self.sendWeightsInput(numOfNodes, validWeights)
            # send invalid number of Edges
            self.sendEdgesInput(numOfNodes, validEdges)
            self.getById("add-edge-button").click()
            
        else:
            inputID = "weights"
            validNodeNum = True
            validEdges = True
            validWeights = False
            # need to add a valid number of nodes to test invalid weights
            numOfNodes = self.addNodes(validNodeNum)
            # need to send valid edges to test invalid weights
            self.sendEdgesInput(numOfNodes, validEdges)
            # send invalid number of weights
            self.sendWeightsInput(numOfNodes, validWeights)
            self.getById("add-edge-button").click()
            
        try:
            driver.switch_to.alert.accept()
            if inputID == "nodeNum":
                print("Ran as expected: Create Nodes: ", end="")
                print("Invalid input is given and alert pops up")
        except NoAlertPresentException:
            if inputID == "nodeNum":
                print("Error: Create Node: ", end="")
                print("invalid input is given and alert doesn\'t pop up")


if __name__ == "__main__":

    testAlert = TestAlert()
    testAlert.loadPage()

    sort = TestAlertSort()
    sort.testAlert()

    heap = TestAlertHeap()
    heap.testAlert()
    
    mst = TestAlertMST()
    mst.testAlert()

    # testAlert.closePage()
