import { loadFeature, defineFeature } from "jest-cucumber";
import { execSync } from "child_process";
import { existsSync, readFileSync, mkdirSync, rmSync } from "fs";
import { Template } from '@aws-cdk/assertions';


const feature = loadFeature("./cucumber/features/monitoring.feature");

defineFeature(feature, (test) => {

    beforeEach(() => {
        mkdirSync('./test-monitor/');
    });

    afterEach(() => {
        rmSync('./test-monitor/', { recursive: true, force: true });
    });

    test("Monitoring Template", ({ given, when, then }) => {

        let template: Template;

        given("That synth has run", () => {
            execSync("cdk synth --output ./test-monitor/");
        });

        when(/^the file (.*) exists$/, (fileName: string) => {
            expect(existsSync(`./test-monitor/${fileName}`)).toBeTruthy();
            template = Template.fromString(readFileSync(`./test-monitor/${fileName}`, "utf-8"));
        });

        then(/^the (.*) resource with the (.*) (.*) should exist$/, (resourceType: string, resourceNameKey: string, resourceNameValue: string) => {

            let props = {
                Properties: {
                    [resourceNameKey]: resourceNameValue
                }
            };

            template.hasResource(resourceType, props);
        });

        then(/^the (.*) resource with the (.*) like (.*) should exist$/, (resourceType: string, resourceNameKey: string, resourceNameValue: string) => {
            template.hasResource(resourceType, {});
            let valueKey = Object.values(template.findResources(resourceType))[0]["Properties"][resourceNameKey];
            expect(valueKey.startsWith(resourceNameValue)).toBeTruthy();
        });

        then(/^actions of (.*) should match (.*) file$/, (resourceType: string, actionsFile: string) => {
            let actionsString = readFileSync(`./cucumber/files/${actionsFile}`, "utf-8");
            let actionsList = actionsString.split(",");
            let objectActionsA = Object.values(template.findResources(resourceType))[0]["Properties"]["PolicyDocument"]["Statement"][0]["Action"] as Array<string>;
            expect(actionsList.sort().join(",")).toEqual(objectActionsA.sort().join(","));
        });

        then(/^actions of (.*) should be readonly$/, (resourceType: string) => {
            let objectActionsA = Object.values(template.findResources(resourceType))[0]["Properties"]["PolicyDocument"]["Statement"][0]["Action"] as Array<string>
            let actionsAsString = objectActionsA.sort().join(",");
            let prefixedActionsAsString = ","+actionsAsString
            
            expect(prefixedActionsAsString.includes(",Abort")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Accept")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Advertise")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Allocate")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Apply")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Assign")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Associate")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Attach")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",BatchExecute")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",BatchWrite")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Bundle")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Cancel")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Change")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Confirm")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Copy")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Create")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Delete")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Deprovision")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Deregister")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Detach")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Disable")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Disassociate")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Enable")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Execute")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Export")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Flush")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Import")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Modify")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Move")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Put")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Provision")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Purchase")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Query")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Reboot")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Register")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Reject")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Release")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Replace")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Request")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Reset")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Restore")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Revoke")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Run")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Send")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Start")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Stop")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Submit")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",TagResource")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Terminate")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Test")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",TransactWrite")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Unassign")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Unmonitor")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Untag")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Update")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Upload")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Withdraw")).toBeFalsy();
            expect(prefixedActionsAsString.includes(",Write")).toBeFalsy();

        });

    });
});