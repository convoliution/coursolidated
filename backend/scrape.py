#!/usr/bin/env python
# -*- coding: utf-8 -*-

import csv
import requests
import re
from bs4 import BeautifulSoup

# to get the CSV of all departments' class info
keyCount = 0
keyword = ['AIP', 'AASM', 'ANTH', 'AUDI', 'BIOI', 'BIOL', 'BIOM', 'CHEM',
'CHIN', 'CLAS', 'CSP', 'CLIN', 'CLRE', 'COGS', 'COMM', 'CONT', 'CGS', 'CAT',
'DSGN', 'DOC', 'ECON', 'EDS', 'SOE', 'BENG', 'CSE', 'ECE', 'MAE', 'NANO',
'SE', 'ENVR', 'ESYS', 'ETHN', 'FMPH', 'FILM', 'GHP', 'GPS', 'LHCO', 'HLAW',
'HIST', 'HDP', 'HR', 'HUM', 'IMSM', 'INTL', 'JAPN', 'JUDA', 'LATI', 'LAWS',
'LING', 'LIT', 'MMW', 'RSM', 'MBC', 'TMC', 'MATS', 'MATH', 'MSED', 'MCWP',
'MUS', 'NEU', 'PHIL', 'PHYS', 'POLI', 'PSYCH', 'RELI', 'REV', 'ERC', 'SCIS',
'SIO', 'SXTH', 'SOC', 'THEA', 'TWS', 'USP', 'VIS', 'WARR']

outfile = open("./results.csv", "wb")
writer = csv.writer(outfile)
writer.writerow(["Course Number", "Course Name", "Number of Units", "Description", "Prerequisites"])

#loop through every department, adding to the CSV
for department in keyword:

    # gets and stores the HTML from this site
    url = 'http://www.ucsd.edu/catalog/courses/' + keyword[keyCount] + '.html'
    response = requests.get(url)
    html = response.content

    # using lxml to parse through the HTML
    soup = BeautifulSoup(html, "lxml")

    # parse the course number
    coursenumber = soup.findAll("p", class_= "course-name")
    counter = 0

    # strip out the tags
    for a in coursenumber:
        # loop through each coursenumber, splitting to eliminate duplicated spacing
        coursenumber[counter] = coursenumber[counter].text.encode('utf-8').decode('ascii', 'ignore').split()
        # join together the separated terms
        coursenumber[counter] = " ".join(coursenumber[counter])
        # filter out everything except for coursenumber
        coursenumber[counter] = re.sub(r'[.](.*)', "", coursenumber[counter])
        # increase the counter and move on to the next element
        counter = counter + 1

    #parsing course name
    coursename = soup.findAll("p", class_= "course-name")
    counter = 0

    # strip out the tags
    for a in coursename:
        # loop through each coursename, splitting to eliminate duplicated spacing
        coursename[counter] = coursename[counter].text.encode('utf-8').decode('utf-8', 'ignore').split()
        # join together the separated terms
        coursename[counter] = " ".join(coursename[counter])
        # filter out everything except for coursename
        coursename[counter] = re.sub(r'(.*)[.]', "", coursename[counter]).lstrip()
        coursename[counter] = re.sub(r'[(](.*)[)]', "", coursename[counter])
        # need to encode to prevent special chars from being messed up
        coursename[counter] = coursename[counter].encode('Windows-1252')
        # increase the counter and move on to the next element
        counter = counter + 1

    #parsing number of units
    numberunits = soup.findAll("p", class_= "course-name")
    counter = 0

    # strip out the tags
    for a in numberunits:
        # loop through each coursename, splitting to eliminate duplicated spacing
        numberunits[counter] = numberunits[counter].text.encode('utf-8').decode('utf-8', 'ignore').split()
        # join together the separated terms
        numberunits[counter] = " ".join(numberunits[counter])
        # filter out everything except for number of units
        numberunits[counter] = re.sub(r'(.*)[(]', "", numberunits[counter])
        numberunits[counter] = re.sub(r'[)]', "", numberunits[counter])
        # for excel purposes, replace 4-4 and 4-4-4 to stop date conversion, same with 1 and 2
        numberunits[counter] = re.sub(r'4(.*)-4', "4 each", numberunits[counter])
        numberunits[counter] = re.sub(r'1(.*)-1', "1 each", numberunits[counter])
        numberunits[counter] = re.sub(r'2(.*)-2', "2 each", numberunits[counter])
        numberunits[counter] = re.sub(r'1-4', "1 to 4", numberunits[counter])
        numberunits[counter] = re.sub(r'1-3', "1 to 3", numberunits[counter])
        # need to encode to prevent special characters from being messed up
        numberunits[counter] = numberunits[counter].encode('Windows-1252')
        # increase the counter and move on to the next element
        counter = counter + 1

    descrip = soup.findAll("p", class_= "course-descriptions")
    counter2 = 0

    # strip out the tags
    for b in descrip:
        # loop through each description, splitting to eliminate duplicated spacing
        descrip[counter2] = descrip[counter2].text.encode('utf-8').decode('ascii', 'ignore').split()
        # join together the separated terms
        descrip[counter2] = " ".join(descrip[counter2])
        # take out the preresiquites
        descrip[counter2] = re.sub(r'Prerequisites(.*)[.]', "", descrip[counter2])
        descrip[counter2] = descrip[counter2].encode('Windows-1252')
        counter2 = counter2 + 1

    # prereqs are a bit harder, need regex to get stuff after
    # the strong italicized prereq tags and before last </p>
    match = soup.findAll("p", class_= "course-descriptions")
    counter3 = 0

    #strip out the tags
    for c in match:
        # loop through each description, splitting to eliminate duplicated spacing
        match[counter3] = match[counter3].text.encode('utf-8').decode('utf-8', 'ignore').split()
        # join together the separated terms
        match[counter3] = " ".join(match[counter3])
        # set a variable to be compared after prereq parsing, if it's the
        # same after parsing, course has no prereqs
        initialdescrip = match[counter3];
        # take out everything except for the preresiquites
        match[counter3] = re.sub(r'(.*)Prerequisites:', "", match[counter3]).lstrip()
        if match[counter3] == initialdescrip:
            match[counter3] = "none"
        match[counter3] = match[counter3].encode('Windows-1252')
        counter3 = counter3 + 1

#outfile = open("./results.csv", "wb")
#writer = csv.writer(outfile)
#writer.writerow(["Course Number", "Course Name", "Number of Units", "Description", "Prerequisites"])

    for a in zip(coursenumber, coursename, numberunits, descrip, match):
        writer.writerow(a)

    keyCount = keyCount + 1
