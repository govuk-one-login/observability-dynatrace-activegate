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
            template.hasResource(resourceType , {})
            let valueKey = Object.values(template.findResources(resourceType))[0]["Properties"][resourceNameKey]
            expect(valueKey.startsWith(resourceNameValue)).toBeTruthy();
        });

        then(/^actions of (.*) should match (.*) file$/, (resourceType, actionsFile: string) => {
            let actionsString = readFileSync(`./cucumber/files/${actionsFile}`, "utf-8")
            let actionsList = actionsString.split(",")
            let objectActionsA = Object.values(template.findResources(resourceType))[0]["Properties"]["PolicyDocument"]["Statement"][0]["Action"] as Array<string>
            expect(actionsList.sort().join(",")).toEqual(objectActionsA.sort().join(","))
        });

    });
});