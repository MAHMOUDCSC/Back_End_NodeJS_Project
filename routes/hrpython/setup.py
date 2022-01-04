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
   

# Start process
if __name__ == '__main__':
    main()
