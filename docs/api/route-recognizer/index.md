# aurelia-route-recognizer Module

> A lightweight JavaScript library that matches paths against registered routes. It includes support for dynamic and star segments and nested handlers.

## Classes


### DynamicSegment

No description available.

#### Properties


#### Methods


* `eachChar(callback: ): void` - 
  * `callback: ` - No description available


* `generate(params: Object, consumed: Object): string` - 
  * `params: Object` - No description available
  * `consumed: Object` - No description available


* `regex(): string` - 



### EpsilonSegment

No description available.

#### Properties


#### Methods


* `eachChar(): void` - 


* `generate(): string` - 


* `regex(): string` - 



### RouteRecognizer

Class that parses route patterns and matches path strings.

#### Properties


#### Methods


* `add(route: ): State` - Parse a route pattern and add it to the collection of recognized routes.
  * `route: ` - The route to add.



* `generate(nameOrRoute: , params: object): string` - Generate a path and query string from a route name or RouteConfig (RouteHandler) and params object.
  * `nameOrRoute: ` - The name of the route or RouteConfig object.
  * `params: object` - The route params to use when populating the pattern.
 Properties not required by the pattern will be appended to the query string.


* `getRoute(nameOrRoute: ): RouteGenerator` - Retrieve a RouteGenerator for a route by name or RouteConfig (RouteHandler).
  * `nameOrRoute: ` - The name of the route or RouteConfig object.


* `handlersFor(nameOrRoute: ): ` - Retrieve the handlers registered for the route by name or RouteConfig (RouteHandler).
  * `nameOrRoute: ` - The name of the route or RouteConfig object.


* `hasRoute(nameOrRoute: ): boolean` - Check if this RouteRecognizer recognizes a route by name or RouteConfig (RouteHandler).
  * `nameOrRoute: ` - The name of the route or RouteConfig object.


* `recognize(path: string): ` - Match a path string against registered route patterns.
  * `path: string` - The path to attempt to match.



### StarSegment

No description available.

#### Properties


#### Methods


* `eachChar(callback: ): void` - 
  * `callback: ` - No description available


* `generate(params: Object, consumed: Object): string` - 
  * `params: Object` - No description available
  * `consumed: Object` - No description available


* `regex(): string` - 



### State

No description available.

#### Properties


#### Methods


* `get(charSpec: CharSpec): State` - 
  * `charSpec: CharSpec` - No description available


* `match(ch: string): ` - 
  * `ch: string` - No description available


* `put(charSpec: CharSpec): State` - 
  * `charSpec: CharSpec` - No description available



### StaticSegment

No description available.

#### Properties


#### Methods


* `eachChar(callback: ): void` - 
  * `callback: ` - No description available


* `generate(): string` - 


* `regex(): string` - 



## Interfaces


### CharSpec

No description available.

#### Properties

* `invalidChars: string` - No description available.
* `repeat: boolean` - No description available.
* `validChars: string` - No description available.

#### Methods



### ConfigurableRoute

No description available.

#### Properties

* `caseSensitive: boolean` - No description available.
* `handler: RouteHandler` - No description available.
* `path: string` - No description available.

#### Methods



### HandlerEntry

No description available.

#### Properties

* `handler: RouteHandler` - No description available.
* `names: ` - No description available.

#### Methods



### RecognizedRoute

No description available.

#### Properties

* `handler: RouteHandler` - No description available.
* `isDynamic: boolean` - No description available.
* `params: Object` - No description available.

#### Methods



### RouteGenerator

No description available.

#### Properties

* `handlers: ` - No description available.
* `segments: Array` - No description available.

#### Methods



### RouteHandler

No description available.

#### Properties

* `name: string` - No description available.

#### Methods



## Constants


## Functions

