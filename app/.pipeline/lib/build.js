'use strict';
const {OpenShiftClientX} = require('@bcgov/pipeline-cli')
const path = require('path');

module.exports = (settings)=>{
  const phases=settings.phases
  const options = settings.options
  const oc=new OpenShiftClientX(Object.assign({'namespace':phases.build.namespace}, options));
  const phase='build'
  var objects = []

  const templatesLocalBaseUrl =oc.toFileUrl(path.resolve(__dirname, '../../openshift'))

  objects.push(...oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/client/bc.yaml`, {
    'param':{
      'NAME': `${phases[phase].name}-client`,
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
      'GIT_URL': oc.git.url,
      'GIT_BRANCH': oc.git.branch.name,
    }
  }));

  objects.push(...oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/server/bc.yaml`, {
    'param':{
      'NAME': `${phases[phase].name}-server`,
      'SUFFIX': phases[phase].suffix,
      'VERSION': phases[phase].tag,
      'GIT_URL': oc.git.url,
      'GIT_BRANCH': oc.git.branch.name,
    }
  }));



  oc.applyRecommendedLabels(objects, phases[phase].name, phase, phases[phase].changeId, phases[phase].instance)
  oc.applyAndBuild(objects)
}
