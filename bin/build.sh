#!/usr/bin/env bash

set -e

DEPENDENCIES=$(cat package.json | jq '.["dependencies"]' | jq keys | jq '.[]')
SOURCE_DIR=$PWD/src/samples/services
BUILD_DIR=$PWD/build/services
NAMESPACE=braintrustops
MODULE_FILES=$(ls $SOURCE_DIR/*.ts)
ARTIFACT_BUCKET=$NAMESPACE-artifacts

mkdir -p $BUILD_DIR
cd $BUILD_DIR

for MODULE_FILE in $MODULE_FILES; do
    echo "Building $MODULE_FILE"

    # setup names to reduce duplication
    MODULE_NAME=$(basename $MODULE_FILE .ts)
    FUNCTION_NAME=$NAMESPACE--$MODULE_NAME
    ARTIFACT_KEY=$FUNCTION_NAME.zip

    # compile module using typescript compiler
    $(npm bin)/tsc --outDir $MODULE_NAME $MODULE_FILE

    # create the lambda package (need to cd into dir to avoid root folder being added)
    zip -r $ARTIFACT_KEY $MODULE_NAME

    # publish lambda package to an S3 bucket
    aws s3 cp $ARTIFACT_KEY s3://$ARTIFACT_BUCKET

    # update lambda configuration with newly published package
    aws lambda update-function-code --function-name $FUNCTION_NAME \
        --s3-bucket $ARTIFACT_BUCKET \
        --s3-key $ARTIFACT_KEY
done