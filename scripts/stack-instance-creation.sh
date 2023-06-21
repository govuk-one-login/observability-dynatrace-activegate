#!/bin/bash


read -p "Comma seperated list of non production account numbers: " non_prod_account_numbers_commas
read -p "Comma seperated list of production account numbers e.g. 111222333444,222333444555: " prod_account_numbers_commas
read -p "Version of the Dynatrace ActiveGate repo to be deployed": version

hyphenate_version=$(echo $version | sed s/\\./-/g)
prod_account_numbers=$(echo $prod_account_numbers_commas | sed 's/,/\" \"/g' | sed 's/^/\"/' | sed 's/$/\"/g')
non_prod_account_numbers=$(echo $non_prod_account_numbers_commas | sed 's/,/\" \"/g' | sed 's/^/\"/' | sed 's/$/\"/g')


if [ -n "$non_prod_account_numbers_commas" ]; then

  echo "Deploying stack set to NonProd accounts"
  aws cloudformation create-stack-instances --stack-set-name di-devplat-obv-dt-ssm-nonprod --regions eu-west-2 --accounts $non_prod_account_numbers
  pending=$(aws cloudformation list-stack-instances --stack-set-name di-devplat-obv-dt-ssm-nonprod | jq ".Summaries[].StackInstanceStatus.DetailedStatus" | grep PENDING | wc -l)
  running-$(aws cloudformation list-stack-instances --stack-set-name di-devplat-obv-dt-ssm-nonprod | jq ".Summaries[].StackInstanceStatus.DetailedStatus" | grep RUNNING | wc -l)

  while [ "$pending" -gt 0 && "$running" -gt 0 ]
  do
    sleep 5
    pending=$(aws cloudformation list-stack-instances --stack-set-name di-devplat-obv-dt-ssm-nonprod | jq ".Summaries[].StackInstanceStatus.DetailedStatus" | grep PENDING | wc -l)
    running-$(aws cloudformation list-stack-instances --stack-set-name di-devplat-obv-dt-ssm-nonprod | jq ".Summaries[].StackInstanceStatus.DetailedStatus" | grep RUNNING | wc -l)
  done

  aws cloudformation create-stack-instances --stack-set-name di-devplat-obv-dynatrace-iam-$hyphenate_version --regions eu-west-2 --accounts $non_prod_account_numbers

else

  echo "No NonProd accounts provided so nothing to deploy"

fi

if [ -n "$prod_account_numbers_commas" ]; then

  echo "Deploying stack set to Prod accounts"
  aws cloudformation create-stack-instances --stack-set-name di-devplat-obv-dt-ssm-prod --regions eu-west-2 --accounts $prod_account_numbers
  pending=$(aws cloudformation list-stack-instances --stack-set-name di-devplat-obv-dt-ssm-prod | jq ".Summaries[].StackInstanceStatus.DetailedStatus" | grep PENDING | wc -l)
  running-$(aws cloudformation list-stack-instances --stack-set-name di-devplat-obv-dt-ssm-prod | jq ".Summaries[].StackInstanceStatus.DetailedStatus" | grep RUNNING | wc -l)

  while [ "$pending" -gt 0 && "$running" -gt 0 ]
  do
    sleep 5
    pending=$(aws cloudformation list-stack-instances --stack-set-name di-devplat-obv-dt-ssm-prod | jq ".Summaries[].StackInstanceStatus.DetailedStatus" | grep PENDING | wc -l)
    running-$(aws cloudformation list-stack-instances --stack-set-name di-devplat-obv-dt-ssm-prod | jq ".Summaries[].StackInstanceStatus.DetailedStatus" | grep RUNNING | wc -l)
  done

  aws cloudformation create-stack-instances --stack-set-name di-devplat-obv-dynatrace-iam-$hyphenate_version --regions eu-west-2 --accounts $prod_account_numbers

else

  echo "No Prod accounts provided so nothing to deploy"

fi

