import sys
import json
import numpy as np
import pandas as pd
import sklearn
from sklearn import linear_model
import mysql.connector
import numpy as np
import collections
#import psycopg2
from mysql.connector import Error
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="myproject"
)


def date_handler(obj):
    if hasattr(obj, 'isoformat'):
        return obj.isoformat()
    else:
        raise TypeError


'''
class create_dict(dict): 
  
    # __init__ function 
    def __init__(self): 
        self = dict() 
          
    # Function to add key:value 
    def add(self, key, value): 
        self[key] = value
'''
# Read data from stdin


def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])


def main():
    # get our data as an array from read_in()
    #lines = read_in()
    p = 31

    mycursor = mydb.cursor()
    mydb.commit()
    #sql = "SELECT price,category_id FROM `orders`,'order_info' where id_retailer='%s' and o_number=Order_number"
    #adr = (p, )

    mycursor.execute(
        "SELECT price,category_id,Required_quantity FROM `order_info`,`orders` where id_retailer='%s' and o_number=Order_number" % p)
    myresult = mycursor.fetchall()

    df = pd.DataFrame(myresult, columns=['price', 'category', 'quantity'])
    mycursor.execute("SELECT product.*,product_details.*,category.*,company.Name as name_company FROM `product`,`product_details`,`category`,`company` where  ser_pro=Serial_number and id_Category=category.id  and product.id_company=company.id")
    rows = mycursor.fetchall()
    #Sprint(rows)
    # myresult=numpy.array(myresult)
    # print(df['Price'])

    #path2 = './routes/ex1data2.txt'
    #df = pd.read_csv(path2, header=None, names=['Size', 'Bedrooms', 'Price'])
    # print(df)

    #

    X = df[['price', 'category']]
    y = df['quantity']

    regr = linear_model.LinearRegression()
    regr.fit(X, y)

    # predict the CO2 emission of a car where the weight is 2300g, and the volume is 1300ccm:

    #predictedCO2 = regr.predict([[200, 5]])

    # print(predictedCO2)
    objects_list = []
    list1 = []

    for row in rows:

        predictedCO2 = regr.predict([[row[10], row[13]]])
        d = collections.OrderedDict()
        list1.append(predictedCO2[0])
        # print(predictedCO2[0])
        d['name'] = row[0]
        d['id_Category'] = row[1]
        d['Serial_number'] = row[2]
        d['Image'] = row[3]
        d['id_company'] = row[4]
        d['description'] = row[5]
        d['Production_date'] = row[6]
        d['Expiry_date'] = row[7]
        d['Available_number'] = row[8]
        d['Weight'] = row[9]
        d['price'] = row[10]
        d['ser_pro'] = row[11]
        d['id'] = row[13]
        d['type'] = row[14]
        d['name_company'] = row[15]
        d['count'] = predictedCO2[0]
        objects_list.append(d)
        # objects_list.sort_values(by=objects_list[])
    s = sorted(objects_list, key=lambda x: (x['count']), reverse=True)
    # print(objects_list)
    # print("*****************************************")
    # print(s)

    # for row in objects_list:
    # print(row)
    # print(objects_list[1])
    j = json.dumps(s[0:30], default=date_handler)
    #j = json.dumps(s[0:3])
    print(j)


# Start process
if __name__ == '__main__':
    main()
