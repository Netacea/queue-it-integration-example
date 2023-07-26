import Cloudflare, {CloudflareConstructorArgs} from '@netacea/cloudflare'
import * as Config from './NetaceaConfig.json'
import * as QueueIt from './connector-cloudflare-4.1.1'
const worker = new Cloudflare(Config.netaceaConfig as CloudflareConstructorArgs)

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

  const {queueItConfig} = Config

  QueueIt.setIntegrationDetails({
    SecretKey: queueItConfig.secretKey,
    CustomerId: queueItConfig.customerId,
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
