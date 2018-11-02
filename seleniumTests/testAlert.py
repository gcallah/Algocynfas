from selenium import webdriver

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException

from random import randint

mydriver = webdriver.Chrome()
mydriver.get('https://gcallah.github.io/Algocynfas/')

validInputBool = True 
alertPopUp = True;
validOrInvalid = randint(0, 100)
if (validOrInvalid > 50):
    validInputBool = False 

def getLink(linkText):
    return mydriver.find_element_by_link_text(linkText)

def getById(id):
    return mydriver.find_element_by_id(id)

def generateInvalidInput():
    #invalidInput = any non-integers || input.length < 2 
    charNum = randint(0, 126);
    if (charNum <= 32): #input.length = 0
        return '';
    else:
        if (charNum % 2 == 0): #input.length = 1
            return chr(charNum);
        else: #input.length > 1
            return (generateValidInput() + ',' + chr(charNum))

def generateValidInput():
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


def enterInputs(inputBox):
    _input = ''
    if (validInputBool):
        _input = generateValidInput();
    else:
        _input = generateInvalidInput();
    inputBox.send_keys(_input);
    print(_input)



getLink('Sorting Algorithms').click()
inputBox = getById('number-input')
enterInputs(inputBox)
getById('add-number-button').click()
try:
	mydriver.switch_to.alert.accept();
except:
	alertPopUp = False
    
print('Valid Input:', validInputBool, 'Alert Popup:', alertPopUp);
if (validInputBool == False and alertPopUp == False):
    print('Error: Invalid input is given and alert doesn\'t pops up');
elif (validInputBool and alertPopUp):
    print('Error: Valid input is given and alert pops up');
else:
    print('Ran as expected');
    
mydriver.quit()
