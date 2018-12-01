from selenium import webdriver

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException

from unittest import TestCase, main
from random import randint


path = #change path to path of chromedriver.exe
driver = webdriver.Chrome(executable_path=path)

links = {"Sorting Algorithms" : "sort", 
         "Hash table" : "hashTable", 
         "Find a Minimum Spanning Tree" : "minSpanningTree",
         "Binary Search Tree" : "binarySTree",
         "Graph" : "graph",
         "Tree" : "tree",
         "Heap" : "heap",
         "Canvas tutorial" : "canvas",
         "Test Page for New Graphics Library" : "graphics",
         "Fabric.js" : "fabricjs",
         "Great data structure visualizations" : "visualization",
         "Sigma.js: a Javascript network graph library" : "sigmajs"}

class TestLink(TestCase):

    def loadPage(self):
        driver.get("https://gcallah.github.io/Algocynfas/")

    def closePage(self):
        driver.quit()

    def getLink(self, linkText):
        return driver.find_element_by_link_text(linkText)

    def getById(self, id):
        return self.driver.find_element_by_id(id)

    def test_links(self):
        lst = []
        driver.get("https://gcallah.github.io/Algocynfas/")
        linksList = driver.find_elements_by_tag_name("li")
        
        for link in linksList:
            lst.append(link.text)
            
        for name in lst:
            driver.get("https://gcallah.github.io/Algocynfas/")
            clickLink = self.getLink(name)
            clickLink.click()
            #AssertionError will pop up and testing will stop
            #if the link is wrong/mismatched
            self.assertIn(links[name], driver.current_url)

if __name__ == "__main__":
    main()
