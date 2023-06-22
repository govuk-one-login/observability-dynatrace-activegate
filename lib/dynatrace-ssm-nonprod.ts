import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm'

interface StackProps extends cdk.StackProps {
}


export class DynatraceSSMNonProdStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const ssmParameter = new ssm.StringParameter(this, 'observabilitySsmParameter', {
      parameterName: '/observability/dynatrace-account-id',
      stringValue: '985486846182',
    });

    const ssmParameterExternalId = new ssm.StringParameter(this, 'observabilitySsmExternalIdParameter', {
      parameterName: '/observability/dynatrace-external-id',
      stringValue: '28ab39cf-a1a0-4bee-93c1-601830b6eef0',
    });
  }
}
