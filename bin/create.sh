#!/usr/bin/env bash

set -e

SOURCE_DIR=$PWD/src/samples/services
BUILD_DIR=$PWD/build/services

NAMESPACE=braintrustops
ARTIFACT_BUCKET=$NAMESPACE-artifacts
MODULE_FILES=$(ls $SOURCE_DIR/*.ts)

for MODULE_FILE in $MODULE_FILES; do
    MODULE_NAME=$(basename $MODULE_FILE .ts)
    FUNCTION_NAME=$NAMESPACE--$MODULE_NAME
    ARTIFACT_KEY=$FUNCTION_NAME.zip

    echo "Creating initial function for: $FUNCTION_NAME"
    echo "=============================================================="

    echo "compiling $MODULE_NAME with typescript"
    $(npm bin)/tsc --outDir $MODULE_NAME $MODULE_FILE

    echo "zipping $MODULE_NAME to lambda package"
    zip -r $ARTIFACT_KEY $MODULE_NAME

    echo "copy function package $ARTIFACT_KEY to s3 bucket $ARTIFACT_BUCKET"
    aws s3 cp $ARTIFACT_KEY s3://$ARTIFACT_BUCKET

    echo "creating lambda function $FUNCTION_NAME"
    aws lambda create-function --function-name $FUNCTION_NAME \
        --runtime 'nodejs6.10' \
        --role 'arn:aws:iam::535016723572:role/braintrustops' \
        --handler $NAMESPACE/$MODULE_NAME.handler \
        --code "S3Bucket=$ARTIFACT_BUCKET,S3Key=$ARTIFACT_KEY"

    echo "creating staging alias"
    aws lambda create-alias --function-name $FUNCTION_NAME \
        --name staging \
        --function-version '$LATEST'

    echo "adding permission for API gateway to execute staging"
    aws lambda add-permission \
        --function-name arn:aws:lambda:us-east-1:535016723572:function:$FUNCTION_NAME:staging \
        --source-arn 'arn:aws:execute-api:us-east-1:535016723572:2ckdx83ybg/*/GET/hello/*' \
        --principal apigateway.amazonaws.com \
        --statement-id $(uuidgen) \
        --action lambda:InvokeFunction

    echo "publishing initial version"
    INITIAL_VERSION=$(aws lambda publish-version --function-name $FUNCTION_NAME \
        --description 'initial version' | jq --raw-output '.Version')

    echo "creating production alias"
    aws lambda create-alias --function-name $FUNCTION_NAME \
        --name production \
        --function-version $INITIAL_VERSION

    echo "adding permission for API gateway to execute production"
    aws lambda add-permission \
        --function-name arn:aws:lambda:us-east-1:535016723572:function:$FUNCTION_NAME:production \
        --source-arn 'arn:aws:execute-api:us-east-1:535016723572:2ckdx83ybg/*/GET/hello/*' \
        --principal apigateway.amazonaws.com \
        --statement-id $(uuidgen) \
        --action lambda:InvokeFunction
done
