import json
import copydetect

# from flask_cors import CORS, cross_origin
# from flask import Flask, jsonify, request

# app = Flask(__name__)

# cors = CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'

# @app.route("/")
# @cross_origin()
# def welcome():
#     return "working!"

# @app.route("/detect")
# @cross_origin()
def detect():
    # test = request.args.get('code1')
    # test2 = request.args.get('code2')
    fp1 = copydetect.CodeFingerprint("txt1.java", 25, 1)
    fp2 = copydetect.CodeFingerprint("txt2.java", 25, 1)
    token_overlap, similarities, slices = copydetect.compare_files(fp1, fp2)
    code1, _ = copydetect.utils.highlight_overlap(fp1.raw_code, slices[0], "", "", 1)
    code2, _ = copydetect.utils.highlight_overlap(fp2.raw_code, slices[1], "", "", 1)
    #return json.dumps(code1=code1, code2=code2, similarity=similarities[0])

detect()