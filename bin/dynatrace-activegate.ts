#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DynatraceActivegateStack } from '../lib/dynatrace-activegate-stack';

const app = new cdk.App();

  new DynatraceActivegateStack(
  app,
  'DynatraceActivegateStack',
  {
    env: { 
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION 
  }});
