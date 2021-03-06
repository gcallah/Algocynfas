from selenium import webdriver

from unittest import TestCase, main


path =  # change path to path of chromedriver.exe
driver = webdriver.Chrome(executable_path=path)

# used to assert expectedUrl and currentUrl
# linkName: identifyingKeyword
links = {"Sorting Algorithms": "sort",
         "Hash table": "hashTable",
         "Find a Minimum Spanning Tree": "minSpanningTree",
         "Binary Search Tree": "binarySTree",
         "Red Black Tree": "redBlackTree",
         "Graph": "graph",
         "Tree": "tree",
         "Heap": "heap",
         "Canvas tutorial": "canvas",
         "Test Page for New Graphics Library": "graphics",
         "Fabric.js": "fabricjs",
         "Great data structure visualizations": "visualization",
         "Sigma.js:  a Javascript network graph library": "sigmajs"}


class TestLinks(TestCase):

    def loadPage(self):
        driver.get("https://gcallah.github.io/Algocynfas/")

    def closePage(self):
        driver.quit()

    def getLink(self, linkText):
        return driver.find_element_by_link_text(linkText)

    def getElemsByTagName(self, tagName):
        return driver.find_elements_by_tag_name(tagName)

    def test_links(self):
        linkNameList = []
        self.loadPage()
        linksList = self.getElemsByTagName("li")

        for link in linksList:
            linkNameList.append(link.text)

        for linkName in linkNameList:
            if linkName not in links:
                print("Please update the dictionary links to include", end="")
                print(linkName)
                continue
            clickLink = self.getLink(linkName)
            clickLink.click()
            # AssertionError will pop up and testing will stop
            # if the link is wrong/mismatched
            self.assertIn(links[linkName], driver.current_url)
            self.loadPage()

        self.closePage()


if __name__ == "__main__":
    main()
