import { APIGatewayProxyEventV2 } from "aws-lambda";
import { APIGatewayProxyStructuredResultV2 } from "aws-lambda/trigger/api-gateway-proxy";
import { MeetupEvent } from "./dao/meetup.dao";
import { AppConf } from "./app-conf";
import { router } from "./router";
import colors from "colors";

export type EventsResponse = Array<MeetupEvent>;

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> {
  try {
    return await handleRequest(event);
  } catch (e) {
    console.log(JSON.stringify(AppConf));
    console.error(`Internal server error: ${e}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
        requestId: event.requestContext.requestId,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
    };
  }
}

async function handleRequest(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> {
  console.log("request received");
  const path = event.requestContext.http.path;
  const handler = router[path];
  if (handler) {
    return {
      statusCode: 200,
      body: JSON.stringify(await handler()),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
    };
  }
  console.log(colors.blue('No handler found for path ') + colors.yellow(`"${path}"`))
  return {
    statusCode: 404,
    body: JSON.stringify({
      message: "Not found",
      requestId: event.requestContext.requestId,
    }),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
  };
}
