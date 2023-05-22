import { loadFeature, defineFeature } from "jest-cucumber";
import { execSync } from "child_process";
import { existsSync, readFileSync, mkdirSync, rmSync } from "fs";
import { Template } from '@aws-cdk/assertions';


const feature = loadFeature("./cucumber/features/activegate.feature");

defineFeature(feature, (test) => {

    beforeEach(() => {
        mkdirSync('./test-activegate/');
    });

    afterEach(() => {
        rmSync('./test-activegate/', { recursive: true, force: true });
    });

    test("AgtiveGate Template", ({ given, when, then }) => {

        let template: Template;

        given("That synth has run", () => {
            execSync("cdk synth --output ./test-activegate/");
        });

        when(/^the file (.*) exists$/, (fileName: string) => {
            expect(existsSync(`./test-activegate/${fileName}`)).toBeTruthy();
            template = Template.fromString(readFileSync(`./test-activegate/${fileName}`, "utf-8"));
        });

        then(/^the (.*) resource with the CIDR range (.*) should exist$/, (resourceType: string, cidrRange: string) => {

            let props = {
                Properties: {
                    CidrBlock: cidrRange
                }
            };

            template.hasResource(resourceType, props);
        });


        then(/^(\d+) AWS::EC2::Subnet should exist$/, (resourceCount: number) => {
            expect(Object.values(template.findResources("AWS::EC2::Subnet")).length).toEqual(+resourceCount)
        });

        then(/^(\d+) AWS::EC2::RouteTable should exist$/, (resourceCount: number) => {
            expect(Object.values(template.findResources("AWS::EC2::RouteTable")).length).toEqual(+resourceCount)
        })

        then(/^(\d+) AWS::EC2::SubnetRouteTableAssociation should exist$/, (resourceCount: number) => {
            expect(Object.values(template.findResources("AWS::EC2::SubnetRouteTableAssociation")).length).toEqual(+resourceCount)
        });

        then(/^(\d+) AWS::EC2::Route should exist$/, (resourceCount: number) => {
            expect(Object.values(template.findResources("AWS::EC2::Route")).length).toEqual(+resourceCount)
        });

        then(/^(\d+) AWS::EC2::EIP should exist$/, (resourceCount: number) => {
            expect(Object.values(template.findResources("AWS::EC2::EIP")).length).toEqual(+resourceCount)
        });

        then(/^(\d+) AWS::EC2::NatGateway should exist$/, (resourceCount: number) => {
            expect(Object.values(template.findResources("AWS::EC2::NatGateway")).length).toEqual(+resourceCount)
        });
    });
});