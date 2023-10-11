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
      'yum update',
      'yum install gcc openssl openssl-devel',
      'wget https://curl.se/download/curl-8.4.0.tar.gz',
      'tar -xvf curl-8.4.0.tar.gz curl-8.4.0',
      'cd curl-8.4.0',
      'sed -i \'s/for ac_option in --version -v -V -qversion -version; do/for ac_option in --version -v -qversion -version; do/g\' ./configure',
      './configure --with-openssl; make && make install',
      'cd -',
      'export DT_TOKEN=$(aws secretsmanager get-secret-value --region eu-west-2 --secret-id dynatrace-token --query SecretString --output text)',
      'export DT_URL=$(aws secretsmanager get-secret-value --region eu-west-2 --secret-id dynatrace-url --query SecretString --output text)',
      'wget -O Dynatrace-ActiveGate-Linux-x86.sh "https://$DT_URL/api/v1/deployment/installer/gateway/unix/latest?arch=x86" --header="Authorization: Api-Token $DT_TOKEN"',
      'wget -O Dynatrace-OneAgent-Linux-x86.sh "https://$DT_URL/api/v1/deployment/installer/agent/unix/default/latest?arch=x86" --header="Authorization: Api-Token $DT_TOKEN"',
      'chmod +x Dynatrace-ActiveGate-Linux-x86.sh',
      'chmod +x Dynatrace-OneAgent-Linux-x86.sh',
      './Dynatrace-ActiveGate-Linux-x86.sh',
      './Dynatrace-OneAgent-Linux-x86.sh'
    );

    const asg  = new autoscaling.AutoScalingGroup(this, 'asg', {
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.M5A,
        ec2.InstanceSize.LARGE
      ),
      
      machineImage: ec2.MachineImage.genericLinux({
        'eu-west-2': this.node.tryGetContext('amiId')
      }),
      maxCapacity: 3,
      minCapacity: 2,
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

    asg.role.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: [
          'acm-pca:ListCertificateAuthorities',
          'apigateway:GET',
          'apprunner:ListServices',
          'appstream:DescribeFleets',
          'appsync:ListGraphqlApis',
          'athena:ListWorkGroups',
          'autoscaling:DescribeAutoScalingGroups',
          'cloudformation:ListStackResources',
          'cloudfront:ListDistributions',
          'cloudhsm:DescribeClusters',
          'cloudsearch:DescribeDomains',
          'cloudwatch:GetMetricData',
          'cloudwatch:GetMetricStatistics',
          'cloudwatch:ListMetrics',
          'codebuild:ListProjects',
          'datasync:ListTasks',
          'dax:DescribeClusters',
          'directconnect:DescribeConnections',
          'dms:DescribeReplicationInstances',
          'dynamodb:ListTables',
          'dynamodb:ListTagsOfResource',
          'ec2:DescribeAvailabilityZones',
          'ec2:DescribeInstances',
          'ec2:DescribeNatGateways',
          'ec2:DescribeSpotFleetRequests',
          'ec2:DescribeTransitGateways',
          'ec2:DescribeVolumes',
          'ec2:DescribeVpnConnections',
          'ecs:ListClusters',
          'eks:ListClusters',
          'elasticache:DescribeCacheClusters',
          'elasticbeanstalk:DescribeEnvironmentResources',
          'elasticbeanstalk:DescribeEnvironments',
          'elasticfilesystem:DescribeFileSystems',
          'elasticloadbalancing:DescribeInstanceHealth',
          'elasticloadbalancing:DescribeListeners',
          'elasticloadbalancing:DescribeLoadBalancers',
          'elasticloadbalancing:DescribeRules',
          'elasticloadbalancing:DescribeTags',
          'elasticloadbalancing:DescribeTargetHealth',
          'elasticmapreduce:ListClusters',
          'elastictranscoder:ListPipelines',
          'es:ListDomainNames',
          'events:ListEventBuses',
          'firehose:ListDeliveryStreams',
          'fsx:DescribeFileSystems',
          'gamelift:ListFleets',
          'glue:GetJobs',
          'inspector:ListAssessmentTemplates',
          'kafka:ListClusters',
          'kinesis:ListStreams',
          'kinesisanalytics:ListApplications',
          'kinesisvideo:ListStreams',
          'lambda:ListFunctions',
          'lambda:ListTags',
          'lex:GetBots',
          'logs:DescribeLogGroups',
          'mediaconnect:ListFlows',
          'mediaconvert:DescribeEndpoints',
          'mediapackage-vod:ListPackagingConfigurations',
          'mediapackage:ListChannels',
          'mediatailor:ListPlaybackConfigurations',
          'opsworks:DescribeStacks',
          'qldb:ListLedgers',
          'rds:DescribeDBClusters',
          'rds:DescribeDBInstances',
          'rds:DescribeEvents',
          'rds:ListTagsForResource',
          'redshift:DescribeClusters',
          'robomaker:ListSimulationJobs',
          'route53:ListHostedZones',
          'route53resolver:ListResolverEndpoints',
          's3:ListAllMyBuckets',
          'sagemaker:ListEndpoints',
          'sns:ListTopics',
          'sqs:ListQueues',
          'storagegateway:ListGateways',
          'sts:GetCallerIdentity',
          'swf:ListDomains',
          'tag:GetResources',
          'tag:GetTagKeys',
          'transfer:ListServers',
          'workmail:ListOrganizations',
          'workspaces:DescribeWorkspaces'
        ],
        resources: ['*']
      })
    );

    this.role = asg.role;
  }
}
