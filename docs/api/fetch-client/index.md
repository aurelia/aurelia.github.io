# aurelia-fetch-client Module

> A simple client based on the Fetch standard.

## Classes


### HttpClient

An HTTP client based on the Fetch API.

#### Properties

* `activeRequestCount: number` - The current number of active requests.
Requests being processed by interceptors are considered active.
* `baseUrl: string` - The base URL set by the config.
* `defaults: RequestInit` - The default request init to merge with values specified at request time.
* `interceptors: ` - The interceptors to be run during requests.
* `isConfigured: boolean` - Indicates whether or not the client has been configured.
* `isRequesting: boolean` - Indicates whether or not the client is currently making one or more requests.

#### Methods


* `buildRequest(input: , init: RequestInit): Request` - 
  * `input: ` - No description available
  * `init: RequestInit` - No description available


* `configure(config: ): HttpClient` - Configure this client with default settings to be used by all requests.
  * `config: ` - A configuration object, or a function that takes a config
object and configures it.


* `delete(input: , body?: any, init?: RequestInit): Promise` - Calls fetch with request method set to DELETE.
  * `input: ` - The resource that you wish to fetch. Either a
Request object, or a string containing the URL of the resource.
  * `body?: any` - The body of the request.
  * `init?: RequestInit` - An options object containing settings to be applied to
the Request.


* `fetch(input: , init?: RequestInit): Promise` - Starts the process of fetching a resource. Default configuration parameters
will be applied to the Request. The constructed Request will be passed to
registered request interceptors before being sent. The Response will be passed
to registered Response interceptors before it is returned.
  * `input: ` - The resource that you wish to fetch. Either a
Request object, or a string containing the URL of the resource.
  * `init?: RequestInit` - An options object containing settings to be applied to
the Request.


* `get(input: , init?: RequestInit): Promise` - Calls fetch as a GET request.
  * `input: ` - The resource that you wish to fetch. Either a
Request object, or a string containing the URL of the resource.
  * `init?: RequestInit` - An options object containing settings to be applied to
the Request.


* `patch(input: , body?: any, init?: RequestInit): Promise` - Calls fetch with request method set to PATCH.
  * `input: ` - The resource that you wish to fetch. Either a
Request object, or a string containing the URL of the resource.
  * `body?: any` - The body of the request.
  * `init?: RequestInit` - An options object containing settings to be applied to
the Request.


* `post(input: , body?: any, init?: RequestInit): Promise` - Calls fetch with request method set to POST.
  * `input: ` - The resource that you wish to fetch. Either a
Request object, or a string containing the URL of the resource.
  * `body?: any` - The body of the request.
  * `init?: RequestInit` - An options object containing settings to be applied to
the Request.


* `put(input: , body?: any, init?: RequestInit): Promise` - Calls fetch with request method set to PUT.
  * `input: ` - The resource that you wish to fetch. Either a
Request object, or a string containing the URL of the resource.
  * `body?: any` - The body of the request.
  * `init?: RequestInit` - An options object containing settings to be applied to
the Request.



### HttpClientConfiguration

A class for configuring HttpClients.

#### Properties

* `baseUrl: string` - The base URL to be prepended to each Request&#x27;s url before sending.
* `defaults: RequestInit` - Default values to apply to init objects when creating Requests. Note that
defaults cannot be applied when Request objects are manually created because
Request provides its own defaults and discards the original init object.
See also https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
* `interceptors: ` - Interceptors to be added to the HttpClient.

#### Methods


* `rejectErrorResponses(): HttpClientConfiguration` - Causes Responses whose status codes fall outside the range 200-299 to reject.
The fetch API only rejects on network errors or other conditions that prevent
the request from completing, meaning consumers must inspect Response.ok in the
Promise continuation to determine if the server responded with a success code.
This method adds a response interceptor that causes Responses with error codes
to be rejected, which is common behavior in HTTP client libraries.


* `useStandardConfiguration(): HttpClientConfiguration` - Applies a configuration that addresses common application needs, including
configuring same-origin credentials, and using rejectErrorResponses.


