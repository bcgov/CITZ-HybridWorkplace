# How to Build and Deploy on Openshift

### Scripts

Before deploying API server, a mongodb pod should be deployed in advance because API server needs database connection parameters extracted from the mongodb pod.

**Build and deploy with a branch and version tag**

`$ openshift/scripts/server.sh feature 1.0.0`

**clean buildconfig and deployed resources**

`$ openshift/scripts/server.app clean`

### Create S2I buildconfig

#### Create buildconfig from CLI

```
$ oc new-build https://github.com/bcgov/citz-dst-capstone-2021\#${BRANCH} --context-dir=server -l build=rdsi-server --name rdsi-server 
...
--> Creating resources with label build=rdsi-server ...
    imagestream.image.openshift.io "rdsi" created
    buildconfig.build.openshift.io "rdsi" created
--> Success
```

The image and buildconfig have been created with label `build=rdsi-server`

Use `--dry-run` option to check what the result will be.

Check the resources with the label

```
$ oc get all -l build=rdsi-server
NAME                                         TYPE     FROM                          LATEST
buildconfig.build.openshift.io/rdsi-server   Source   Git@feature/create-projects   2

NAME                                     TYPE     FROM          STATUS     STARTED          DURATION
build.build.openshift.io/rdsi-server-1   Source   Git@5ef2ca4   Complete   21 minutes ago   8m36s
build.build.openshift.io/rdsi-server-2   Source   Git@5ef2ca4   Complete   12 minutes ago   7m35s

NAME                                         IMAGE REPOSITORY                                                       TAGS    UPDATED
imagestream.image.openshift.io/rdsi-server   image-registry.apps.silver.devops.gov.bc.ca/adccd1-tools/rdsi-server   0.1.0   5 minutes ago
```

#### Download buildconfig

`$ oc get all -l build=rdsi-server -o yaml > openshift/server/bc.yaml`

#### Convert buildconfig to template

`$ npx @bcgov/oc-template to-template openshift/server/bc.yaml`

Refer to [oc-templatation](https://github.com/patricksimonian/oc-templatation) to see what it does.

1. Delete the lines related to the details of the current objects like build, managedFields, resourceVersion, selfLink, uid, and timestamp

1. Define parameters

    ```
    ...
            kind: ImageStreamTag
            name: "rdsi-server:${TAG}"
    ...
    parameters:
      - name: TAG
        required: true
        description: version as an image tag
    ```

#### Delete all objects with label `label=rdsi-server`

`$ oc delete all -l build=rdsi-server`

#### Create buildconfig using template

```
$ oc process -f openshift/server/bc.yaml -p TAG=0.1.0 | oc apply -f -
buildconfig.build.openshift.io/rdsi-server created
imagestream.image.openshift.io/rdsi-server created
```

### Build an image

`$ oc start-build rdsi-server`

### Create deployment template

#### Deploy from CLI

```
$ oc new-app rdsi-server:0.1.0
...
--> Creating resources ...
    deployment.apps "rdsi-server" created (dry run)
    service "rdsi-server" created (dry run)
--> Success (dry run)
```

#### Convert deployment config to template

1. Download deployment config

    `$ oc get all -l app=rdsi-server -o yaml > openshift/server/dc.yaml`
  
1. Convert to template

    `$ npx @bcgov/oc-template to-template openshift/server/dc.yaml`
  
1. Strip out template
1. Define parameters

  Non-string values should be enclosed by two braces.

  ```
  ...
    kind: Service
    spec:
      ports:
        - name: ${PORT}-tcp
          port: ${{PORT}}
          protocol: TCP
          targetPort: ${{PORT}}
  ...
  parameters:
  - name: PORT
    required: true
    description: service open port
  ```
  
1. Define environment variables

    These env variables are used in `src/config/env/index.ts`.

    ```
    spec:
      containers:
        - image: >-
          ...
          env:
            - name: PORT
              value: ${PORT}
            - name: MONGODB_URI
              value: "mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}:27017/"
            - name: MONGODB_DB_MAIN
              value: ${MONGODB_DB_MAIN}
    ``` 

### Deploy from a template

Check the following mongodb environment variables from the terminal of the mongodb pod and set as parameter options

- MONGODB_DATABASE
- MONGODB_PASSWORD
- MONGODB_USER

```
$ oc process -f openshift/server/dc.yaml -p MONGODB_USER=${MONGODB_USER} -p MONGODB_PASSWORD=${MONGODB_PASSWORD} -p MONGODB_URL=10.98.183.112 -p MONGODB_DB_MAIN=${MONGODB_DATABASE} -p PORT=8080 | oc apply -f -
$ oc expose service rdsi-server
```

### Build and deploy client app

```
$ oc process -f openshift/client/bc.yaml -p TAG=0.1.0 | oc apply -f -
buildconfig.build.openshift.io/rdsi-app created
imagestream.image.openshift.io/rdsi-app created

$ oc start-build rdsi-app
build.build.openshift.io/rdsi-app-1 started

$ oc process -f openshift/client/dc.yaml -p PORT=8080 | oc apply -f -
service/rdsi-app unchanged
deployment.apps/rdsi-app created

$ oc expose service rdsi-app
route.route.openshift.io/rdsi-app exposed

```

### Allow communication between containers

Apply deny-other-namespaces from the sample network policies to allow all traffic from the same namespace while denying traffic from other namespaces.
