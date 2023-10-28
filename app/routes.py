from app import app
from flask import render_template, request, redirect, url_for, flash
import pandas as pd
from json import loads, dumps

@app.route('/get_data/', methods=['GET'])
def get_data():
    df = pd.read_csv(r'app\data\psc_advertisements.csv')

    # reformat names for consistency
    upper_names = []
    for name in df.columns:
        upper_names.append(name.lower())
    df.columns = upper_names
    # print(df.columns)

    # add month column
    df['creation_date_month'] = df['creation_date'].astype(str).str[2:5]
    data = df[['organization_e','creation_date_month','total_submitted_sup']]

    # export to be useable in JS
    data_json = loads(data.to_json())

    return data_json

@app.route('/',methods=['GET','POST'])
def index():
    # df = pd.read_csv('app\data\psc_internal_mobility.csv')
    # data = df[['department_e','fiscal_year','mob_type_e','count']].reset_index(drop=True)#.loc[df['department_e']=='Statistics Canada'].reset_index(drop=True)
    # data_json = loads(data.to_json())

    df = pd.read_csv(r'app\data\psc_advertisements.csv')

    # reformat names for consistency
    upper_names = []
    for name in df.columns:
        upper_names.append(name.lower())
    df.columns = upper_names
    print(df.columns)

    # add month column
    df['creation_date_month'] = df['creation_date'].astype(str).str[2:5]
    data = df[['organization_e','creation_date_month','total_submitted_sup']]

    # export to be useable in JS
    data_json = loads(data.to_json())
    #data_json = dumps(data_json)

    # print(type(data_json))

    return render_template('index.html',chartData=data_json)
