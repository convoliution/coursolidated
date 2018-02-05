import requests
from bs4 import BeautifulSoup
import re
import math
import csv

#df = pd.read_csv('experimentalCapesCSV.csv')
#new_column = pd.DataFrame({})

courseDepartment = (raw_input("Enter CAPES department: ")).upper()
courseNumber = (raw_input("Enter CAPES course number: ")).upper()

# url of CAPES to collect info from, change the keyword for each coursename in csv
# courseDepartment = 'MATH'
# courseNumber = '184A'
url = 'http://www.cape.ucsd.edu/responses/Results.aspx?Name=&CourseNumber=' + courseDepartment + '%20' + courseNumber

# this gets the part of the HTML that we want
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
}

response = requests.get(url, headers=headers)

soup = BeautifulSoup(response.content, 'lxml')

# change _ctXX_ each time by using regex, find all average grades
capesGrades = re.findall(r'<span id="ctl00_ContentPlaceHolder1_gvCAPEs_ctl\d\d_lblGradeReceived">(.*)</span>', response.content)

# clean this up, replacing N/A with '0' and just having the decimal grades
counter = 0
for element in capesGrades:
    if len(re.findall(r'\d\.\d\d', element)) == 0:
        capesGrades[counter] = 0.00
    else:
        capesGrades[counter] = re.sub(r'(.*)\s\(', '', element)
        capesGrades[counter] = float(re.sub(r'\)', '', capesGrades[counter]))
    counter = counter + 1

# change _ctXX_ each time by using regex, find all % recommended instructors
capesInstructorPercentage = re.findall(r'<span id="ctl00_ContentPlaceHolder1_gvCAPEs_ctl\d\d_lblPercentRecommendInstructor">(.*)</span>', response.content)

# cast everything to float
counter = 0
for element in capesInstructorPercentage:
    capesInstructorPercentage[counter] = re.sub(r'\s(.*)', '', element)
    capesInstructorPercentage[counter] = float(capesInstructorPercentage[counter])
    counter = counter + 1

# change _ctXX_ each time by using regex, find all average hours
capesHours = re.findall(r'<span id="ctl00_ContentPlaceHolder1_gvCAPEs_ctl\d\d_lblStudyHours">(.*)</span>', response.content)

# cast everything to float
counter = 0
for element in capesHours:
    capesHours[counter] = float(element)
    counter = counter + 1

# change _ctXX_ each time by using regex, find total number of students per class enrolled
capesTotalStudents = re.findall(r'</a>\s*</td><td>\w\w\w\w</td><td align="right">\d+</td><td align="right">', response.content)

# clean out the total number per course
counter = 0
#\d gets the year and the total enrolled students, we only want the second one
for element in capesTotalStudents:
    capesTotalStudents[counter] = int((re.findall(r'\d+', element))[1])
    counter = counter + 1

# change _ctXX_ each time by using regex, find total CAPES submitted
capesTotalEvaluations = re.findall(r'<span id="ctl00_ContentPlaceHolder1_gvCAPEs_ctl\d+_lblCAPEsSubmitted" ItemStyle-HorizontalAlign="Right">(.*)</span>', response.content)

# cast everything to int
counter = 0
for element in capesTotalEvaluations:
    capesTotalEvaluations[counter] = int(element)
    counter = counter + 1

# fina all instructors for each quarter. \s* is included for pesky whitespaces
capesInstructors = re.findall(r'<tr class=("even"|"odd")>\s*<td>(.*)</td><td', response.content)

# clean out instructors, remove whitespace
counter = 0
# right now capesInstructors is in tuple form so I have to slice out the second element
# and set the capesInstructors[index] to that name
for element in capesInstructors:
    capesInstructors[counter] = re.findall(r'\S+\, \S+', str(element[1]))
    counter= counter+1

# find average grade (weighted)
averageGrade = 0
summation = 0
ignoredEnrollment = 0
for index in range(len(capesGrades)):
    # if the grade is N/A, don't add it
    if capesGrades[index] == 0.0:
        ignoredEnrollment = ignoredEnrollment + capesTotalStudents[index]
    else:
        summation = summation + (float(capesGrades[index])*int(capesTotalStudents[index]))
averageGrade = summation/(sum(capesTotalStudents)-ignoredEnrollment)

stdAverageGrade = 0
# calculate the standard deviation
for index in range(len(capesGrades)):
    # if the grade is N/A, don't add it
    if capesGrades[index] == 0.0:
        continue
    else:
        stdAverageGrade = stdAverageGrade + ((capesGrades[index] - averageGrade) ** 2)

stdAverageGrade = math.sqrt(stdAverageGrade/len(capesGrades))

# find average hours spent
averageHours = 0
secondSum = 0
for index in range(len(capesHours)):
        secondSum = secondSum + (float(capesHours[index])*int(capesTotalStudents[index]))
averageHours = secondSum/sum(capesTotalStudents)

stdAverageHours = 0
# calculate the standard deviation
for index in range(len(capesHours)):
    stdAverageHours = stdAverageHours + ((capesHours[index] - averageHours) ** 2)

stdAverageHours = math.sqrt(stdAverageHours/len(capesHours))

# projected difficultyRating as per all the info above
difficultyRating = 0
hoursHalf = 5 * (averageHours / 15)
if hoursHalf > 5:
    hoursHalf = 5
gradeHalf = (-3.33*averageGrade) + 13.33
if gradeHalf < 0:
    gradeHalf = 0
if gradeHalf > 5:
    gradeHalf = 5
difficultyRating = hoursHalf + gradeHalf
# adjective describing the class
adjective = ""
if (difficultyRating < 4):
    adjective = "easy"
elif (difficultyRating < 7):
    adjective = "medium"
else:
    adjective = "hard"

print ("The weighted average grade is " + "%.2f" % averageGrade + " across " + str(len(capesGrades)) + " different quarters, with a standard deviation of " + "%.2f" % stdAverageGrade)
print ("The weighted average study hours spent is " + "%.2f" % averageHours + " hours across " + str(len(capesGrades)) + " different quarters, with a standard deviation of " + "%.2f" % stdAverageHours)
print (courseDepartment + " " + courseNumber + " is a(n) " + adjective + " class! On a scale of 1-10 of difficulty, it is a " + "%.1f" % difficultyRating + "/10!")
