# aurelia-binding Module

> A modern databinding library for JavaScript and HTML.

## Classes


### AccessKeyed

An expression that accesses a property on an object using a key.

#### Properties

* `key: Expression` - The property name.
* `object: Expression` - The object expression.

#### Methods


* `accept(visitor: ExpressionVisitor): void` - Accepts an expression visitor.
  * `visitor: ExpressionVisitor` - No description available


* `assign(scope: Scope, value: any, lookupFunctions: LookupFunctions): void` - Assigns a value to the property represented by the expression.
  * `scope: Scope` - No description available
  * `value: any` - No description available
  * `lookupFunctions: LookupFunctions` - No description available


* `connect(binding: Binding, scope: Scope): void` - Subscribes a binding instance to the property change events along the path of the expression.
  * `binding: Binding` - No description available
  * `scope: Scope` - No description available


* `evaluate(scope: Scope, lookupFunctions?: LookupFunctions): any` - Evaluates the expression using the provided scope and lookup functions.
  * `scope: Scope` - The scope (bindingContext + overrideContext)
  * `lookupFunctions?: LookupFunctions` - Required for BindingBehavior and ValueConverter expressions.




### AccessMember

An expression that accesses a property on an object.

#### Properties

* `name: string` - The property name.
* `object: Expression` - The object expression.

#### Methods


* `accept(visitor: ExpressionVisitor): void` - Accepts an expression visitor.
  * `visitor: ExpressionVisitor` - No description available


* `assign(scope: Scope, value: any, lookupFunctions: LookupFunctions): void` - Assigns a value to the property represented by the expression.
  * `scope: Scope` - No description available
  * `value: any` - No description available
  * `lookupFunctions: LookupFunctions` - No description available


* `connect(binding: Binding, scope: Scope): void` - Subscribes a binding instance to the property change events along the path of the expression.
  * `binding: Binding` - No description available
  * `scope: Scope` - No description available


* `evaluate(scope: Scope, lookupFunctions?: LookupFunctions): any` - Evaluates the expression using the provided scope and lookup functions.
  * `scope: Scope` - The scope (bindingContext + overrideContext)
  * `lookupFunctions?: LookupFunctions` - Required for BindingBehavior and ValueConverter expressions.




### AccessScope

An expression that accesses a property on the scope.

#### Properties

* `ancestor: number` - The number of hops up the scope tree.
* `name: string` - The property name.

#### Methods


* `accept(visitor: ExpressionVisitor): void` - Accepts an expression visitor.
  * `visitor: ExpressionVisitor` - No description available


* `assign(scope: Scope, value: any, lookupFunctions: LookupFunctions): void` - Assigns a value to the property represented by the expression.
  * `scope: Scope` - No description available
  * `value: any` - No description available
  * `lookupFunctions: LookupFunctions` - No description available


* `connect(binding: Binding, scope: Scope): void` - Subscribes a binding instance to the property change events along the path of the expression.
  * `binding: Binding` - No description available
  * `scope: Scope` - No description available


* `evaluate(scope: Scope, lookupFunctions?: LookupFunctions): any` - Evaluates the expression using the provided scope and lookup functions.
  * `scope: Scope` - The scope (bindingContext + overrideContext)
  * `lookupFunctions?: LookupFunctions` - Required for BindingBehavior and ValueConverter expressions.




### Binary

A binary expression (add, subtract, equals, greater-than, etc).

#### Properties

* `left: Expression` - No description available.
* `operation: string` - No description available.
* `right: Expression` - No description available.

#### Methods


* `accept(visitor: ExpressionVisitor): void` - Accepts an expression visitor.
  * `visitor: ExpressionVisitor` - No description available


* `assign(scope: Scope, value: any, lookupFunctions: LookupFunctions): void` - Assigns a value to the property represented by the expression.
  * `scope: Scope` - No description available
  * `value: any` - No description available
  * `lookupFunctions: LookupFunctions` - No description available


* `connect(binding: Binding, scope: Scope): void` - Subscribes a binding instance to the property change events along the path of the expression.
  * `binding: Binding` - No description available
  * `scope: Scope` - No description available


* `evaluate(scope: Scope, lookupFunctions?: LookupFunctions): any` - Evaluates the expression using the provided scope and lookup functions.
  * `scope: Scope` - The scope (bindingContext + overrideContext)
  * `lookupFunctions?: LookupFunctions` - Required for BindingBehavior and ValueConverter expressions.




