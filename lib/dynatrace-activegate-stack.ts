import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class DynatraceActivegateStack extends cdk.Stack {
  public readonly role: iam.IRole;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'vpc', {
      maxAzs: 1
    });

    const userData = ec2.UserData.forLinux();

    userData.addCommands(
      'export DT_TOKEN=$(aws secretsmanager get-secret-value --region eu-west-2 --secret-id dynatrace-token --query SecretString --output text)',
      'export DT_URL=$(aws secretsmanager get-secret-value --region eu-west-2 --secret-id dynatrace-url --query SecretString --output text)',
      'wget -O Dynatrace-ActiveGate-Linux-x86.sh "https://$DT_URL/api/v1/deployment/installer/gateway/unix/latest?arch=x86" --header="Authorization: Api-Token $DT_TOKEN"',
      'wget -O Dynatrace-OneAgent-Linux-x86.sh "https://$DT_URL/api/v1/deployment/installer/agent/unix/default/latest?arch=x86" --header="Authorization: Api-Token $DT_TOKEN"',
      'chmod +x Dynatrace-ActiveGate-Linux-x86.sh',
      'chmod +x Dynatrace-OneAgent-Linux-x86.sh',
      './Dynatrace-ActiveGate-Linux-x86.sh',
      './Dynatrace-OneAgent-Linux-x86.sh'
    );

    const amiId = process.env.AMI_ID;
    const asg   = new autoscaling.AutoScalingGroup(this, 'asg', {
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.M6A,
        ec2.InstanceSize.LARGE
      ),
      
      machineImage: ec2.MachineImage.genericLinux({
        'eu-west-2': '${amiId}',
      }),
      maxCapacity: 3,
      minCapacity: 2,
      desiredCapacity: 2,
      userData
    });

    const dynatraceToken = secretsmanager.Secret.fromSecretNameV2(
      this,
      'dynatrace-token',
      'dynatrace-token'
    );
    const dynatraceUrl = secretsmanager.Secret.fromSecretNameV2(
      this,
      'dynatrace-url',
      'dynatrace-url'
    );
    dynatraceToken.grantRead(asg.role);
    dynatraceUrl.grantRead(asg.role);

    asg.role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore')
    );
    asg.role.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['sts:AssumeRole'],
        resources: ['*']
      })
    );

    this.role = asg.role;
  }
}
