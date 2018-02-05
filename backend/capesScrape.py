import csv
import requests
from bs4 import BeautifulSoup

#url = 'http://www.cape.ucsd.edu/responses/Results.aspx?Name=&CourseNumber=CSE+110'
# for other testing purposes
url = 'http://www.ucsd.edu/catalog/courses/BIOL.html'
response = requests.get(url)
html = response.content

soup = BeautifulSoup(html, "lxml")



table = soup.find('tbody', attrs={'class': 'stripe'})

print html
#list_of_rows = []
#for row in table.findAll('tr'):
#    list_of_cells = []
#    for cell in row.findAll('td'):
#        text = cell.text.replace('&nbsp;', '')
#        list_of_cells.append(text)
#    list_of_rows.append(list_of_cells)

#outfile = open("./capesReviewsMATH184.csv", "wb")
#writer = csv.writer(outfile)
#writer.writerows(list_of_rows)