### BindingBehavior

A binding behavior expression.

#### Properties

* `args: ` - No description available.
* `expression: Expression` - No description available.
* `name: string` - No description available.

#### Methods


* `accept(visitor: ExpressionVisitor): void` - Accepts an expression visitor.
  * `visitor: ExpressionVisitor` - No description available


* `assign(scope: Scope, value: any, lookupFunctions: LookupFunctions): void` - 
  * `scope: Scope` - No description available
  * `value: any` - No description available
  * `lookupFunctions: LookupFunctions` - No description available


* `connect(binding: Binding, scope: Scope): void` - 
  * `binding: Binding` - No description available
  * `scope: Scope` - No description available


* `evaluate(scope: Scope, lookupFunctions: LookupFunctions): any` - 
  * `scope: Scope` - No description available
  * `lookupFunctions: LookupFunctions` - No description available



### BindingBehaviorResource

A BindingBehavior resource.

#### Properties


#### Methods


* `initialize(container: Container, target: any): void` - 
  * `container: Container` - No description available
  * `target: any` - No description available


* `register(registry: any, name: string): void` - 
  * `registry: any` - No description available
  * `name: string` - No description available


* `static convention(name: string): BindingBehaviorResource` - 
  * `name: string` - No description available



### BindingEngine

Binding system API.

#### Properties


#### Methods


* `collectionObserver(collection: ): CollectionObserver` - Gets an observer for collection mutation.
  * `collection: ` - No description available


* `createBindingExpression(targetProperty: string, sourceExpression: string, mode?: bindingMode, lookupFunctions?: LookupFunctions): BindingExpression` - Creates a binding expression for the specified target property and source expression.
  * `targetProperty: string` - The target attribute, eg &quot;value&quot; / &quot;checked&quot; / &quot;textcontent&quot; / &quot;data-foo&quot;.
  * `sourceExpression: string` - A javascript expression accessing the source property.
  * `mode?: bindingMode` - The directionality of the binding.
  * `lookupFunctions?: LookupFunctions` - Lookup functions for value converter and binding behavior resources.



* `expressionObserver(bindingContext: any, expression: string): PropertyObserver` - Gets an observer for a javascript expression that accesses a property on the binding context.
  * `bindingContext: any` - The binding context (view-model)
  * `expression: string` - A javascript expression accessing the source property.



* `parseExpression(expression: string): Expression` - Parses a string containing a javascript expression and returns a data-binding specialized AST. Memoized.
  * `expression: string` - No description available


* `propertyObserver(obj: Object, propertyName: string): PropertyObserver` - Gets an observer for property changes.
  * `obj: Object` - No description available
  * `propertyName: string` - No description available


* `registerAdapter(adapter: ObjectObservationAdapter): void` - Registers an adapter that provides an efficient property observeration strategy for
properties that would otherwise require dirty-checking.
  * `adapter: ObjectObservationAdapter` - No description available



### CallMember

An expression representing a call to a member function.

#### Properties

* `args: ` - No description available.
* `name: string` - No description available.
* `object: Expression` - No description available.

#### Methods


* `accept(visitor: ExpressionVisitor): void` - Accepts an expression visitor.
  * `visitor: ExpressionVisitor` - No description available


* `assign(scope: Scope, value: any, lookupFunctions: LookupFunctions): void` - Assigns a value to the property represented by the expression.
  * `scope: Scope` - No description available
  * `value: any` - No description available
  * `lookupFunctions: LookupFunctions` - No description available


* `connect(binding: Binding, scope: Scope): void` - Subscribes a binding instance to the property change events along the path of the expression.
  * `binding: Binding` - No description available
  * `scope: Scope` - No description available


* `evaluate(scope: Scope, lookupFunctions?: LookupFunctions): any` - Evaluates the expression using the provided scope and lookup functions.
  * `scope: Scope` - The scope (bindingContext + overrideContext)
  * `lookupFunctions?: LookupFunctions` - Required for BindingBehavior and ValueConverter expressions.




### CheckedObserver

Checked observer for checkboxes

#### Properties


#### Methods


* `getValue(): any` - 


* `handleEvent(): any` - Handle underlying checkbox element change events


