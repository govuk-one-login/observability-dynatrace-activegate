# Digital Identity Dynatrace ActiveGate

## ActiveGate Stack

## Monitoring Role Stack

This will create a role in your account called 'DynatraceMonitoringRole'.
This role can then be used by [Dynatrace to access your AWS account](https://khw46367.live.dynatrace.com/#settings/awsmonitoring;gf=all). Add your account ID and the name of the role, and Dynatrace will automatically start ingesting metrics from your account.

To deploy, either:

- run `npm cdk deploy DynatraceMonitoringRoleStack` - this will use CDK to deploy the stack into your environment.
- run `npm cdk synth DynatraceMonitoringRoleStack` - this will use CDK to generate a CloudFormation template, which you can then deploy yourself.
