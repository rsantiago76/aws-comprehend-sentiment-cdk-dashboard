#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { SentimentStack } from "../lib/sentiment-stack.js";

const app = new App();
new SentimentStack(app, "SentimentStack");
