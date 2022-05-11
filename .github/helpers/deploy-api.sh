#!/bin/bash

# script to process slam-api deployment config template and deploy it to a given namespace

oc process -f /home/runner/work/citz-hybridworkplace/citz-hybridworkplace/openshift/templates/citz-hybridworkplace/api-dc.yaml --namespace=$NAMESPACE \
    -p APPLICATION_NAME=$APPLICATION_NAME \
    -p LICENSE_PLATE=$LICENSE_PLATE \
    -p ENVIRONMENT=$ENVIRONMENT | \
    oc apply -f -
