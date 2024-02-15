import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { readFileSync } from 'fs';

export class DynatraceActivegateStack extends cdk.Stack {
  public readonly role: iam.IRole;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'vpc', {
      availabilityZones: ["eu-west-2a", "eu-west-2b", "eu-west-2c"]
    });

    const vpcEndpoint = new ec2.InterfaceVpcEndpoint(this, 'DynatraceVPCEndpoint', {
      vpc,
      service: new ec2.InterfaceVpcEndpointService('com.amazonaws.vpce.eu-west-2.vpce-svc-087a837d5ef308cec'),
      subnets:{
        subnets: vpc.privateSubnets
      }
    });

    const prodZone = new route53.HostedZone(this, 'prod', {
      zoneName: 'bhe21058.live.dynatrace.com',
      vpcs: [vpc]
    });
    
    new route53.ARecord(this, 'prod-record', {
      zone: prodZone,
      recordName: 'bhe21058.live.dynatrace.com',
      target: {
        aliasTarget: new route53Targets.InterfaceVpcEndpointTarget(vpcEndpoint)
      }
    });

    const nonProdZone = new route53.HostedZone(this, 'nonprod', {
      zoneName: 'khw46367.live.dynatrace.com',
      vpcs: [vpc]
    });
    
    new route53.ARecord(this, 'nonprod-record', {
      zone: nonProdZone,
      recordName: 'khw46367.live.dynatrace.com',
      target: {
        aliasTarget: new route53Targets.InterfaceVpcEndpointTarget(vpcEndpoint)
      }
    });

    const userDataText = readFileSync('lib/userdata.sh', 'utf-8');
    const userData = ec2.UserData.custom(userDataText);

    const asg  = new autoscaling.AutoScalingGroup(this, 'asg', {
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.M6A,
        ec2.InstanceSize.LARGE
      ),
      
      machineImage: ec2.MachineImage.genericLinux({
        'eu-west-2': this.node.tryGetContext('amiId')
      }),
      maxCapacity: 3,
      minCapacity: 2,
      requireImdsv2: true,
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
