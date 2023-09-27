#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DynatraceActivegateStack } from '../lib/dynatrace-activegate-stack';
import { DynatraceMonitoringRoleStack } from '../lib/dynatrace-monitoring-stack';
import { DynatraceSSMProdStack } from '../lib/dynatrace-ssm-prod';
import { DynatraceSSMNonProdStack } from '../lib/dynatrace-ssm-nonprod';

const app = new cdk.App();
const dynatraceActivegateStack = new DynatraceActivegateStack(
  app,
  'DynatraceActivegateStack',{});

new DynatraceMonitoringRoleStack(app, 'DynatraceMonitoringRoleStack', {
  synthesizer: new cdk.CliCredentialsStackSynthesizer(),
  dynatraceActivegateRole: dynatraceActivegateStack.role
});

new DynatraceSSMProdStack(app, 'DynatraceSSMProdStack', {
  synthesizer: new cdk.CliCredentialsStackSynthesizer(),
});

new DynatraceSSMNonProdStack(app, 'DynatraceSSMNonProdStack', {
  synthesizer: new cdk.CliCredentialsStackSynthesizer(),
});