* `setValue(newValue: any): void` - 
  * `newValue: any` - No description available


* `subscribe(callback: ): void` - Subscribe to property changes with a callback function.
  * `callback: ` - No description available


* `unsubscribe(callback: ): void` - Unsubscribes a callback function from property changes.
  * `callback: ` - No description available



### Conditional

A conditional (ternary) expression.

#### Properties

* `condition: Expression` - No description available.
* `no: Expression` - No description available.
* `yes: Expression` - No description available.

#### Methods


* `accept(visitor: ExpressionVisitor): void` - Accepts an expression visitor.
  * `visitor: ExpressionVisitor` - No description available


* `assign(scope: Scope, value: any, lookupFunctions: LookupFunctions): void` - Assigns a value to the property represented by the expression.
  * `scope: Scope` - No description available
  * `value: any` - No description available
  * `lookupFunctions: LookupFunctions` - No description available


* `connect(binding: Binding, scope: Scope): void` - Subscribes a binding instance to the property change events along the path of the expression.
  * `binding: Binding` - No description available
  * `scope: Scope` - No description available


* `evaluate(scope: Scope, lookupFunctions?: LookupFunctions): any` - Evaluates the expression using the provided scope and lookup functions.
  * `scope: Scope` - The scope (bindingContext + overrideContext)
  * `lookupFunctions?: LookupFunctions` - Required for BindingBehavior and ValueConverter expressions.




### DataAttributeObserver

Property observer for HTML Attributes.

#### Properties


#### Methods


* `getValue(): any` - Gets the property value.


* `setValue(newValue: any): void` - Sets the property value.
  * `newValue: any` - No description available


* `subscribe(callback: ): void` - Subscribe to property changes with a callback function.
  * `callback: ` - No description available


* `unsubscribe(callback: ): void` - Unsubscribes a callback function from property changes.
  * `callback: ` - No description available



### DirtyCheckProperty

Property observer for properties that cannot be observed by other means

#### Properties


#### Methods


* `getValue(): any` - Gets the property value.


* `setValue(newValue: any): void` - Sets the property value.
  * `newValue: any` - No description available


* `subscribe(callback: ): void` - Subscribe to property changes with a callback function.
  * `callback: ` - No description available


* `unsubscribe(callback: ): void` - Unsubscribes a callback function from property changes.
  * `callback: ` - No description available



### EventManager

Subscribes to appropriate element events based on the element property
being observed for changes.
This is an internal API and is subject to change without notice in future releases.

#### Properties

* `escapeShadowRoot: boolean` - No description available.

#### Methods


* `addEventListener(target: EventTarget, targetEvent: string, callback: EventListenerOrEventListenerObject, delegate: delegationStrategy, disposable: true): Disposable` - Subscribes to specified event on the target element.
  * `target: EventTarget` - Target element.
  * `targetEvent: string` - Name of event to subscribe.
  * `callback: EventListenerOrEventListenerObject` - Event listener callback.
  * `delegate: delegationStrategy` - True to use event delegation mechanism.
  * `disposable: true` - True to return a disposable object with dispose() method instead of a function


* `registerElementConfig(config: ): void` - 
  * `config: ` - No description available



### EventSubscriber

Event subscription handler for observers

#### Properties


#### Methods


* `dispose(): void` - 


* `subscribe(element: Element, handler: EventListenerOrEventListenerObject): void` - 
  * `element: Element` - No description available
  * `handler: EventListenerOrEventListenerObject` - No description available



### Expression

Provides the base class from which the classes that represent expression tree nodes are derived.

#### Properties


#### Methods


* `accept(visitor: ExpressionVisitor): void` - Accepts an expression visitor.
  * `visitor: ExpressionVisitor` - No description available


* `assign(scope: Scope, value: any, lookupFunctions: LookupFunctions): void` - Assigns a value to the property represented by the expression.
  * `scope: Scope` - No description available
  * `value: any` - No description available
  * `lookupFunctions: LookupFunctions` - No description available


* `connect(binding: Binding, scope: Scope): void` - Subscribes a binding instance to the property change events along the path of the expression.
  * `binding: Binding` - No description available
  * `scope: Scope` - No description available


* `evaluate(scope: Scope, lookupFunctions?: LookupFunctions): any` - Evaluates the expression using the provided scope and lookup functions.
  * `scope: Scope` - The scope (bindingContext + overrideContext)
  * `lookupFunctions?: LookupFunctions` - Required for BindingBehavior and ValueConverter expressions.




