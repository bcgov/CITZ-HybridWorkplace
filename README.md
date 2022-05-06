[![Lifecycle:Experimental](https://img.shields.io/badge/Lifecycle-Experimental-339999)](https://github.com/bcgov/citz-HybridWorkplace)
# CITZ HybridWorkplace

## Project Introduction

This is the project repo for the 2022 CITZ IMB "Hybrid Workplace" product. We are currently completing our first phase: prototype development.Come back often as content is constantly being added. As part of that initiative we are exploring the need and benefit of a tool.

## Development Team Introduction

- Phase 2 May-August 2022 -> Currently a team of three Camosun Capstone students (@BradyMitch, @Bottle7, @ZachBourque)
- Phase 1 January-April 2022 -> Project initiation from a team of UVic Co-op Students (@aulveland, @bettesworthjayna)
- CI/CD Initiated by @poornima-sivanand
- Product Owner -> @CITZ-rwk
- Executive Project Sponsor -> @CraigShutko

## Problem Statement

The RISE  team provides a forum for the exchange of information and best practices for  civil servants wishing to improve their leadership skills. Particpants need a platform for curated resources that are easy to locate, can be commented on and discussed. Currently there are a number of different tools that fill parts of the identified need which leads to more duplication and over time a lack of use and orphaned information.

## Hypothesis

Developing a web application to support RISE and other common interest teams will assist improving team collaboration and the exchange of best practices.

Utilizing a platform that allows easy contribution of content in a moderated environment can facilitate effective exchange of information and provide streams of information to other platforms through the use of APIs.

## Goal

The goal of the CITZ Co-op/Capstone 2022 Hybrid-Workplace project team is to create a modern web application as a tool for communities to collaborate.

Objectives include:

- Apply modern application development methodology based on AGILE principles
- Create a modern web application that is intuitive and easy to use
- Store information in a central repository such as a database
- Host the solution in the BC Dev Exchange's container environment

## Project Stucture

TBD

## Running the Application

### Build
1. Navigate to project root directory.
2. Use the command: `docker-compose up --build`.
3. The containers for the client, server, and database should now be running.

### Teardown
1. Navigate to the project root directory
2. Use the command: `docker-compose down -v`.
  - Note: the `-v` flag tells docker to dispose of the volumes associated with the containers.
3. The containers for the client, server, and database should now be stopped and removed, along with their volumes.

## Services

frontend -> accessible at [http://localhost:3000](http://localhost:3000)
api -> accessible at TBD
mongo db -> instance available at exposed port 27017

## Documentation

Click [here](https://github.com/bcgov/citz-hybridworkplace/wiki) to view the project documentation.


