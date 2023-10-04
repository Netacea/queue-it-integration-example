'use strict'
import { CloudflareSettings, getSettingsFromVariables, SettingsException } from "./queueitHelpers";
import QueueITRequestResponseHandler from "./requestResponseHandler";

declare var addEventListener: any;
declare var fetch: any;

addEventListener('fetch', (event: any) => {
  event.respondWith(handleRequest(event))
})

const handleRequest = async function (event: any) {
  var settings: CloudflareSettings;

  try {
    settings = getSettingsFromVariables();


    const { request } = event;
    const handler = new QueueITRequestResponseHandler(settings);
    let queueitResponse = await handler.onClientRequest(request);
    if (queueitResponse) {
      //it is a redirect- break the flow
      return await handler.onClientResponse(queueitResponse);
    }
    else {
      //call backend
      const response = await fetch(request);
      return await handler.onClientResponse(response);
    }

  } catch (exception) {
    if (exception instanceof SettingsException) {
      console.log("ERROR: Settings missing of type: " + exception.Type + ". Please update your variables")
    } else {
      console.log("Exception: " + exception)
    }
  }
}