### ExpressionCloner

Clones an expression AST.

#### Properties


#### Methods



### LiteralPrimitive

A literal primitive (null, undefined, number, boolean).

#### Properties

* `value: any` - No description available.

#### Methods


* `accept(visitor: ExpressionVisitor): void` - Accepts an expression visitor.
  * `visitor: ExpressionVisitor` - No description available


* `assign(scope: Scope, value: any, lookupFunctions: LookupFunctions): void` - Assigns a value to the property represented by the expression.
  * `scope: Scope` - No description available
  * `value: any` - No description available
  * `lookupFunctions: LookupFunctions` - No description available


* `connect(binding: Binding, scope: Scope): void` - Subscribes a binding instance to the property change events along the path of the expression.
  * `binding: Binding` - No description available
  * `scope: Scope` - No description available


* `evaluate(scope: Scope, lookupFunctions?: LookupFunctions): any` - Evaluates the expression using the provided scope and lookup functions.
  * `scope: Scope` - The scope (bindingContext + overrideContext)
  * `lookupFunctions?: LookupFunctions` - Required for BindingBehavior and ValueConverter expressions.




### LiteralString

An expression representing a literal string.

#### Properties

* `value: string` - No description available.

#### Methods


* `accept(visitor: ExpressionVisitor): void` - Accepts an expression visitor.
  * `visitor: ExpressionVisitor` - No description available


* `assign(scope: Scope, value: any, lookupFunctions: LookupFunctions): void` - Assigns a value to the property represented by the expression.
  * `scope: Scope` - No description available
  * `value: any` - No description available
  * `lookupFunctions: LookupFunctions` - No description available


* `connect(binding: Binding, scope: Scope): void` - Subscribes a binding instance to the property change events along the path of the expression.
  * `binding: Binding` - No description available
  * `scope: Scope` - No description available


* `evaluate(scope: Scope, lookupFunctions?: LookupFunctions): any` - Evaluates the expression using the provided scope and lookup functions.
  * `scope: Scope` - The scope (bindingContext + overrideContext)
  * `lookupFunctions?: LookupFunctions` - Required for BindingBehavior and ValueConverter expressions.




### LiteralTemplate

An expression representing a (optionally tagged) template literal.

#### Properties

