import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

interface StackProps extends cdk.StackProps {
  dynatraceActivegateRole: iam.IRole;
}

export class DynatraceMonitoringRoleStack extends cdk.Stack {


  dynatraceAccountIdRef = new cdk.CfnDynamicReference(
    cdk.CfnDynamicReferenceService.SSM,
    'dynatrace-account-id',
  );

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const role = new iam.Role(this, 'role', {
      roleName: 'DynatraceMonitoringRole',
      assumedBy: new iam.CompositePrincipal(
        new iam.AccountPrincipal('509560245411'),
        new iam.AccountPrincipal(this.dynatraceAccountIdRef),
        new iam.ArnPrincipal(props.dynatraceActivegateRole.roleArn)
      ).withConditions({
        StringEquals: {
          'sts:ExternalId': '8ddda2c2-8a5e-450c-9c73-74a92da96e17'
        }
      })
    });

    //These policies should be readonly
    role.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          'acm-pca:ListCertificateAuthorities',
          'apigateway:GET',
          'athena:ListWorkGroups',
          'autoscaling:DescribeAutoScalingGroups',
          'cloudfront:ListDistributions',
          'cloudwatch:GetMetricData',
          'cloudwatch:GetMetricStatistics',
          'cloudwatch:ListMetrics',
          'codebuild:ListProjects',
          'dynamodb:ListTables',
          'dynamodb:ListTagsOfResource',
          'ec2:DescribeAvailabilityZones',
          'ec2:DescribeInstances',
          'ec2:DescribeVolumes',
          'ecs:ListClusters',
          'elasticache:DescribeCacheClusters',
          'elasticloadbalancing:DescribeInstanceHealth',
          'elasticloadbalancing:DescribeListeners',
          'elasticloadbalancing:DescribeLoadBalancers',
          'elasticloadbalancing:DescribeRules',
          'elasticloadbalancing:DescribeTags',
          'elasticloadbalancing:DescribeTargetHealth',
          'events:ListEventBuses',
          'glue:GetJobs',
          'lambda:ListFunctions',
          'lambda:ListTags',
          'logs:DescribeLogGroups',
          'rds:DescribeDBInstances',
          'rds:DescribeEvents',
          'rds:ListTagsForResource',
          'route53:ListHostedZones',
          's3:ListAllMyBuckets',
          'sns:ListTopics',
          'sqs:ListQueues',
          'sts:GetCallerIdentity',
          'tag:GetResources',
          'tag:GetTagKeys'
        ],
        resources: ['*']
      })
    );
  }
}
