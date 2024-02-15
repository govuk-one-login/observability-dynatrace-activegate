#!/bin/sh

mkdir -p /var/lib/dynatrace/gateway/config/
cat > /var/lib/dynatrace/gateway/config/custom.properties <<EOF
[aws_monitoring]
aws_monitoring_enabled = true
aws_client_regions = "eu-west-2;eu-west-1;us-east-1"
EOF

export DT_TOKEN=$(aws secretsmanager get-secret-value --region eu-west-2 --secret-id dynatrace-token --query SecretString --output text)
export DT_URL=$(aws secretsmanager get-secret-value --region eu-west-2 --secret-id dynatrace-url --query SecretString --output text)
wget -O Dynatrace-ActiveGate-Linux-x86.sh "https://$DT_URL/api/v1/deployment/installer/gateway/unix/latest?arch=x86" --header="Authorization: Api-Token $DT_TOKEN"
wget -O Dynatrace-OneAgent-Linux-x86.sh "https://$DT_URL/api/v1/deployment/installer/agent/unix/default/latest?arch=x86" --header="Authorization: Api-Token $DT_TOKEN"
chmod +x Dynatrace-ActiveGate-Linux-x86.sh
chmod +x Dynatrace-OneAgent-Linux-x86.sh
./Dynatrace-ActiveGate-Linux-x86.sh
./Dynatrace-OneAgent-Linux-x86.sh
