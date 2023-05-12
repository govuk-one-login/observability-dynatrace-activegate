# Digital Identity Dynatrace ActiveGate

Before running commands here, run `npm install` to install dependencies.

## ActiveGate Stack

To deploy, run: `npm cdk deploy DynatraceMonitoringRoleStack`.

Before deploying, the AWS account will require bootstrapping for use with CDK: `npm run cdk bootstrap`.

The following Secrets Manager Secrets are expected to already exist:

- `dynatrace-url` the host name of the Dynatrace SaaS tenant, i.e. 'abc12345.live.dynatrace.com'
- `dynatrace-token` a token with PaaS access to Dynatrace.

## Monitoring Role Stack

This will create a role in your account called 'DynatraceMonitoringRole'.
This role can then be used by [Dynatrace to access your AWS account](https://khw46367.live.dynatrace.com/#settings/awsmonitoring;gf=all). Add your account ID and the name of the role, and Dynatrace will automatically start ingesting metrics from your account.

To deploy, either:

- run `npm cdk deploy DynatraceMonitoringRoleStack` - this will use CDK to deploy the stack into your environment.
- run `npm cdk synth DynatraceMonitoringRoleStack` - this will use CDK to generate a CloudFormation template, which you can then deploy yourself.
