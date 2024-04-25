import os 
from utils import *
from awsresources import *
import boto3
from boto3.dynamodb.conditions import Key
import decimal

from flask_cors import CORS, cross_origin
from flask import Flask, jsonify, request

import zipfile

app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route("/health")
def health_check():
    return jsonify({'health check': 'Service is Healthy!'}), 200


@app.route("/questions", methods = ["POST"])
@cross_origin()
def create_question():
    question_title = request.json.get("question_title")
    question_description = request.json.get("question_description")
    cs_hr = request.json.get("cs_hr") 

    question_key = encode_string(question_title)
    create_s3_folder(question_key)

    resp = QUESTIONS_TABLE.put_item(
        Item={
            'question_hash':  question_key,
            'title': question_title,
            'question_description': question_description,
            'cs_hr': cs_hr
        }
    )
    return resp


#upload file method uploads a response file to the relevant s3 bucket
@app.route("/upload_file/<encoded_title>", methods = ["POST"])
@cross_origin()
def upload_file(encoded_title):
    f = request.files.getlist('file')

    for file in f:
        if upload_file_to_s3(file, encoded_title):
            continue
        else:
            return jsonify({'error!': 'Internal server error'}), 500
    return jsonify({"result": "resource created!"}), 201


#extract files from a zip and merge all of them into a single .java file, identified by the filename of the zip
@app.route('/upload_zipfile/<encoded_title>', methods=['POST'])
def uploadzip(encoded_title):
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}),500
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}),500
    
    if not file.filename.endswith('.zip'):
        return jsonify({'error': 'Invalid file type. Must be a .zip file.'}),500
    
    savedfilename = file.filename.split(".")[0] + ".java"

    try:
        with zipfile.ZipFile(file, 'r') as zip_ref:
            # Extract all files in the zip file
            zip_ref.extractall()
            
            # Combine all files into a single file
            with open(savedfilename, 'w') as outfile:
                for filename in zip_ref.namelist():
                    with open(filename, 'r', encoding='latin-1') as infile:
                    
                        outfile.write(infile.read())
                for filename in zip_ref.namelist():
                    if filename != savedfilename:
                        os.remove(filename)     
        upload_zip_file_to_s3(savedfilename, encoded_title)
        return jsonify({'message': 'File uploaded and processed successfully'}), 201
    
    except zipfile.BadZipFile:
        return jsonify({'error': 'Invalid zip file'}), 500


#get a list of scores for a certain candidate
@app.route("/comparison/<candidate_id>", methods = ["GET"])
@cross_origin()
def get_similar_codes_by_candidate(candidate_id):
    query_key = candidate_id
    query_result = SIMILARITY_TABLE.query(
        KeyConditionExpression= Key('candidate_id').eq(query_key)
    )
    query_result["Items"].sort(key = lambda x : x['score'], reverse = True)
    return jsonify(query_result['Items'])


@app.route("/question_count/<c_id>", methods = ["GET"])
@cross_origin()
def get_question_count_by_cycle_id(c_id):

    response = QUESTIONS_TABLE.query(
        Select="COUNT",
        KeyConditionExpression=Key("question_hash").begins_with("") & Key("cycleid").eq(c_id),
        ConsistentRead=True,
        Limit=180,
    )
    
    return jsonify(response['Count'])

@app.route("/question_count_update/<c_id>/<operation>", methods = ["PATCH"])
def update_question_count_for_cycle(c_id , operation):

    qtyToChange = -1
    if operation == "add":
        qtyToChange = 1

    response = RECRUITMENT_CYCLES.query(
        KeyConditionExpression=Key('cycle_id').eq(c_id) & Key('workyear').eq(c_id.split("-")[0])
    )
    qnQty = str(int(response['Items'][0]['question_quantity']) + qtyToChange)

    return (RECRUITMENT_CYCLES.update_item(
        Key = {
            'cycle_id': c_id,
            'workyear': c_id.split("-")[0]
        },
        ExpressionAttributeNames = { '#val': 'question_quantity' },
        UpdateExpression = 'SET #val = :qnQty',
        ExpressionAttributeValues = { ':qnQty': qnQty},
        ReturnValues = 'UPDATED_NEW',
    ))



if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
