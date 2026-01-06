import { Stack, type StackProps, CfnOutput, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";

export class SentimentStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const fn = new lambda.Function(this, "SentimentHandler", {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: "handler.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "../../../lambda")),
      timeout: Duration.seconds(10),
      memorySize: 256
    });

    fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["comprehend:DetectSentiment"],
        resources: ["*"]
      })
    );

    const api = new apigw.RestApi(this, "SentimentApi", {
      restApiName: "comprehend-sentiment-api",
      deployOptions: { stageName: "prod" },
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: ["OPTIONS", "POST"],
        allowHeaders: ["Content-Type"]
      }
    });

    const analyze = api.root.addResource("analyze");
    analyze.addMethod("POST", new apigw.LambdaIntegration(fn, { proxy: true }));

    new CfnOutput(this, "SentimentApiUrl", {
      value: api.url.slice(0, -1)
    });
  }
}
