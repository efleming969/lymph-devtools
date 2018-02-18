# Lymph DevTools

Utilities for working with "rich" client applications.

# build server setup

## initial dependencies

sudo yum update
sudo yum install git python2-pip docker
aws configure
sudo service docker start
sudo usermod -a -G docker ec2-user
sudo systemctl enable docker

## build server dependencies
pip install --user boto3 docker
