# Digital Identity Dynatrace ActiveGate

Before running commands here, run `npm install` to install dependencies.

## ActiveGate Stack

To deploy, run: `npm run cdk deploy DynatraceActivegateStack`.

Before deploying, the AWS account will require bootstrapping for use with CDK: `npm run cdk bootstrap`.

The following Secrets Manager Secrets are expected to already exist:

- `dynatrace-url` the host name of the Dynatrace SaaS tenant, i.e. 'abc12345.live.dynatrace.com'
- `dynatrace-token` a token with PaaS access to Dynatrace.

Deployments can also be completed using CloudFormation. To do this you will need to run a synth command

```bash
npm run cdk synth DynatraceActivegateStack
aws cloudformation update-stack --stack-name DynatraceActivegateStack \
--template-body file://cdk.out/DynatraceActivegateStack.template.json \
--capabilities CAPABILITY_IAM
```

## Testing locally

Just run

`npm test`
