#!/usr/bin/env bash

aws cloudformation create-stack \
    --profile lymph \
    --stack-name LymphStack \
    --template-body file://test-infrastructure.json \
    --capabilities CAPABILITY_IAM

#aws cloudformation update-stack \
#    --profile lymph \
#    --stack-name LymphStack \
#    --template-body file://test-infrastructure.json \
#    --capabilities CAPABILITY_IAM

#    "HelloServiceProxyGet": {
#      "Type": "AWS::ApiGateway::Method",
#      "Properties": {
#        "RestApiId": {
#          "Ref": "RestApi"
#        },
#        "ResourceId": {
#          "Ref": "HelloServiceProxy"
#        },
#        "HttpMethod": "GET",
#        "AuthorizationType": "NONE",
#        "Integration": {
#          "Type": "AWS_PROXY",
#          "IntegrationHttpMethod": "GET",
#          "Uri": ""
#        }
#      }
#    }

#LambdaExecutionRole:
#    Type: "AWS::IAM::Role"
#    Properties:
#      AssumeRolePolicyDocument:
#        Version: "2012-10-17"
#        Statement:
#          - Effect: Allow
#            Principal:
#              Service: lambda.amazonaws.com
#            Action: "sts:AssumeRole"
