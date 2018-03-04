#!/usr/bin/env bash

if [[ $1 == "create" ]]; then
    aws cloudformation create-stack \
        --profile lymph \
        --stack-name LymphStack \
        --template-body file://test-infrastructure.json \
        --capabilities CAPABILITY_IAM
else
    aws cloudformation update-stack \
        --profile lymph \
        --stack-name LymphStack \
        --template-body file://test-infrastructure.json \
        --capabilities CAPABILITY_IAM
fi
