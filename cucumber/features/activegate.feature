Feature: ActiveGate Feature

    Confirm the structure of the ActiveGate template

    Scenario: ActiveGate Template
        Given That synth has run
        When the file DynatraceActivegateStack.template.json exists
        Then the AWS::EC2::VPC resource with the CIDR range 10.0.0.0/16 should exist
        And 2 AWS::EC2::Subnet should exist
        And 2 AWS::EC2::RouteTable should exist
        And 2 AWS::EC2::SubnetRouteTableAssociation should exist
        And 2 AWS::EC2::Route should exist
        And 1 AWS::EC2::EIP should exist
        And 1 AWS::EC2::NatGateway should exist