* `cooked: ` - The cooked (escaped) string parts of the template.
The first item is the TemplateHead. If there is only one item,
then this counts as a NoSubstituteTemplate - functionally equivalent
to a LiteralString, unless it&#x27;s tagged.
* `expressions: ` - The expressions within the template (the parts between &#x60;${&#x60; and &#x60;}&#x60;)
* `func: ` - The tag (function) to be invoked with the LiteralTemplate arguments.
The first argument is LiteralTemplate.cooked.
The following arguments are the results of evaluating LiteralTemplate.expressions.

#### Methods


* `accept(visitor: ExpressionVisitor): void` - Accepts an expression visitor.
  * `visitor: ExpressionVisitor` - No description available


* `assign(scope: Scope, value: any, lookupFunctions: LookupFunctions): void` - Assigns a value to the property represented by the expression.
  * `scope: Scope` - No description available
  * `value: any` - No description available
  * `lookupFunctions: LookupFunctions` - No description available


* `connect(binding: Binding, scope: Scope): void` - Subscribes a binding instance to the property change events along the path of the expression.
  * `binding: Binding` - No description available
  * `scope: Scope` - No description available


* `evaluate(scope: Scope, lookupFunctions?: LookupFunctions): any` - Evaluates the expression using the provided scope and lookup functions.
  * `scope: Scope` - The scope (bindingContext + overrideContext)
  * `lookupFunctions?: LookupFunctions` - Required for BindingBehavior and ValueConverter expressions.




### ObserverLocator

Internal object observation API. Locates observers for properties, arrays and maps using a variety of strategies.

#### Properties


#### Methods


* `addAdapter(adapter: ObjectObservationAdapter): void` - Adds a property observation adapter.
  * `adapter: ObjectObservationAdapter` - No description available


* `getArrayObserver(array: Array): InternalCollectionObserver` - Gets an observer for array mutation.
  * `array: Array` - No description available


* `getMapObserver(map: Map): InternalCollectionObserver` - Gets an observer for map mutation.
  * `map: Map` - No description available


* `getObserver(obj: any, propertyName: string): InternalPropertyObserver` - Gets an observer for property changes.
  * `obj: any` - No description available
  * `propertyName: string` - No description available


* `getSetObserver(set: Set): InternalCollectionObserver` - Gets an observer for set mutation.
  * `set: Set` - No description available



### Parser

Parses strings containing javascript expressions and returns a data-binding specialized AST.

#### Properties


#### Methods


* `parse(input: string): Expression` - Parses a string containing a javascript expression and returns a data-binding specialized AST. Memoized.
  * `input: string` - No description available



### SelectValueObserver

Select observer for select

#### Properties


#### Methods


* `getValue(): any` - 


* `handleEvent(): any` - Handle underlying checkbox element change events


* `setValue(newValue: any): void` - 
  * `newValue: any` - No description available


* `subscribe(callback: ): void` - Subscribe to property changes with a callback function.
  * `callback: ` - No description available


* `unsubscribe(callback: ): void` - Unsubscribes a callback function from property changes.
  * `callback: ` - No description available



### Unparser

Visits an expression AST and returns the string equivalent.

#### Properties


#### Methods



### ValueAttributeObserver

Value observer for elements

#### Properties


#### Methods


* `getValue(): any` - 


* `handleEvent(): any` - Handle underlying checkbox element change events


* `setValue(newValue: any): void` - 
  * `newValue: any` - No description available


* `subscribe(callback: ): void` - Subscribe to property changes with a callback function.
  * `callback: ` - No description available


* `unsubscribe(callback: ): void` - Unsubscribes a callback function from property changes.
  * `callback: ` - No description available



### ValueConverter

A value converter expression.

#### Properties

* `allArgs: ` - No description available.
* `args: ` - No description available.
* `expression: Expression` - No description available.
* `name: string` - No description available.

#### Methods


* `accept(visitor: ExpressionVisitor): void` - Accepts an expression visitor.
  * `visitor: ExpressionVisitor` - No description available


* `assign(scope: Scope, value: any, lookupFunctions: LookupFunctions): void` - 
  * `scope: Scope` - No description available
  * `value: any` - No description available
  * `lookupFunctions: LookupFunctions` - No description available


* `connect(binding: Binding, scope: Scope): void` - 
  * `binding: Binding` - No description available
  * `scope: Scope` - No description available


* `evaluate(scope: Scope, lookupFunctions: LookupFunctions): any` - 
  * `scope: Scope` - No description available
  * `lookupFunctions: LookupFunctions` - No description available



### ValueConverterResource

A ValueConverter resource.

#### Properties


#### Methods


* `initialize(container: Container, target: any): void` - 
  * `container: Container` - No description available
  * `target: any` - No description available


* `register(registry: any, name: string): void` - 
  * `registry: any` - No description available
  * `name: string` - No description available


* `static convention(name: string): ValueConverterResource` - 
  * `name: string` - No description available



## Interfaces


### Binding

Provides high-level access to the definition of a binding, which connects the properties of
binding target objects (typically, HTML elements), and any data source.

#### Properties

* `isBound: boolean` - Whether the binding is data-bound.
* `mode: bindingMode` - The directionality of the binding.
* `source: Scope` - The binding&#x27;s source.
* `sourceExpression: Expression` - The expression to access/assign/connect the binding source property.

#### Methods


* `bind(source: Scope): void` - Connects the binding to a scope.
  * `source: Scope` - No description available.


* `callSource(event: any): any` - Calls the source method with the specified args object. This method is present in event bindings like trigger/delegate.
  * `event: any` - No description available.


* `unbind(): void` - Disconnects the binding from a scope.


* `updateSource(value: any): void` - Assigns a value to the source.
  * `value: any` - No description available.


* `updateTarget(value: any): void` - Assigns a value to the target.
  * `value: any` - No description available.



### BindingExpression

A factory for binding instances.

#### Properties


#### Methods


* `createBinding(target: any): Binding` - 
  * `target: any` - No description available.



### CallExpression

A factory for binding instances.

#### Properties


#### Methods


* `createBinding(target: any): Binding` - 
  * `target: any` - No description available.



### Callable

A callable object.

#### Properties


#### Methods


* `call(context: any, newValue: any, oldValue: any): void` - 
  * `context: any` - No description available.
  * `newValue: any` - No description available.
  * `oldValue: any` - No description available.



### CollectionObserver

Observes collection mutation.

#### Properties


#### Methods


* `subscribe(callback: ): Disposable` - Subscribe to collection mutation events.
  * `callback: ` - No description available.



### Disposable

Provides a mechanism for releasing resources.

#### Properties


#### Methods


* `dispose(): void` - Performs tasks associated with freeing, releasing, or resetting resources.



### ExpressionVisitor

An expression AST visitor.

#### Properties


#### Methods



### ICollectionObserverSplice

The change record of a collection mutation.

#### Properties

* `addedCount: number` - Number of items added to the collection.
* `index: number` - The position at which the items were added.
* `key: K` - The key of the Map item that was changed.
* `object: ` - The observed Set or Map after the change.
* `oldValue: T` - The value of the Map item prior to the change.
* `removed: Array` - A collection of items that were removed from the collection.
* `type: ` - The type of change that has taken place. Valid options are &quot;add&quot;, &quot;delete&quot;, &quot;update&quot;, and  &quot;clear&quot;.
* `value: T` - The Set value that was either added or removed.

#### Methods



### InternalCollectionObserver

Observes collection mutation.

#### Properties


#### Methods


* `flushChangeRecords(): void` - This will flush the change records of this observer and call any subscribers if applicable.


* `getLengthObserver(): any` - Get a length observer for this collection.


* `reset(oldCollection: ): void` - Reset the observer to the passed collection and call any subscribers with changes between the current collection and the reset collection.
  * `oldCollection: ` - 



* `subscribe(callback: ): void` - Subscribe to collection mutation events with a callback function.
  * `callback: ` - No description available.


* `unsubscribe(callback: ): void` - Unsubscribes a callback function from collection mutation changes.
  * `callback: ` - No description available.



### InternalPropertyObserver

Observes property changes.

#### Properties


#### Methods


* `getValue(): any` - Gets the property value.


* `setValue(newValue: any): void` - Sets the property value.
  * `newValue: any` - No description available.


* `subscribe(callback: ): void` - Subscribe to property changes with a callback function.
  * `callback: ` - No description available.


* `unsubscribe(callback: ): void` - Unsubscribes a callback function from property changes.
  * `callback: ` - No description available.



### ListenerExpression

A factory for binding instances.

#### Properties


#### Methods


* `createBinding(target: any): Binding` - 
  * `target: any` - No description available.



### LookupFunctions

Lookup functions for value converter and binding behavior resources.

#### Properties


#### Methods


* `bindingBehaviors(name: string): any` - 
  * `name: string` - No description available.


* `valueConverters(name: string): any` - 
  * `name: string` - No description available.



### NameExpression

A factory for binding instances.

#### Properties


#### Methods


* `createBinding(target: any): Binding` - 
  * `target: any` - No description available.



### ObjectObservationAdapter

Provides efficient property observers for properties that would otherwise require dirty-checking.

#### Properties


#### Methods


* `getObserver(object: any, propertyName: string, descriptor: PropertyDescriptor): ` - 
  * `object: any` - No description available.
  * `propertyName: string` - No description available.
  * `descriptor: PropertyDescriptor` - No description available.



### OverrideContext

The &quot;parallel&quot; or &quot;artificial&quot; aspect of the binding scope. Provides access to the parent binding
context and stores contextual bindable members such as $event, $index, $odd, etc. Members on this
object take precedence over members of the bindingContext object.

#### Properties

* `bindingContext: any` - No description available.
* `parentOverrideContext: OverrideContext` - No description available.

#### Methods



### PropertyObserver

Observes property changes.

#### Properties


#### Methods


* `subscribe(callback: ): Disposable` - Subscribe to property change events.
  * `callback: ` - No description available.



### SVGAnalyzer

Internal API used to analyze SVG attributes.

#### Properties


#### Methods


* `isStandardSvgAttribute(nodeName: string, attributeName: string): boolean` - 
  * `nodeName: string` - No description available.
  * `attributeName: string` - No description available.



### Scope

The two part binding scope. The first part is the bindingContext which represents the primary scope, typically a
view-model instance and second the overrideContext

#### Properties

* `bindingContext: any` - The primary aspect of the binding scope.  Typically a view-model instance.
* `overrideContext: OverrideContext` - The &quot;parallel&quot; or &quot;artificial&quot; aspect of the binding scope. Provides access to the parent binding
context and stores contextual bindable members such as $event, $index, $odd, etc. Members on this
object take precedence over members of the bindingContext object.

#### Methods



## Constants

* `sourceContext: string` - A context used when invoking a binding&#x27;s callable API to notify
the binding that the context is a &quot;source update&quot;.
* `targetContext: string` - A context used when invoking a binding&#x27;s callable API to notify
the binding that the context is a &quot;target update&quot;.

## Functions


* `bindingBehavior(name: string): any` - Decorator: Indicates that the decorated class is a binding behavior.
  * `name: string` - The name of the binding behavior.



* `camelCase(name: string): string` - camel-cases a string.
  * `name: string` - No description available.


* `computedFrom(propertyNames: ): any` - Decorator: Indicates that the decorated property is computed from other properties.
  * `propertyNames: ` - The names of the properties the decorated property is computed from.  Simple property names, not expressions.



* `connectBindingToSignal(binding: Binding, name: string): void` - Connects a binding instance to a signal.
  * `binding: Binding` - The binding instance that should be triggered to refresh by the signal.
  * `name: string` - The signal to associate with the binding instance.



* `connectable(): void` - Decorator: Internal decorator used to mixin binding APIs.


* `createOverrideContext(bindingContext: any, parentOverrideContext?: OverrideContext): OverrideContext` - Creates an overrideContext object with the supplied bindingContext and optional parent overrideContext.
  * `bindingContext: any` - No description available.
  * `parentOverrideContext?: OverrideContext` - No description available.


* `createScopeForTest(bindingContext: any, parentBindingContext?: any): Scope` - Creates a scope object for testing purposes.
  * `bindingContext: any` - No description available.
  * `parentBindingContext?: any` - No description available.


* `declarePropertyDependencies(ctor: any, propertyName: string, dependencies: ): void` - Declares a property&#x27;s dependencies.
  * `ctor: any` - No description available.
  * `propertyName: string` - No description available.
  * `dependencies: ` - No description available.


* `disableConnectQueue(): void` - Disables the connect queue.


* `enableConnectQueue(): void` - Enables the connect queue.


* `enqueueBindingConnect(binding: Binding): void` - Internal API that adds a binding to the connect queue.
  * `binding: Binding` - No description available.


* `getChangeRecords(): any` - An internal API used by Aurelia&#x27;s array observation components.


* `getContextFor(name: string, scope: Scope, ancestor?: number): any` - Gets the binding context for the specified property name by looking for the property
on the scope.bindingContext, then on the scope.overrideContext before repeating on
the ancestor scopes until the property is found. If the property is not found anywhere
in the scope then the root binding context is returned.
  * `name: string` - The property name.
  * `scope: Scope` - The scope.
  * `ancestor?: number` - The number of ancestor scopes to skip back to (used in $parent bindings).



* `hasDeclaredDependencies(descriptor: PropertyDescriptor): boolean` - Returns whether a property&#x27;s dependencies have been declared.
  * `descriptor: PropertyDescriptor` - No description available.


* `mergeSplice(splices: any, index: number, removed: any, addedCount: number): any` - An internal API used by Aurelia&#x27;s array observation components.
  * `splices: any` - No description available.
  * `index: number` - No description available.
  * `removed: any` - No description available.
  * `addedCount: number` - No description available.


* `observable(targetOrConfig?: Object, key?: any, descriptor?: any): any` - Decorator: Specifies that a property is observable.
  * `targetOrConfig?: Object` - The name of the property, or a configuration object.

  * `key?: any` - No description available.
  * `descriptor?: any` - No description available.


* `setConnectQueueThreshold(value: number): void` - set the number of bindings that should connect immediately before resorting to queueing.
  * `value: number` - No description available.


* `signalBindings(name: string): void` - Signals all bindings that are associated with the specified signal name.
  * `name: string` - The signal associated with the binding(s) to refresh.



* `subscriberCollection(): any` - Decorator: Adds efficient subscription management methods to the decorated class&#x27;s prototype.


* `valueConverter(name: string): any` - Decorator: Indicates that the decorated class is a value converter.
  * `name: string` - The name of the value converter.


