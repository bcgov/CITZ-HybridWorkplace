'use strict';
const {OpenShiftClientX} = require('@bcgov/pipeline-cli')
const {OpenShiftClient} = require('@bcgov/pipeline-cli')
const path = require('path');

module.exports = (settings)=>{
  const phases = settings.phases
  const options = settings.options
  const phase=options.env
  const changeId = phases[phase].changeId
  const oc=new OpenShiftClientX(Object.assign({'namespace':phases[phase].namespace}, options));
  var objects = []

  const mongoCredential = {};
  const mongoSecret = new OpenShiftClient({namespace:phases[phase].namespace}).get('secrets/mongodb')[0];
  mongoCredential['user'] = Buffer.from(mongoSecret.data['database-user'], 'base64').toString('utf-8');
  mongoCredential['pass'] = Buffer.from(mongoSecret.data['database-password'], 'base64').toString('utf-8');

  const templatesLocalBaseUrl =oc.toFileUrl(path.resolve(__dirname, '../../openshift'))

  objects.push(...oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/mongodb/dc.yaml`, {
    'param':{
      'NAME': 'mongodb',
    }
  }))

  objects.push(...oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/server/dc.yaml`, {
    'param':{
      'NAME': `${phases[phase].name}-server`,
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
      'NAMESPACE': phases[phase].namespace,
      'MONGODB_USER': mongoCredential['user'],
      'MONGODB_PASSWORD': mongoCredential['pass'],
      'MONGODB_URL' : 'mongodb',
      'MONGODB_DB_MAIN' : phases[phase].name
    }
  }))

//  objects.push(...oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/client/dc.yaml`, {
//    'param':{
//      'NAME': `${phases[phase].name}-client`,
//      'SUFFIX': phases[phase].suffix,
//      'VERSION': phases[phase].tag,
//      'NAMESPACE': phases[phase].namespace,
//      'PORT': 8080,
//      'CLUSTER_DOMAIN': 'apps.silver.devops.gov.bc.ca',
//    }
//  }))



  oc.applyRecommendedLabels(objects, phases[phase].name, phase, `${changeId}`, phases[phase].instance)
  oc.importImageStreams(objects, phases[phase].tag, phases.build.namespace, phases.build.tag)
  oc.applyAndDeploy(objects, phases[phase].instance)

}
