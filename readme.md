# Lymph DevTools

Utilities for working with "rich" client applications.

# Build Server Setup

## dependencies

    sudo yum update
    sudo yum install git python2-pip docker
    aws configure
    sudo service docker start
    sudo usermod -a -G docker ec2-user
    sudo systemctl enable docker

    pip install --user boto3 docker

# API Gateway and Lambda Notes

In order to associate API Gateway stages to a specific lambda function and an alias, one can use "stage variables".  These are variables that can be configured per deployment stage and allow you to dynamically pick a function-name, version, or event an alias.  They are configured in the method execution section of the API Method, under "integration request".  Set the function-name value to something like: `lambda-function-name:${stageVariables.alias}`.

Samples of creating an alias for a newly created lambda function, plus providing the necessary permission to the api gateway resource

```bash
#!/bin/bash

NAMESPACE=braintrustops
MODULE_NAME=hello

FUNCTION_NAME=$NAMESPACE-$MODULE_NAME

aws lambda create-alias --function-name $FUNCTION_NAME --name staging --function-version '$LATEST'

aws lambda add-permission \
    --function-name arn:aws:lambda:us-east-1:535016723572:function:$FUNCTION_NAME:staging \
    --source-arn 'arn:aws:execute-api:us-east-1:535016723572:2ckdx83ybg/*/GET/hello/*' \
    --principal apigateway.amazonaws.com \
    --statement-id $(uuidgen) \
    --action lambda:InvokeFunction

aws lambda publish-version --function-name $FUNCTION_NAME --description 'initial version'

aws lambda add-permission \
    --function-name arn:aws:lambda:us-east-1:535016723572:function:$FUNCTION_NAME:production \
    --source-arn 'arn:aws:execute-api:us-east-1:535016723572:2ckdx83ybg/*/GET/hello/*' \
    --principal apigateway.amazonaws.com \
    --statement-id $(uuidgen) \
    --action lambda:InvokeFunction
```
        
## Publishing new version and promoting to production

```bash
FUNCTION_NAME=lambda-hello-node

NEW_VERSION=$(
    aws lambda publish-version --function-name $FUNCTION_NAME --description 'some version info' \
  | jq --raw-output '.Version')

aws lambda update-alias --function-name $FUNCTION_NAME --name production --function-version $NEW_VERSION 
```

## Update lambda code with published package

```bash
aws lambda update-function-code --function-name $FUNCTION_NAME \
    --s3-bukcet braintrustops \
    --s3-key $MODULE_NAME.zip
```

## Create a lambda function

```bash
NAMESPACE=braintrustops
MODULE_NAME=hello
FUNCTION_NAME="$NAMESPACE--$MODULE_NAME"

aws lambda create-function --function-name "$FUNCTION_NAME" \
    --runtime 'nodejs6.10' \
    --role 'arn:aws:iam::535016723572:role/braintrustops' \
    --handler "$NAMESPACE/$MODULE_NAME.handler" \
    --code "S3Bucket=$NAMESPACE-artifacts,S3Key=$MODULE_NAME.zip" 
```

# Backlog

* create build system that can automatically run in CI tool, like Bitbucket Pipelines

# CloudFormation

These are notes on using CloudFormation to create resource for the application

## Creating Stacks

* when creating a stack you may need to provide a list of capabilities for certain types of resource creation
* in order to create a stack, an authorized identity is required

`arn:aws:lambda:us-east-1:535016723572:function:lymph--hello-queries`

                arn:aws:apigateway:<region>:lambda:path/2015-03-31/functions/arn:aws:lambda:<region>:<account-id>:function:CreateUserCLOUDFORM/invocations

