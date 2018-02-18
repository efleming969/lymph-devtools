#!/usr/bin/env bash

set -e

SOURCE_DIR=$PWD/src/samples/services

NAMESPACE=braintrustops
MODULE_FILES=$(ls $SOURCE_DIR/*.ts)

for MODULE_FILE in $MODULE_FILES; do
    MODULE_NAME=$(basename $MODULE_FILE .ts)
    FUNCTION_NAME=$NAMESPACE--$MODULE_NAME

    echo "publishing latest version"
    VERSION=$(aws lambda publish-version --function-name $FUNCTION_NAME \
        --description 'creating release' | jq --raw-output '.Version')

    echo "point production alias to published version"
    aws lambda update-alias --function-name $FUNCTION_NAME \
        --name production \
        --function-version $VERSION
done
