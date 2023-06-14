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
  }
}
