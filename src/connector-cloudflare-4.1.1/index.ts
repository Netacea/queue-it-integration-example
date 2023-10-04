import { CloudflareSettings } from "./queueitHelpers";
import QueueITRequestResponseHandler from "./requestResponseHandler";

let handler: QueueITRequestResponseHandler | null;

export function setIntegrationDetails(settings: CloudflareSettings) {
    handler = new QueueITRequestResponseHandler(settings);
}

export async function onClientRequest(request: any) {
    return handler?.onClientRequest(request);
}

export async function onClientResponse(response: any) {
    return handler?.onClientResponse(response);
}