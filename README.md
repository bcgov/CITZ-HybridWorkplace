[![Lifecycle:Experimental](https://img.shields.io/badge/Lifecycle-Experimental-339999)](https://github.com/bcgov/citz-HybridWorkplace)

  

# CITZ Hybrid Workplace

  

## Project Introduction

  

This is the project repo for the 2022 CITZ: IMB "Hybrid Workplace" product. 

We are currently completing our second phase: MVP development. 
Come back often as content is constantly being added. 

An in-progress version of the project is available here:
[The Neighbourhood (gov.bc.ca)](https://hwp-react-d63404-dev.apps.silver.devops.gov.bc.ca/)

  

## Development Team Introduction

  

- Phase 2 May-August 2022 -> Currently a team of three Camosun Capstone students (@BradyMitch, @Bottle7, @ZachBourque) 
	- Includes two co-op students working on testing: @dbarkowsky (Camosun), @mattsiel (UVic)

- Phase 1 January-April 2022 -> Project initiation from a team of UVic Co-op Students (@aulveland, @bettesworthjayna)

- CI/CD Initiated by @poornima-sivanand

- Product Owner -> @CITZ-rwk

- Executive Project Sponsor -> @CraigShutko

  

## Problem Statement
  
The RISE team aims to provide a forum for the exchange of information and best practices for civil servants wishing to improve their leadership skills. Participants need a platform for curated resources that are easy to locate and that can be commented on and discussed. 

Currently, there are a number of different tools which only fill parts of the identified need. 
This leads to more duplication and over time, a lack of product use, and orphaned information.
  
## Hypothesis
  
Developing a web application to support RISE and other common interest teams will assist improving team collaboration and the exchange of best practices.
  
Utilizing a platform that allows easy contribution of content in a moderated environment can facilitate effective exchange of information and provide streams of information to other platforms through the use of APIs.

  
## Goal

The goal of the CITZ Co-op/Capstone 2022 Hybrid Workplace project team is to create a modern web application as a tool for communities to collaborate.


Objectives include:

- Apply modern application development methodology based on AGILE principles

- Create a modern web application that is intuitive and easy to use

- Store information in a central repository such as a database

- Host the solution in the BC Dev Exchange's container environment

  

## Project Structure

  

Please [see the Wiki](https://github.com/bcgov/CITZ-HybridWorkplace/wiki) for more information.

  

## Running the Application

  ### Requirements
  - Docker
  - Node.js (for development only)

### Build for Production

1. Navigate to project root directory where `docker-compose.yaml` is located.

2. Use the command: `docker-compose --profile prod up -d --build`.

3. The containers for the client, server, and database should now be running.
  - Confirm this with `docker ps` to see if containers (hwp-api & mongodb) are running and marked as healthy.

If you have **npm** installed, use `npm run prod` from the project root as a shortcut.

### Build for Development

This version allows for hotloading of the API and frontend. Containers can stay up while changes are made. 
There is a short delay for changes as the service restarts/recompiles. 
Changes to the node_modules folder will require a rebuild of the containers. 

1. Navigate to project root directory where `docker-compose.yaml` is located.

2. Use the command: `docker-compose --profile dev up --build`.

3. The containers for the client, server, and database should now be running. They are ready to use as soon as the API reports a connection to Mongo and the frontend reports the page has complied.

If you have **npm** installed, use `npm run dev` from the project root as a shortcut.
  
### Teardown

1. Navigate to the project root directory.

2. Use the command: `docker-compose down -v`.

	- Note: the `-v` flag tells docker to dispose of the volumes associated with the containers.

3. The containers for the client, server, and database should now be stopped and removed, along with their volumes.

  

## Services

  

Frontend -> accessible at [http://localhost:8080](http://localhost:8080)

API -> accessible at [http://localhost:5000/api](http://localhost:5000/api)

MongoDB -> instance available at exposed port 27017

  

## Mongo Configuration

  To change the name of the database you must change the current database name 'TheNeighbourhood' in the following files: 
* ./mongo/init/create-db.js 
* .env
 

## Removing Local MongoDB Data

  To 'RESET' your local database, delete everything inside the ./mongo/data directory.

## ENV Variable Configuration

The .env file must be created by using .env-template as a template.
  
|ENV Key | Description | Example |
|--|--|--|
|REACT_APP_API_PORT | API listens on this port | 5000 |
|REACT_APP_LOCAL_DEV | Toggle for URI paths in local environment | true \|\| false
|REACT_APP_API_REF | URI pointing to API location | localhost \|\| http://...
|API_VERSION | Used in setting path to API routes | 1
|ENABLE_API_REQUEST_LOGS | Toggle for API logging | true \|\| false
|FRONTEND_REF | URI pointing to frontend location | localhost \|\| http://...
|FRONTEND_PORT | Port used by frontend | 8080
|MONGO_REF | Name of MongoDB container name | mongodb
|MONGO_PORT | Port used by MongoDB | 27017
|MONGO_ROOT_USERNAME | Used to log in to MongoDB CLI | admin
|MONGO_ROOT_PASSWORD | Used to log in to MongoDB CLI | admin
|MONGO_DB_USERNAME | Used when API connects to MongoDB | db-admin
|MONGO_DB_PASSWORD | Used when API connects to MongoDB | db-admin
|MONGO_DATABASE_NAME | Name of database | TheNeighbourhood
|JWT_SECRET | Used to verify JWT tokens | aVerySecureSecret
|JWT_REFRESH_SECRET | Used to verify  refresh tokens | aVerySecureSecret
|JWT_TOKEN_EXPIRY | Time until authentication token expires | 4h
|GC_NOTIFY_REGISTRATION_TEMPLATE | Reference to GC Notify template | See [GC Notify](https://notification.canada.ca/features) page
|GC_NOTIFY_NEW_COMMUNITY_INSTANT_TEMPLATE | Reference to GC Notify template | See [GC Notify](https://notification.canada.ca/features) page
|GC_NOTIFY_NEW_COMMUNITIES_DAILY_TEMPLATE | Reference to GC Notify template | See [GC Notify](https://notification.canada.ca/features) page
|GC_NOTIFY_API_KEY_SECRET | Secret used in GC Notify implementation | See [GC Notify](https://notification.canada.ca/features) page
|ENABLE_GC_NOTIFY_TRIAL_MODE | Toggle for trial account mode | true \|\| false
|ENABLE_GC_NOTIFY | Toggle GC Notify feature | true \|\| false
|TOGGLE_KEYCLOAK_AUTH | Toggle Keycloak implementation | true \|\| false
|KEYCLOAK_CLIENT_SECRET | Secret used in Keycloak authorization | aVerySecureSecret
|CONFIDENTIAL_PORT | Used in creation of Keycloak object | 0
|AUTH_SERVER_URL | URL for Keycloak authorization server | https://...
|REALM | Used in creation of Keycloak object | standard
|SSL_REQUIRED | Used in creation of Keycloak object | external
|RESOURCE | Used in creation of Keycloak object | abc-123
|ENV_FILE | Path from root folder to required .env file | .env

## Documentation

Click [here](https://github.com/bcgov/citz-hybridworkplace/wiki) to view the project documentation.