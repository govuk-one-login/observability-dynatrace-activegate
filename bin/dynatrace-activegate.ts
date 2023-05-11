#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DynatraceActivegateStack } from '../lib/dynatrace-activegate-stack';
import { DynatraceMonitoringRoleStack } from '../lib/dynatrace-monitoring-stack';

const app = new cdk.App();
const dynatraceActivegateStack = new DynatraceActivegateStack(app, 'DynatraceActivegateStack', {
  env: { account: '841529299698', region: 'eu-west-2' }
});

new DynatraceMonitoringRoleStack(app, 'DynatraceMonitoringRoleStack', {
  synthesizer: new cdk.CliCredentialsStackSynthesizer(),
  dynatraceAccountId: dynatraceActivegateStack.account
})
