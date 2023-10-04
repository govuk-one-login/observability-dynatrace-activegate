# Digital Identity Dynatrace ActiveGate

Before running commands here, run `npm install` to install dependencies.

## ActiveGate Stack

Firstly get the latest CIS ami

```bash
aws ec2 describe-images \
--owners aws-marketplace \
--filters 'Name=name,Values=*'c41d38c4-3f6a-4434-9a86-06dd331d3f9c'*' \
--query 'Images[*].[ImageId,CreationDate]' --output text | sort -k2 -r | head -n1 | awk '{ print $1 }'
```

replace the ami in the `cdk.context.json`

Linux

```bash
sed -i '' 's/"amiId": ""/"amiId": "<add the ami id here>"/' cdk.context.json
```

Mac

```bash
sed -i.bak 's/"amiId": ""/"amiId": "<add the ami id here>"/' cdk.context.json
rm -f cdk.context.json.bak
```

***DO NOT COMMIT THE CHANGE OF THE amiID in cdk.context.json***

Now to deploy, run: `npm run cdk deploy DynatraceActivegateStack`.

Before deploying, the AWS account will require bootstrapping for use with CDK: `npm run cdk bootstrap`.

The following Secrets Manager Secrets are expected to already exist:

- `dynatrace-url` the host name of the Dynatrace SaaS tenant, i.e. 'abc12345.live.dynatrace.com'
- `dynatrace-token` a token with PaaS access to Dynatrace.

Deployments can also be completed using CloudFormation. 

You can now run a synth command, as with a deploy you will need to add the ami to `cdk.context.json` before you begin

```bash
npm run cdk synth DynatraceActivegateStack
aws cloudformation update-stack --stack-name DynatraceActivegateStack \
--template-body file://cdk.out/DynatraceActivegateStack.template.json \
--capabilities CAPABILITY_IAM
```

If this is in a local account and it is the first time you will need to run `update-stack`

## Testing locally

Just run

`npm test`
