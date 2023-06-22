#!/bin/bash

# Services not queried due to denial by permission boundaries so check manually
# Amazon AppStream
# Amazon SageMaker Batch Transform Jobs	
# Amazon SageMaker Endpoint Instances
# Amazon SageMaker Endpoints
# Amazon SageMaker Ground Truth	
# Amazon SageMaker Processing Jobs	
# Amazon SageMaker Training Jobs

# You will need to check manually
# Billing
# Chatbot

# Deprected so ignored
# elastic-inference

# Not available in London region so ignored, manually confirm
# AWS App Runner
# Amazon CloudSearch
# Amazon Elastic Transcoder
# Amazon MediaTailor
# AWS IoT Analytics
# AWS RoboMaker


managed_services=""

services=(
   "acm list-certificates|AWS Certificate Manager Private Certificate Authority"
   "mq list-brokers|Amazon MQ"
   "apigatewayv2 get-apis|Amazon API Gateway"
   "appsync list-graphql-apis|AWS AppSync"
   "athena list-work-groups|Amazon Athena"
   "rds describe-db-clusters|Amazon Aurora"
   "keyspaces list-keyspaces|Amazon Keyspaces"
   "cloudhsmv2 describe-clusters|AWS CloudHSM"
   "codebuild list-projects|AWS CodeBuild"
   "connect list-instances|Amazon Connect"
   "eks list-clusters|Amazon Elastic Kubernetes Service (EKS)"
   "datasync list-tasks|AWS DataSync"
   "dax describe-clusters|Amazon DynamoDB Accelerator (DAX)"
   "dms describe-replication-instances|Amazon Database Migration Service"
   "docdb describe-db-clusters|Amazon DocumentDB"
   "directconnect describe-connections|AWS Direct Connect"
   "dynamodb list-tables|Amazon DynamoDB (built-in)"
   "ec2 describe-volumes|Amazon EBS (built-in)"
   "ec2 describe-instances|Amazon EC2 (built-in)"
   "ec2 describe-spot-fleet-requests|Amazon EC2 Spot Fleet"
   "elasticache describe-cache-clusters|Amazon ElastiCache (EC)"
   "elasticbeanstalk describe-environments|AWS Elastic Beanstalk"
   "efs describe-file-systems|Amazon Elastic File System (EFS)"
   "emr list-clusters|Amazon Elastic Map Reduce (EMR)"
   "es list-domain-names|Amazon Elasticsearch Service (ES)"
   "events list-event-buses|Amazon EventBridge"
   "fsx describe-file-systems|Amazon FSx"
   "gamelift list-fleets|Amazon GameLift"
   "glue get-jobs|AWS Glue"
   "inspector list-assessment-templates|Amazon Inspector"
   "kafka list-clusters|Amazon Managed Streaming for Kafka"
   "kinesisvideo list-streams|Amazon Kinesis Video Streams"
   "lambda list-functions|AWS Lambda (built-in)"
   "lex-models get-bots|Amazon Lex"
   "logs describe-log-groups|Amazon CloudWatch Logs"
   "mediaconnect list-flows|AWS Elemental MediaConnect"
   "mediaconvert describe-endpoints|Amazon MediaConvert"
   "mediapackage list-channels|Amazon MediaPackage Live"
   "mediapackage-vod list-packaging-configurations|Amazon MediaPackage Video on Demand"
   "ec2 describe-nat-gateways|Amazon VPC NAT Gateways"
   "neptune describe-db-clusters|Amazon Neptune"
   "opsworks describe-stacks|AWS OpsWorks"
   "polly list-speech-synthesis-tasks|Amazon Polly"
   "qldb list-ledgers|Amazon QLDB"
   "rds describe-db-instances|Amazon RDS (built-in)"
   "redshift describe-clusters|Amazon Redshift"
   "route53 list-hosted-zones|Amazon Route 53"
)

for service in "${services[@]}"
do
  query=$(echo $service | awk -F "|" '{print $1}')
  service_description=$(echo $service | awk -F "|" '{print $2}')
  
  service_test=$(aws $query | wc -l)
  if [ "$service_test" -gt 3 ]
  then
    managed_services+="${service_description},"
  fi

done


# Deviations to structure

service_test=$(aws cloudfront list-distributions | wc -l)

if [ "$service_test" -gt 0 ]
then
  managed_services+="Amazon CloudFront,"
fi

service_test=$(aws cognito-identity list-identity-pools --max-results 1 | wc -l)

if [ "$service_test" -gt 3 ]
then
  managed_services+="Amazon Cognito,"
fi

service_test=$(aws ecs list-clusters  | wc -l)

if [ "$service_test" -gt 3 ]
then
  managed_services+="Amazon Elastic Container Service (ECS),"
  managed_services+="Amazon ECS ContainerInsights,"
fi

service_test=$(aws autoscaling describe-auto-scaling-groups | wc -l)

if [ "$service_test" -gt 3 ]
then
  managed_services+="Amazon EC2 Auto Scaling,"
  managed_services+="Amazon EC2 Auto Scaling (built-in),"
fi


service_test_1=$(aws iot list-ca-certificates | wc -l)
service_test_2=$(aws iot list-custom-metrics | wc -l)
service_test_3=$(aws iot list-dimensions | wc -l)
service_test_4=$(aws iot list-fleet-metrics | wc -l)
service_test_5=$(aws iot list-jobs | wc -l)
service_test_6=$(aws iot list-streams | wc -l)


if [[ "$service_test_1" -gt 3 || "$service_test_2" -gt 3 || "$service_test_3" -gt 3 || "$service_test_4" -gt 3 || "$service_test_5" -gt 3 || "$service_test_6" -gt 3 ]]
then
  managed_services+="AWS Internet of Things (IoT),"
fi

 # greater than 4 in the if statement
services=(
  "kinesisanalytics list-applications|Amazon Kinesis Data Analytics"
  "firehose list-delivery-streams|Amazon Kinesis Data Firehose"
  "kinesis list-streams|Amazon Kinesis Data Streams"
  "rekognition list-collections|Amazon Rekognition"
  "route53resolver list-resolver-endpoints|Amazon Route 53 Resolver"
)

service_test=$(aws kinesisanalytics list-applications | wc -l)

for service in "${services[@]}"
do
  query=$(echo $service | awk -F "|" '{print $1}')
  service_description=$(echo $service | awk -F "|" '{print $2}')
  
  service_test=$(aws $query | wc -l)
  if [ "$service_test" -gt 4 ]
  then
    managed_services+="${service_description},"
  fi

done

service_test=$(aws elbv2 describe-load-balancers | wc -l)

if [ "$service_test" -gt 3 ]
then
  managed_services+="AWS Elastic Load Balancing (ELB) (built-in),"
  managed_services+="AWS Application and Network Load Balancer (built-in)"
fi

service_test=$(aws s3 ls | wc -l)

if [ "$service_test" -gt 0 ]
then
  managed_services+="Amazon S3,"
  managed_services+="Amazon S3 (built-in),"
fi

service_test_1=$(aws servicecatalog search-products | wc -l)
service_test_2=$(aws aws servicecatalog list-portfolios | wc -l)
service_test_3=$(aws servicecatalog list-service-actions| wc -l)

if [[ "$service_test_1" -gt 8 || "$service_test_2" -gt 3 || "$service_test_3" -gt 3 ]]
then
  managed_services+="AWS Internet of Things (IoT),"
fi

echo $managed_services | tr "," "\n" | sort