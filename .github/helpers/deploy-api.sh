#!/bin/bash

# script to process slam-api deployment config template and deploy it to a given namespace

oc process -f /home/runner/work/citz-imb-slam-api/citz-imb-slam-api/openshift/templates/citz-imb-slam-api/dc.yaml --namespace=$NAMESPACE \
    -p APPLICATION_NAME=$APPLICATION_NAME \
    -p LICENSE_PLATE=$LICENSE_PLATE \
    -p ENVIRONMENT=$ENVIRONMENT | \
    oc apply -f -
