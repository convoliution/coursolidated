#!/usr/bin/python

import csv
import sys
import re
from anytree import Node, RenderTree

#loop through course numbers to search
number = raw_input('Class lookup:\n').upper()

#read csv, and split on "," the line
csv_file_open = open('results.csv', "rb")
csv_file = csv.reader(csv_file_open, delimiter=",")

def recursiveSearch(classToSearch, parentNode):
    # dummy flag (doesn't really do anything but can't return inside the 'else')
#    noPrereqsLeft = False
    #csv_file = csv.reader(open('results.csv', "rb"), delimiter=",")
    csv_file_open.seek(0);
    for row in csv_file:
        if classToSearch == row[0]:
            # add node, get prereqs
            print ("ADDED NODE: " + classToSearch)
            temporaryNode = Node(classToSearch, parent=parentNode)
#TODO       classToSearchPrereqs = re.findall(r'([A-Z]+\s\d+[A-Z]*|OR|AND|TWO OF)', row[4].upper())
            classToSearchPrereqs = re.findall(r'(MATH 20-B|MATH 10-C|[A-Z]+\s\d+[A-Z]*)', row[4].upper())
            print ("classToSearchPrereqs is: ")
            print (classToSearchPrereqs)
            # for each entry in the new prereqs
            for entry in classToSearchPrereqs:
                print ("Entry is " + entry)
                recursiveSearch(entry, temporaryNode)
                print ("inside " + entry)
        # if the classnumber is not found, return
#        else:
#            noPrereqsLeft = True
    # for all entries if there are no prereqs available, then return
#        if noPrereqsLeft == True:
#            return
    for pre, fill, node in RenderTree(initialNode):
        print("%s%s" % (pre, node.name))


#loop through csv list
for row in csv_file:
    #if current rows 2nd value is equal to input, print that row
    if number == row[0]:
        prerequisites = row[4].upper()
#TODO   dependencies = re.findall(r'[A-Z]+\s\d+[A-Z]*|OR|AND|TWO OF', prerequisites)
#        dependencies = re.findall(r'[A-Z]+\s\d+[A-Z]*', prerequisites)
        dependencies = re.findall(r'(MATH 20-B|MATH 10-C|[A-Z]+\s\d+[A-Z]*)', prerequisites)
print prerequisites
print dependencies

counter = 0
initialNode = Node(number)
subdependencies = []

for entry in dependencies:
    # reset the reader each time
    #csv_file = csv.reader(open('results.csv', "rb"), delimiter=",")
    csv_file_open.seek(0);
    for row in csv_file:
        # get the corresponding course number row and its prerequisites
        if entry == row[0]:
            tempNode = Node(entry, parent=initialNode)
#TODO       subdependencies = re.findall(r'([A-Z]+\s\d+[A-Z]*|OR|AND|TWO OF)', row[4].upper())
#            subdependencies = re.findall(r'[A-Z]+\s\d+[A-Z]*', row[4].upper())
            subdependencies = re.findall(r'(MATH 20-B|MATH 10-C|[A-Z]+\s\d+[A-Z]*)', row[4].upper())
            print ("subdependencies is ")
            print subdependencies
            for item in subdependencies:
                recursiveSearch(item, tempNode)

for pre, fill, node in RenderTree(initialNode):
    print("%s%s" % (pre, node.name))

#close the file
csv_file_open.close();
