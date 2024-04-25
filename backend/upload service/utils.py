import io
import os
import boto3
from awsresources import *
from threading import Thread
import time
import copydetect
import os
from decimal import *
from similarity_lines import *
from flask import Flask, jsonify, request
import requests

all_files = {}

def upload_file_to_s3(file, folder_name):
    try :

        filename = file.filename
        file_src = request.files["file"].read().decode("utf-8")
        
       # make api call 
        params = {
            "submission_id": filename[:-5], # remove .java
            "question_id": folder_name,
            "src_code" : file_src
        }
        requests.post("http://localhost:5050/code-push", json=params)

        print("Called API")

        # make FileStorage from the string
        file = io.BytesIO(file_src.encode("utf-8"))

        s3.upload_fileobj(
            file,
            bucket_name,
            f'{folder_name}/{filename}',
        )

        print("File sent to ML model")

        #update submissions metadata
        pKey = str(filename.split(".")[0])
        SUBMISSIONS_METADATA.update_item(
            Key={"account_id": pKey},
            UpdateExpression="set #is_uploaded = :t",
            ExpressionAttributeNames={
                "#is_uploaded": "is_uploaded",
            },
            ExpressionAttributeValues={
                ":t": "True",
            },
            ReturnValues="UPDATED_NEW",
        )

    except Exception as e:
        print("Something Happened: ", e)
        return False

    #non-blocking call to trigger file comparisons
    t = Thread(target=trigger_comparisons, args=(folder_name, filename))
    t.start()    
    return True


def upload_zip_file_to_s3(file, folder_name):
    try:
        f = open(file, "r")
        sio = io.StringIO(f.read())
        bio = io.BytesIO(sio.read().encode('utf8'))
        s3.upload_fileobj(
            bio,
            bucket_name,
            f'{folder_name}/{file}',
        )
        #update submissions metadata
        pKey = str(file.split(".")[0])
        SUBMISSIONS_METADATA.update_item(
            Key={"account_id": pKey},
            UpdateExpression="set #is_uploaded = :t",
            ExpressionAttributeNames={
                "#is_uploaded": "is_uploaded",
            },
            ExpressionAttributeValues={
                ":t": "True",
            },
            ReturnValues="UPDATED_NEW",
        )

        f.close()

    except Exception as e:
        print("Something Happened: ", e)
        return False
    
    while True:
        try:
            os.remove(file)
            break
        except Exception as e:
            print(e)
            time.sleep(1)

    #non-blocking call to trigger file comparisons
    t = Thread(target=trigger_comparisons, args=(folder_name, file))
    t.start()    
    return True

def trigger_comparisons(folder_name, file_name):
    compThread = Thread(target=compare_submissions, args=(folder_name, file_name))
    compThread.start()
    #allow all files to be processed
    time.sleep(100)
    delete_all_cached_files()

def upload_text_as_file_to_s3(file_text, folder_name):
    try:
        s3_resource.Object(
            bucket_name,
            f'{folder_name}/newfile.txt', #hardcoded file name
        ).put(Body = file_text)
    except Exception as e:
        print("Something Happened: ", e)
        return False
    return True


#method to asynchronously process an uploaded file against other files
def compare_submissions(folder_name, file_name):
    global all_files
    #list to store all file names, to loop through in the end and delete all cached files
    all_files[file_name] = False
    #cache the reference file and generate code footprint
    ref_file_text = s3_resource.Object(bucket_name, f'{folder_name}/{file_name}').get()['Body'].read().decode('utf-8')
    cache_file(file_name, ref_file_text)
    fp1 = copydetect.CodeFingerprint(file_name,25, 1)

    #iterate through all files in the current s3 subfolder
    files_bucket = s3_resource.Bucket(bucket_name)
    for objects in files_bucket.objects.filter(Prefix=folder_name + "/"):
        curr_file_name = objects.key.split("/")[1]

        #code only runs if there is another file to perform pairwise comparison
        if curr_file_name == file_name or curr_file_name == "":
            continue
        file_text = s3_resource.Object(bucket_name, objects.key).get()['Body'].read().decode('utf-8')

        #cache the current file to read 
        cache_file(curr_file_name, file_text)
        all_files[curr_file_name] =  "False"
        #generate     
        fp2 = copydetect.CodeFingerprint(curr_file_name, 25, 1)

        #call to helper method that calls the ML model for pairwise comparison
        similar_lines = extract_lines_from_model(file_name, curr_file_name)

        token_overlap, similarities, slices = copydetect.compare_files(fp1, fp2)
        #calculate similar lines here
        file_lines, curr_file_lines = find_lines(file_name, curr_file_name, slices)

        #call async method to store the current file comparison result
        # if similarities[0] <= 0:
        #     continue 
        if similar_lines['subject_src_lines'] == [] or similar_lines['target_src_lines'] == []:
            continue
        else:
            # print("Similarity score: ", similar_lines['similarity_score'])
            # t2 = Thread(target=save_to_submissions_comparisons, args=(file_name, curr_file_name, similarities, file_lines, curr_file_lines))
            t2 = Thread(target=save_to_submissions_comparisons, args=(file_name, curr_file_name, similar_lines['similarity_score'], similar_lines['subject_src_lines'], similar_lines['target_src_lines']))
            t2.start()


#method to run ML model metho
#TODO: add reference to ML model here
def extract_lines_from_model(subject_id, target_id):
    #return a list of lists
    # make api call 
    resp = requests.get("http://localhost:5050/pairwise-similarity?subject_id={0}&target_id={1}".format(subject_id[:-5], target_id[:-5]))
    # extract the list of lists
    data = resp.json()
    return data['plagiarised_methods'][0] if len(data['plagiarised_methods']) > 0 else {'subject_src_lines': [], 'target_src_lines': []}
    


##HELPER METHODS TO MAKE LIFE EASIER
#helper method to cache file
def cache_file(file_dir: str, file_text: str) -> None:
    f = open(file_dir, "w")
    f.write(file_text)
    f.close()
   

#helper method to delete cached file
def delete_cached_file(file_dir: str) -> None:
    try:
        os.remove(file_dir)
    except Exception:
        return
    
def delete_all_cached_files():
    print("deleting files")
    for f in list(all_files.keys()):
        delete_cached_file(f)

#helper method to encode a long string and convert it to an integer
def encode_string(input_string: str) -> str:
    return str(hash(input_string))

#helper method to create a folder in the s3 bucket when we add a new question
def create_s3_folder(folder_name: str) -> None:
    k = s3.put_object(Bucket = bucket_name, Key = folder_name + '/')

#non-blocking method to save similarity scores to db
def save_to_submissions_comparisons(candidate_file: str, reference_file: str, score: tuple, candidate_lines: str, reference_lines: str) -> None:
    candidate_id = candidate_file.split(".")[0]
    reference_id = reference_file.split(".")[0]

    print("candidate_lines : ", candidate_lines)
    print("reference_lines : ", reference_lines)

    SIMILARITY_TABLE.put_item(
        Item={
            'candidate_id':  candidate_id,
            'reference_id': reference_id,
            'score': Decimal(str(score[0])[0:4]),
            "candidate_lines" : candidate_lines,
            "reference_lines": reference_lines
        }
    )

    SIMILARITY_TABLE.put_item(
        Item={
            'candidate_id':  reference_id,
            'reference_id': candidate_id,
            'score': Decimal(str(score[1])[0:4]),
            "candidate_lines" : reference_lines,
            "reference_lines": candidate_lines
        }
    )
