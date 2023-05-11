#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DynatraceActivegateStack } from '../lib/dynatrace-activegate-stack';

const app = new cdk.App();
new DynatraceActivegateStack(app, 'DynatraceActivegateStack', {
  env: { account: '145771043764', region: 'eu-west-2' }
});