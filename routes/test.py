import sys
import json
import numpy as np
import pandas as pd
from sklearn import linear_model
from sklearn.preprocessing import StandardScaler
import mysql.connector
import numpy as np
import collections
import random
import matplotlib
import pylab as p
import matplotlib.pyplot as plt 
from mysql.connector import Error
from sklearn.model_selection import cross_val_score
from sklearn.model_selection import train_test_split
from sklearn.svm import SVR
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





def read_in():
    lines = sys.stdin.readlines()
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])


def main():
    # get our data as an array from read_in()
    #lines = read_in()
    pp = 40

    mycursor = mydb.cursor()
    mydb.commit()
    #sql = "SELECT price,category_id FROM `orders`,'order_info' where id_retailer='%s' and o_number=Order_number"
    #adr = (p, )

    mycursor.execute("SELECT price,category_id,Required_quantity FROM `order_info`,`orders` where id_retailer='%s' and o_number=Order_number" % pp)
    myresult = mycursor.fetchall()

    mycursor.execute("SELECT COUNT(Serial_number) as count FROM `product`,`product_details` where  ser_pro=Serial_number" )
    countpro = mycursor.fetchall()

    
    mycursor.execute("SELECT product.*,product_details.*,category.*,company.Name as name_company FROM `product`,`product_details`,`category`,`company` where  ser_pro=Serial_number and id_Category=category.id  and product.id_company=company.id")
    rows = mycursor.fetchall()

    if len(myresult)==0 :
        #print(countpro[0][0])
        if countpro[0][0]>= 40 :
             randint=random.randint(30, countpro[0][0]-1)
        else :
            randint=countpro[0][0]-1

        #print(randint)
        objects_list = []
      

        for row in rows:

           
            d = collections.OrderedDict()
            # print(predictedCO2[0])
            d['Name'] = row[0]
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
            objects_list.append(d)

        j = json.dumps(objects_list[randint-30:randint], default=date_handler)
        #j = json.dumps(s[0:3])
        print(j)

        ####################################

    else:
        #scale = StandardScaler()
        from sklearn.linear_model import LogisticRegression
        import matplotlib.pyplot as plt
        df = pd.DataFrame(myresult, columns=['price', 'category', 'quantity'])
        dd=df.drop_duplicates(subset=["price", "category"],keep='last')
        X = dd[['price','category']]
        y = dd['quantity']
        #suum=max(y)
        #e=np.true_divide(y, suum)
        #print(i)
        #e=np.around(e, decimals=0)
        normalized_y=(y-y.min())/(y.max()-y.min())
       
        y=np.around(normalized_y, decimals=0)
        # Fit regression model
        clf = LogisticRegression(random_state=0,max_iter=100).fit(X, y)
        #print(clf.score(X,y))
        '''
        from sklearn.naive_bayes import GaussianNB
        clf = GaussianNB()
        clf.fit(X, y)
        GaussianNB()
        #print(clf.score(X, y, sample_weight=None))
        
        '''
        '''
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.4, random_state=0)
        from sklearn.preprocessing import StandardScaler  
        sc = StandardScaler()
        X_train = sc.fit_transform(X_train)
        X_test = sc.transform(X_test)
        from sklearn.ensemble import RandomForestRegressor

        regressor = RandomForestRegressor(n_estimators=30, random_state=0)
        regressor.fit(X_train, y_train)
        y_pred = regressor.predict(X_test)
        from sklearn import metrics

        print('Mean Absolute Error:', metrics.mean_absolute_error(y_test, y_pred))
        print('Mean Squared Error:', metrics.mean_squared_error(y_test, y_pred))
        print('Root Mean Squared Error:', np.sqrt(metrics.mean_squared_error(y_test, y_pred)))
        '''
        objects_list = []
        list1 = []

        for row in rows:

            predictedCO2 = clf.predict([[row[10], row[13]]])
            d = collections.OrderedDict()
            list1.append(predictedCO2[0])
            # print(predictedCO2[0])
            d['Name'] = row[0]
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
        #s = sorted(objects_list, key=lambda x: (x["count"].any()), reverse=True)
        #print(d['count'])
        #print(objects_list)
        # print(objects_list)
        # print("*****************************************")
        # print(s)

        # for row in objects_list:
        # print(row)
        # print(objects_list[1])
        
        objects_list.sort(key=lambda x: x['count'], reverse=True)
     
        for i in objects_list:
            i.pop('count')
        #print(s[1])
        j = json.dumps(objects_list[0:30], default=date_handler)
        #j = json.dumps(s[0:3], default=date_handler)
        
        print(j)

        

# Start process
if __name__ == '__main__':
    main()