* `withBaseUrl(baseUrl: string): HttpClientConfiguration` - Sets the baseUrl.
  * `baseUrl: string` - The base URL.


* `withDefaults(defaults: RequestInit): HttpClientConfiguration` - Sets the defaults.
  * `defaults: RequestInit` - The defaults.


* `withInterceptor(interceptor: Interceptor): HttpClientConfiguration` - Adds an interceptor to be run on all requests or responses.
  * `interceptor: Interceptor` - An object with request, requestError,
response, or responseError methods. request and requestError act as
resolve and reject handlers for the Request before it is sent.
response and responseError act as resolve and reject handlers for
the Response after it has been received.


* `withRetry(config?: RetryConfiguration): HttpClientConfiguration` - 
  * `config?: RetryConfiguration` - No description available



### RetryInterceptor

No description available.

#### Properties

* `retryConfig: RetryConfiguration` - No description available.

#### Methods


* `request(request: Request): Request` - 
  * `request: Request` - No description available


* `response(response: Response, request?: Request): Response` - 
  * `response: Response` - No description available
  * `request?: Request` - No description available


* `responseError(error: Response, request?: Request, httpClient?: HttpClient): Promise` - 
  * `error: Response` - No description available
  * `request?: Request` - No description available
  * `httpClient?: HttpClient` - No description available



## Interfaces


### Interceptor

Interceptors can process requests before they are sent, and responses
before they are returned to callers.

#### Properties

* `request: ` - Called with the request before it is sent. Request interceptors can modify and
return the request, or return a new one to be sent. If desired, the interceptor
may return a Response in order to short-circuit the HTTP request itself.
* `requestError: ` - Handles errors generated by previous request interceptors. This function acts
as a Promise rejection handler. It may rethrow the error to propagate the
failure, or return a new Request or Response to recover.
* `response: ` - Called with the response after it is received. Response interceptors can modify
and return the Response, or create a new one to be returned to the caller.
* `responseError: ` - Handles fetch errors and errors generated by previous interceptors. This
function acts as a Promise rejection handler. It may rethrow the error
to propagate the failure, or return a new Response to recover.

#### Methods



### RequestInit

The init object used to initialize a fetch Request.
See https://developer.mozilla.org/en-US/docs/Web/API/Request/Request

#### Properties

* `body: ` - Any body that you want to add to your request: this can be a Blob, BufferSource, FormData,
URLSearchParams, ReadableStream, or USVString object.
* `cache: string` - The cache mode you want to use for the request: default, no-store, reload, no-cache, or force-cache.
* `credentials: string` - The request credentials you want to use for the request: omit, same-origin, or include.
The default is omit.
* `headers: ` - Any headers you want to add to your request, contained within a Headers object or an object literal with ByteString values.
* `integrity: string` - Contains the subresource integrity value of the request (e.g., sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE&#x3D;).
* `method: string` - The request method, e.g., GET, POST.
* `mode: string` - The mode you want to use for the request, e.g., cors, no-cors, same-origin, or navigate.
The default is cors.
* `redirect: string` - The redirect mode to use: follow, error, or manual.
* `referrer: string` - A USVString specifying no-referrer, client, or a URL. The default is client.
* `signal: ` - An AbortSignal to set request’s signal.

#### Methods



### RetryConfiguration

No description available.

#### Properties

* `beforeRetry: ` - No description available.
* `counter: number` - No description available.
* `doRetry: ` - No description available.
* `interval: number` - No description available.
* `maxRandomInterval: number` - No description available.
* `maxRetries: number` - No description available.
* `minRandomInterval: number` - No description available.
* `requestClone: Request` - No description available.
* `strategy: ` - No description available.

#### Methods



## Constants

* `retryStrategy: ` - No description available.

## Functions


* `json(body: any, replacer?: any): string` - Serialize an object to JSON. Useful for easily creating JSON fetch request bodies.
  * `body: any` - The object to be serialized to JSON.
  * `replacer?: any` - The JSON.stringify replacer used when serializing.

