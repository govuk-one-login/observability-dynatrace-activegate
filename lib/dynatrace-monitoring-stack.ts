import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

interface StackProps extends cdk.StackProps {
  dynatraceAccountId: string
}

export class DynatraceMonitoringRoleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const role = new iam.Role(this, 'role', {
      roleName: 'DynatraceMonitoringRole',
      assumedBy: new iam.AccountPrincipal(props.dynatraceAccountId)
        .withConditions({
          "StringEquals": {
            "sts:ExternalId": "8ddda2c2-8a5e-450c-9c73-74a92da96e17"
          }
        })
    })

    role.addToPolicy(new iam.PolicyStatement({
      actions: [
        'cloudwatch:GetMetricData',
        'cloudwatch:GetMetricStatistics',
        'cloudwatch:ListMetrics',
        'sts:GetCallerIdentity',
        'tag:GetResources',
        'tag:GetTagKeys',
        'autoscaling:DescribeAutoScalingGroups',
        'rds:DescribeDBInstances',
        'rds:DescribeEvents',
        'rds:ListTagsForResource',
        'ec2:DescribeAvailabilityZones',
        'apigateway:GET',
        'cloudfront:ListDistributions',
        'codebuild:ListProjects',
        'dynamodb:ListTables',
        'dynamodb:ListTagsOfResource',
        'ecs:ListClusters',
        'elasticache:DescribeCacheClusters',
        'elasticloadbalancing:DescribeInstanceHealth',
        'elasticloadbalancing:DescribeListeners',
        'elasticloadbalancing:DescribeLoadBalancers',
        'elasticloadbalancing:DescribeRules',
        'elasticloadbalancing:DescribeTags',
        'elasticloadbalancing:DescribeTargetHealth',
        'lambda:ListFunctions',
        'lambda:ListTags',
        'route53:ListHostedZones',
        's3:ListAllMyBuckets',
        'sns:ListTopics',
        'sqs:ListQueues'
      ],
      resources: ['*']
    }))
  }
}