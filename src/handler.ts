import Cloudflare, {CloudflareConstructorArgs} from '@netacea/cloudflare'
import * as NetaceaConfig from './NetaceaConfig.json'
import * as QueueIt from './connector-cloudflare-4.1.1'
const worker = new Cloudflare(NetaceaConfig as CloudflareConstructorArgs)

export async function handleRequestWithNetacea(
  event: FetchEvent
): Promise<Response> {
  const response = await worker.run(event, originRequest)
  event.waitUntil(worker.ingest(event.request, response))
  return response
}

async function originRequest(request: Request): Promise<Response> {
  const netaceaResponse = await fetch(request.clone())

  if (!netaceaResponse.ok && !request.url.includes("__push_queueit_config")) {
    return netaceaResponse
  }

  QueueIt.setIntegrationDetails({
    SecretKey: 'b5a0224c-82b8-4fe0-8f38-92cb39d319f0f1e786c9-7437-485e-ac90-429eddcd33c7',
    CustomerId: 'netacea',
    EnqueueTokenEnabled: true,
    EnqueueTokenValidityTime: 60000,
    EnqueueTokenKeyEnabled: false,
    RequestBodyEnabled: false
  })

  let queueItResponse = await QueueIt.onClientRequest(request.clone())

  if (queueItResponse) {
    queueItResponse = await QueueIt.onClientResponse(queueItResponse)
    return queueItResponse
  }
  
  return netaceaResponse
}
