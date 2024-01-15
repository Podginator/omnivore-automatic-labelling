import * as dotenv from 'dotenv'
import * as cdk from 'aws-cdk-lib';
import * as path from "path";
import { Construct } from 'constructs';
import * as Lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import {Runtime} from "aws-cdk-lib/aws-lambda";
import {RemovalPolicy} from "aws-cdk-lib";

dotenv.config();

export class OmnivoreTaggingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

      const tableName = "labelEmbeddings";

      const table = new dynamodb.Table(this, `${tableName}Table`, {
        tableName: tableName,
        partitionKey: {
          name: "id",
          type: dynamodb.AttributeType.STRING,
        },
        removalPolicy: RemovalPolicy.DESTROY,
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const lambdaFn = new Lambda.NodejsFunction(this, "IncomingWebhook", {
      entry: path.join(__dirname, "../../src/lambda.ts"),
      depsLockFilePath: path.join(__dirname, "../../package-lock.json"),
      handler: "handler",
      runtime: Runtime.NODEJS_20_X,
      memorySize: 1024,
      environment: {
        OPENAI_API_KEY: this.node.getContext("open_api_key"),
        OMNIVORE_API_KEY: this.node.getContext("omnivore_auth"),
        DYNAMODB_TABLE_NAME: table.tableName
      },
    });

    table.grantReadWriteData(lambdaFn);

    const gateway = new apigw.RestApi(this, 'OmnivoreWebhookRestAPI', {
      endpointTypes: [apigw.EndpointType.REGIONAL],
      deployOptions: {
        metricsEnabled: true,
        loggingLevel: apigw.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        stageName: 'prod',
        methodOptions: {
          '/*/*': {
            throttlingRateLimit: 100,
            throttlingBurstLimit: 200,
          },
        },
      },
    });

    const basePath = gateway.root.addResource('page');

    let lambdaIntegration = new apigw.LambdaIntegration(lambdaFn, {
      proxy: false,
      requestParameters: {'integration.request.header.X-Amz-Invocation-Type': "'Event'"},
      integrationResponses: [
        {
          statusCode: '200',
        },
      ],
    });

    basePath.addMethod('POST', lambdaIntegration, {
      methodResponses: [
        {
          statusCode: '200',
        },
      ],
    });

  }
}
