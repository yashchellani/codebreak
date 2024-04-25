import boto3
from config import *

#only declare AWS resources in this file
#aws resources are globally available

db = boto3.resource('dynamodb',
   aws_access_key_id     = AWS_ACCESS_KEY_ID,
   aws_secret_access_key = AWS_SECRET_ACCESS_KEY,
   region_name           = REGION_NAME
)

s3 = boto3.client('s3',
   aws_access_key_id     = AWS_ACCESS_KEY_ID,
   aws_secret_access_key = AWS_SECRET_ACCESS_KEY,
   region_name           = REGION_NAME
)

#s3 resource for low-level API functions. use only when the above s3 thingy doesnt work
s3_resource = boto3.resource('s3',
   aws_access_key_id     = AWS_ACCESS_KEY_ID,
   aws_secret_access_key = AWS_SECRET_ACCESS_KEY,
   region_name           = REGION_NAME
)


QUESTIONS_TABLE = db.Table("questions")
SIMILARITY_TABLE = db.Table("submission_similarities")
SUBMISSIONS_METADATA = db.Table("submission-metadata")
RECRUITMENT_CYCLES = db.Table("recruitment-cycles")
bucket_name = "uploadedcodefiles"