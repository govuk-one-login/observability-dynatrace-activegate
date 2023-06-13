Feature: Monitoring Feature

    Confirm the structure of the monitoring template

    Scenario: Monitoring Template
        Given That synth has run
        When the file DynatraceMonitoringRoleStack.template.json exists
        Then the AWS::IAM::Role resource with the RoleName like DynatraceMonitoringRole should exist
        And the AWS::IAM::Policy resource with the PolicyName like roleDefaultPolicy should exist
        And actions of AWS::IAM::Policy should match actions file
        And actions of AWS::IAM::Policy should be readonly