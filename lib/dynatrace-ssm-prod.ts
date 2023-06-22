import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm'

interface StackProps extends cdk.StackProps {
}


export class DynatraceSSMProdStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const ssmParameter = new ssm.StringParameter(this, 'observabilitySsmParameter', {
      parameterName: '/observability/dynatrace-account-id',
      stringValue: '841529299698',
    });

    const ssmParameterExternalId = new ssm.StringParameter(this, 'observabilitySsmExternalIdParameter', {
      parameterName: '/observability/dynatrace-external-id',
      stringValue: '8ddda2c2-8a5e-450c-9c73-74a92da96e17',
    });
  }
}
