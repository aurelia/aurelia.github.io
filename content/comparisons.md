---
title: "Framework Comparisons"
description: "See how Aurelia's elegant syntax compares to other popular frameworks and libraries. This is just a basic comparison, but it should give you a good idea of how Aurelia compares to other frameworks and libraries."
url: "/comparisons/"
type: "comparisons"
comparisons:
  - title: "Conditional Rendering"
    description: "Conditional rendering allows you to render different content based on the state of your application."
    aurelia:
      title: "Aurelia"
      code: |
        <!-- Simple if binding -->
        <div if.bind="isVisible">Hello World</div>

        <!-- If/else rendering -->
        <div if.bind="isAuthenticated">
          Welcome back, ${username}!
        </div>
        <div else>
          Please log in
        </div>
    others:
      - framework: "React"
        code: |
          {/* Simple conditional */}
          {isVisible && <div>Hello World</div>}

          {/* If/else rendering */}
          {isAuthenticated ? (
            <div>Welcome back, {username}!</div>
          ) : (
            <div>Please log in</div>
          )}
      - framework: "Vue"
        code: |
          <!-- Simple v-if -->
          <div v-if="isVisible">Hello World</div>

          <!-- If/else rendering -->
          <div v-if="isAuthenticated">
            Welcome back, {{ username }}!
          </div>
          <div v-else>
            Please log in
          </div>
      - framework: "Angular"
        code: |
          <!-- Simple *ngIf -->
          <div *ngIf="isVisible">Hello World</div>

          <!-- If/else rendering -->
          <div *ngIf="isAuthenticated; else loginPrompt">
            Welcome back, {{ username }}!
          </div>
          <ng-template #loginPrompt>
            <div>Please log in</div>
          </ng-template>
      - framework: "Svelte"
        code: |
          <!-- Simple conditional -->
          {#if isVisible}
            <div>Hello World</div>
          {/if}

          <!-- If/else rendering -->
          {#if isAuthenticated}
            <div>Welcome back, {username}!</div>
          {:else}
            <div>Please log in</div>
          {/if}
  - title: "Two-way Binding"
    description: "Two-way binding allows you to bind a property to an input element and have the property update when the input changes."
    aurelia:
      title: "Aurelia"
      code: |
        <!-- Two-way binding -->
        <input type="text" value.bind="username">
        <p>Hello, ${username}!</p>
    others:
      - framework: "React"
        code: |
          {/* Two-way binding equivalent */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <p>Hello, {username}!</p>
      - framework: "Vue"
        code: |
          <!-- Two-way binding -->
          <input type="text" v-model="username">
          <p>Hello, {{ username }}!</p>
      - framework: "Angular"
        code: |
          <!-- Two-way binding -->
          <input type="text" [(ngModel)]="username">
          <p>Hello, {{ username }}!</p>
      - framework: "Svelte"
        code: |
          <!-- Two-way binding -->
          <input type="text" bind:value={username}>
          <p>Hello, {username}!</p>
  - title: "List Rendering"
    description: "List rendering allows you to render a list of items."
    aurelia:
      title: "Aurelia"
      code: |
        <!-- List rendering with repeat.for -->
        <ul>
          <li repeat.for="item of items">${item.name}</li>
        </ul>
    others:
      - framework: "React"
        code: |
          {/* List rendering with map */}
          <ul>
            {items.map(item => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
      - framework: "Vue"
        code: |
          <!-- List rendering with v-for -->
          <ul>
            <li v-for="item in items" :key="item.id">
              {{ item.name }}
            </li>
          </ul>
      - framework: "Angular"
        code: |
          <!-- List rendering with *ngFor -->
          <ul>
            <li *ngFor="let item of items; trackBy: trackByItemId">
              {{ item.name }}
            </li>
          </ul>
      - framework: "Svelte"
        code: |
          <!-- List rendering with each block -->
          <ul>
            {#each items as item (item.id)}
              <li>{item.name}</li>
            {/each}
          </ul>
  - title: "Event Handling"
    description: "Event handling allows you to handle events from the DOM."
    aurelia:
      title: "Aurelia"
      code: |
        <!-- Simple click event -->
        <button click.trigger="handleClick()">Click me</button>

        <!-- Event with parameter -->
        <button click.trigger="handleClick($event)">With Event</button>

        <!-- Key events -->
        <input keyup.trigger="handleKeyUp($event)">
    others:
      - framework: "React"
        code: |
          {/* Simple click event */}
          <button onClick={handleClick}>Click me</button>

          {/* Event with parameter */}
          <button onClick={(e) => handleClick(e)}>With Event</button>

          {/* Key events */}
          <input onKeyUp={(e) => handleKeyUp(e)} />
      - framework: "Vue"
        code: |
          <!-- Simple click event -->
          <button @click="handleClick">Click me</button>

          <!-- Event with parameter -->
          <button @click="handleClick($event)">With Event</button>

          <!-- Key events -->
          <input @keyup="handleKeyUp">
      - framework: "Angular"
        code: |
          <!-- Simple click event -->
          <button (click)="handleClick()">Click me</button>

          <!-- Event with parameter -->
          <button (click)="handleClick($event)">With Event</button>

          <!-- Key events -->
          <input (keyup)="handleKeyUp($event)">
      - framework: "Svelte"
        code: |
          <!-- Simple click event -->
          <button on:click={handleClick}>Click me</button>

          <!-- Event with parameter -->
          <button on:click={(e) => handleClick(e)}>With Event</button>

          <!-- Key events -->
          <input on:keyup={handleKeyUp}>

  - title: "Class & Style Binding"
    description: "Class and style binding allows you to bind classes and styles to an element."
    aurelia:
      title: "Aurelia"
      code: |
        <!-- Class binding -->
        <div class.bind="dynamicClass">Dynamic class</div>
        <div class="${condition ? 'active' : 'inactive'}">Conditional</div>

        <!-- Style binding -->
        <div style.bind="dynamicStyles">Dynamic styles</div>
        <div style="color: ${textColor}">Dynamic color</div>
    others:
      - framework: "React"
        code: |
          {/* Class binding */}
          <div className={dynamicClass}>Dynamic class</div>
          <div className={condition ? 'active' : 'inactive'}>Conditional</div>

          {/* Style binding */}
          <div style={dynamicStyles}>Dynamic styles</div>
          <div style={{ color: textColor }}>Dynamic color</div>
      - framework: "Vue"
        code: |
          <!-- Class binding -->
          <div :class="dynamicClass">Dynamic class</div>
          <div :class="{ active: isActive, 'text-danger': hasError }">
            Multiple classes
          </div>
          <div :class="[baseClass, condition ? 'active' : '']">
            Array syntax
          </div>

          <!-- Style binding -->
          <div :style="dynamicStyles">Dynamic styles</div>
          <div :style="{ color: textColor, fontSize: size + 'px' }">
            Dynamic color
          </div>
      - framework: "Angular"
        code: |
          <!-- Class binding -->
          <div [class]="dynamicClass">Dynamic class</div>
          <div [class.active]="condition">Conditional</div>

          <!-- Style binding -->
          <div [style]="dynamicStyles">Dynamic styles</div>
          <div [style.color]="textColor">Dynamic color</div>
      - framework: "Svelte"
        code: |
          <!-- Class binding -->
          <div class={dynamicClass}>Dynamic class</div>
          <div class:active={condition}>Conditional</div>

          <!-- Style binding -->
          <div style={dynamicStyles}>Dynamic styles</div>
          <div style:color={textColor}>Dynamic color</div>

  - title: "Component Creation"
    description: "Component creation allows you to create a new component."
    aurelia:
      title: "Aurelia"
      code: |
        // my-component.ts
        @customElement({
          name: 'my-component',
          template: `
            <h1>\${message}</h1>
            <button click.trigger="sayHello()">Greet</button>
          `
        })
        export class MyComponent {
          message = 'Hello World';
          
          @bindable name: string;
          
          sayHello() {
            console.log(`Hello ${this.name}!`);
          }
        }
    others:
      - framework: "React"
        code: |
          // MyComponent.jsx
          import { useState } from 'react';

          function MyComponent({ name }) {
            const [message] = useState('Hello World');

            const sayHello = () => {
              console.log(`Hello ${name}!`);
            };

            return (
              <>
                <h1>{message}</h1>
                <button onClick={sayHello}>Greet</button>
              </>
            );
          }
      - framework: "Vue"
        code: |
          <!-- MyComponent.vue -->
          <script setup lang="ts">
          import { ref } from 'vue';

          interface Props {
            name: string
          }

          const props = defineProps<Props>()
          const message = ref('Hello World')

          function sayHello() {
            console.log(`Hello ${props.name}!`)
          }
          </script>

          <template>
            <h1>{{ message }}</h1>
            <button @click="sayHello">Greet</button>
          </template>
      - framework: "Angular"
        code: |
          // my-component.ts
          @Component({
            selector: 'app-my-component',
            template: `
              <h1>{{ message }}</h1>
              <button (click)="sayHello()">Greet</button>
            `
          })
          export class MyComponent {
            @Input() name: string;
            message = 'Hello World';
            
            sayHello() {
              console.log(`Hello ${this.name}!`);
            }
          }
      - framework: "Svelte"
        code: |
          <!-- MyComponent.svelte -->
          <script>
            export let name;
            let message = 'Hello World';
            
            function sayHello() {
              console.log(`Hello ${name}!`);
            }
          </script>

          <h1>{message}</h1>
          <button on:click={sayHello}>Greet</button>

  - title: "Computed Properties"
    description: "Computed properties are properties that are derived from other properties. They are cached and only re-evaluated when their dependencies change."
    aurelia:
      title: "Aurelia"
      code: |
        export class MyComponent {
          firstName = 'John';
          lastName = 'Doe';
          
          get fullName() {
            return `${this.firstName} ${this.lastName}`;
          }
        }

        <!-- Template -->
        <div>${fullName}</div>
    others:
      - framework: "React"
        code: |
          import { useState, useMemo } from 'react';

          function MyComponent() {
            const [firstName, setFirstName] = useState('John');
            const [lastName, setLastName] = useState('Doe');

            const fullName = useMemo(() =>
              `${firstName} ${lastName}`,
              [firstName, lastName]
            );

            return <div>{fullName}</div>;
          }
      - framework: "Vue"
        code: |
          <script setup lang="ts">
          import { ref, computed } from 'vue';

          const firstName = ref<string>('John')
          const lastName = ref<string>('Doe')

          const fullName = computed<string>(() => {
            return `${firstName.value} ${lastName.value}`
          })
          </script>

          <template>
            <div>{{ fullName }}</div>
          </template>
      - framework: "Angular"
        code: |
          export class MyComponent {
            firstName = 'John';
            lastName = 'Doe';
            
            get fullName() {
              return `${this.firstName} ${this.lastName}`;
            }
          }

          <!-- Template -->
          <div>{{ fullName }}</div>
      - framework: "Svelte"
        code: |
          <script>
            let firstName = 'John';
            let lastName = 'Doe';
            
            $: fullName = `${firstName} ${lastName}`;
          </script>

          <div>{fullName}</div>

  - title: "Template References"
    description: "Template references allow you to reference elements in the template from the component definition without needing to query the DOM."
    aurelia:
      title: "Aurelia"
      code: |
        <!-- Template reference -->
        <input ref="nameInput" type="text">
        <button click.trigger="focusInput()">Focus</button>

        // Component class
        export class MyComponent {
          nameInput: HTMLInputElement;
          
          focusInput() {
            this.nameInput.focus();
          }
        }
    others:
      - framework: "React"
        code: |
          import { useRef } from 'react';

          function MyComponent() {
            const nameInput = useRef();

            const focusInput = () => {
              nameInput.current.focus();
            };

            return (
              <>
                <input ref={nameInput} type="text" />
                <button onClick={focusInput}>Focus</button>
              </>
            );
          }
      - framework: "Vue"
        code: |
          <script setup>
          import { ref } from 'vue';

          const nameInput = ref(null)

          function focusInput() {
            nameInput.value.focus()
          }
          </script>

          <template>
            <input ref="nameInput" type="text">
            <button @click="focusInput">Focus</button>
          </template>
      - framework: "Angular"
        code: |
          <!-- Template -->
          <input #nameInput type="text">
          <button (click)="focusInput(nameInput)">Focus</button>

          // Component class
          export class MyComponent {
            focusInput(input: HTMLInputElement) {
              input.focus();
            }
          }
      - framework: "Svelte"
        code: |
          <script>
            let nameInput;
            
            function focusInput() {
              nameInput.focus();
            }
          </script>

          <input bind:this={nameInput} type="text">
          <button on:click={focusInput}>Focus</button>

  - title: "Lifecycle Hooks"
    description: "Lifecycle hooks allow you to run code at specific stages of a component's lifecycle, such as when it mounts or unmounts."
    aurelia:
      title: "Aurelia"
      code: |
        export class MyComponent {
          data = null;

          attached() {
            // Runs when component is attached to DOM
            this.data = fetchData();
          }

          detaching() {
            // Runs before component is removed from DOM
            cleanup();
          }
        }
    others:
      - framework: "React"
        code: |
          import { useEffect } from 'react';

          function MyComponent() {
            useEffect(() => {
              // Runs when component mounts
              const data = fetchData();

              return () => {
                // Cleanup when component unmounts
                cleanup();
              };
            }, []); // Empty array means run once on mount

            return <div>My Component</div>;
          }
      - framework: "Vue"
        code: |
          <script setup>
          import { onMounted, onUnmounted } from 'vue';

          onMounted(() => {
            // Runs when component is mounted
            const data = fetchData();
          });

          onUnmounted(() => {
            // Runs when component is unmounted
            cleanup();
          });
          </script>

          <template>
            <div>My Component</div>
          </template>
      - framework: "Angular"
        code: |
          import { Component, OnInit, OnDestroy } from '@angular/core';

          @Component({
            selector: 'app-my-component',
            template: '<div>My Component</div>'
          })
          export class MyComponent implements OnInit, OnDestroy {
            ngOnInit() {
              // Runs when component is initialized
              const data = fetchData();
            }

            ngOnDestroy() {
              // Runs when component is destroyed
              cleanup();
            }
          }
      - framework: "Svelte"
        code: |
          <script>
            import { onMount, onDestroy } from 'svelte';

            onMount(() => {
              // Runs when component is mounted
              const data = fetchData();

              return () => {
                // Optional cleanup on unmount
                cleanup();
              };
            });

            onDestroy(() => {
              // Runs when component is destroyed
              cleanup();
            });
          </script>

          <div>My Component</div>

  - title: "Props & Event Emission"
    description: "Props allow parent components to pass data to child components, while events allow child components to communicate back to parents."
    aurelia:
      title: "Aurelia"
      code: |
        // child-component.ts
        import { bindable, EventAggregator } from 'aurelia';

        export class ChildComponent {
          @bindable message: string;
          @bindable onUpdate: (value: string) => void;

          handleClick() {
            // Emit event to parent
            this.onUpdate?.('Updated value');
          }
        }

        <!-- Parent usage -->
        <child-component
          message.bind="parentMessage"
          on-update.call="handleUpdate($event)">
        </child-component>
    others:
      - framework: "React"
        code: |
          // ChildComponent.jsx
          function ChildComponent({ message, onUpdate }) {
            const handleClick = () => {
              onUpdate('Updated value');
            };

            return (
              <div>
                <p>{message}</p>
                <button onClick={handleClick}>Update</button>
              </div>
            );
          }

          // Parent usage
          <ChildComponent
            message={parentMessage}
            onUpdate={handleUpdate}
          />
      - framework: "Vue"
        code: |
          <!-- ChildComponent.vue -->
          <script setup>
          const props = defineProps({
            message: String
          });

          const emit = defineEmits(['update']);

          const handleClick = () => {
            emit('update', 'Updated value');
          };
          </script>

          <template>
            <div>
              <p>{{ message }}</p>
              <button @click="handleClick">Update</button>
            </div>
          </template>

          <!-- Parent usage -->
          <ChildComponent
            :message="parentMessage"
            @update="handleUpdate"
          />
      - framework: "Angular"
        code: |
          // child.component.ts
          import { Component, Input, Output, EventEmitter } from '@angular/core';

          @Component({
            selector: 'app-child',
            template: `
              <div>
                <p>{{ message }}</p>
                <button (click)="handleClick()">Update</button>
              </div>
            `
          })
          export class ChildComponent {
            @Input() message: string;
            @Output() update = new EventEmitter<string>();

            handleClick() {
              this.update.emit('Updated value');
            }
          }

          <!-- Parent usage -->
          <app-child
            [message]="parentMessage"
            (update)="handleUpdate($event)">
          </app-child>
      - framework: "Svelte"
        code: |
          <!-- ChildComponent.svelte -->
          <script>
            import { createEventDispatcher } from 'svelte';
            export let message;

            const dispatch = createEventDispatcher();

            function handleClick() {
              dispatch('update', 'Updated value');
            }
          </script>

          <div>
            <p>{message}</p>
            <button on:click={handleClick}>Update</button>
          </div>

          <!-- Parent usage -->
          <ChildComponent
            message={parentMessage}
            on:update={handleUpdate}
          />

  - title: "Watchers & Observers"
    description: "Watchers allow you to perform side effects in response to data changes."
    aurelia:
      title: "Aurelia"
      code: |
        import { watch } from 'aurelia';

        export class MyComponent {
          username = '';

          @watch('username')
          usernameChanged(newValue, oldValue) {
            console.log(`Username changed from ${oldValue} to ${newValue}`);
            // Perform side effect
            validateUsername(newValue);
          }
        }
    others:
      - framework: "React"
        code: |
          import { useState, useEffect } from 'react';

          function MyComponent() {
            const [username, setUsername] = useState('');

            useEffect(() => {
              // Watch username changes
              console.log(`Username changed to ${username}`);
              validateUsername(username);
            }, [username]); // Run effect when username changes

            return <input value={username} onChange={e => setUsername(e.target.value)} />;
          }
      - framework: "Vue"
        code: |
          <script setup>
          import { ref, watch } from 'vue';

          const username = ref('');

          watch(username, (newValue, oldValue) => {
            console.log(`Username changed from ${oldValue} to ${newValue}`);
            validateUsername(newValue);
          });
          </script>

          <template>
            <input v-model="username">
          </template>
      - framework: "Angular"
        code: |
          import { Component, OnChanges, SimpleChanges } from '@angular/core';

          @Component({
            selector: 'app-my-component',
            template: '<input [(ngModel)]="username">'
          })
          export class MyComponent implements OnChanges {
            username = '';

            ngOnChanges(changes: SimpleChanges) {
              if (changes['username']) {
                console.log(`Username changed to ${this.username}`);
                validateUsername(this.username);
              }
            }
          }
      - framework: "Svelte"
        code: |
          <script>
            let username = '';

            $: {
              // Reactive statement - runs when username changes
              console.log(`Username changed to ${username}`);
              validateUsername(username);
            }
          </script>

          <input bind:value={username}>

  - title: "Slots & Content Projection"
    description: "Slots allow parent components to pass content into child components, enabling flexible and reusable component designs."
    aurelia:
      title: "Aurelia"
      code: |
        // card.html
        <template>
          <div class="card">
            <div class="card-header">
              <au-slot name="header">Default Header</au-slot>
            </div>
            <div class="card-body">
              <au-slot>Default content</au-slot>
            </div>
          </div>
        </template>

        <!-- Usage -->
        <card>
          <div au-slot="header">Custom Header</div>
          <p>Custom content goes here</p>
        </card>
    others:
      - framework: "React"
        code: |
          // Card.jsx
          function Card({ header, children }) {
            return (
              <div className="card">
                <div className="card-header">
                  {header || 'Default Header'}
                </div>
                <div className="card-body">
                  {children || 'Default content'}
                </div>
              </div>
            );
          }

          // Usage
          <Card header={<div>Custom Header</div>}>
            <p>Custom content goes here</p>
          </Card>
      - framework: "Vue"
        code: |
          <!-- Card.vue -->
          <template>
            <div class="card">
              <div class="card-header">
                <slot name="header">Default Header</slot>
              </div>
              <div class="card-body">
                <slot>Default content</slot>
              </div>
            </div>
          </template>

          <!-- Usage -->
          <Card>
            <template #header>
              <div>Custom Header</div>
            </template>
            <p>Custom content goes here</p>
          </Card>
      - framework: "Angular"
        code: |
          // card.component.html
          <div class="card">
            <div class="card-header">
              <ng-content select="[header]">Default Header</ng-content>
            </div>
            <div class="card-body">
              <ng-content>Default content</ng-content>
            </div>
          </div>

          <!-- Usage -->
          <app-card>
            <div header>Custom Header</div>
            <p>Custom content goes here</p>
          </app-card>
      - framework: "Svelte"
        code: |
          <!-- Card.svelte -->
          <div class="card">
            <div class="card-header">
              <slot name="header">Default Header</slot>
            </div>
            <div class="card-body">
              <slot>Default content</slot>
            </div>
          </div>

          <!-- Usage -->
          <Card>
            <div slot="header">Custom Header</div>
            <p>Custom content goes here</p>
          </Card>

  - title: "Forms & Validation"
    description: "Form handling and validation patterns for user input."
    aurelia:
      title: "Aurelia"
      code: |
        import { newInstanceOf } from 'aurelia';
        import { ValidationController, ValidationRules } from '@aurelia/validation';

        export class MyForm {
          email = '';
          password = '';

          constructor(
            @newInstanceOf(ValidationController) private controller: ValidationController
          ) {
            ValidationRules
              .ensure('email').required().email()
              .ensure('password').required().minLength(8)
              .on(this);
          }

          async submit() {
            const result = await this.controller.validate();
            if (result.valid) {
              // Process form
            }
          }
        }

        <!-- Template -->
        <form submit.trigger="submit()">
          <input type="email" value.bind="email & validate">
          <input type="password" value.bind="password & validate">
          <button type="submit">Submit</button>
        </form>
    others:
      - framework: "React"
        code: |
          import { useState } from 'react';

          function MyForm() {
            const [email, setEmail] = useState('');
            const [password, setPassword] = useState('');
            const [errors, setErrors] = useState({});

            const validate = () => {
              const newErrors = {};
              if (!email) newErrors.email = 'Required';
              else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email';
              if (!password) newErrors.password = 'Required';
              else if (password.length < 8) newErrors.password = 'Min 8 characters';
              return newErrors;
            };

            const handleSubmit = (e) => {
              e.preventDefault();
              const newErrors = validate();
              if (Object.keys(newErrors).length === 0) {
                // Process form
              } else {
                setErrors(newErrors);
              }
            };

            return (
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                {errors.email && <span>{errors.email}</span>}
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                {errors.password && <span>{errors.password}</span>}
                <button type="submit">Submit</button>
              </form>
            );
          }
      - framework: "Vue"
        code: |
          <script setup>
          import { ref, reactive } from 'vue';

          const email = ref('');
          const password = ref('');
          const errors = reactive({});

          const validate = () => {
            const newErrors = {};
            if (!email.value) newErrors.email = 'Required';
            else if (!/\S+@\S+\.\S+/.test(email.value)) newErrors.email = 'Invalid email';
            if (!password.value) newErrors.password = 'Required';
            else if (password.value.length < 8) newErrors.password = 'Min 8 characters';
            return newErrors;
          };

          const handleSubmit = () => {
            const newErrors = validate();
            if (Object.keys(newErrors).length === 0) {
              // Process form
            } else {
              Object.assign(errors, newErrors);
            }
          };
          </script>

          <template>
            <form @submit.prevent="handleSubmit">
              <input type="email" v-model="email">
              <span v-if="errors.email">{{ errors.email }}</span>
              <input type="password" v-model="password">
              <span v-if="errors.password">{{ errors.password }}</span>
              <button type="submit">Submit</button>
            </form>
          </template>
      - framework: "Angular"
        code: |
          import { Component } from '@angular/core';
          import { FormBuilder, FormGroup, Validators } from '@angular/forms';

          @Component({
            selector: 'app-my-form',
            template: `
              <form [formGroup]="form" (ngSubmit)="onSubmit()">
                <input type="email" formControlName="email">
                <span *ngIf="form.get('email')?.errors?.['required']">
                  Required
                </span>
                <span *ngIf="form.get('email')?.errors?.['email']">
                  Invalid email
                </span>
                <input type="password" formControlName="password">
                <span *ngIf="form.get('password')?.errors?.['required']">
                  Required
                </span>
                <span *ngIf="form.get('password')?.errors?.['minlength']">
                  Min 8 characters
                </span>
                <button type="submit" [disabled]="form.invalid">Submit</button>
              </form>
            `
          })
          export class MyFormComponent {
            form: FormGroup;

            constructor(private fb: FormBuilder) {
              this.form = this.fb.group({
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required, Validators.minLength(8)]]
              });
            }

            onSubmit() {
              if (this.form.valid) {
                // Process form
              }
            }
          }
      - framework: "Svelte"
        code: |
          <script>
            let email = '';
            let password = '';
            let errors = {};

            function validate() {
              const newErrors = {};
              if (!email) newErrors.email = 'Required';
              else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email';
              if (!password) newErrors.password = 'Required';
              else if (password.length < 8) newErrors.password = 'Min 8 characters';
              return newErrors;
            }

            function handleSubmit() {
              const newErrors = validate();
              if (Object.keys(newErrors).length === 0) {
                // Process form
              } else {
                errors = newErrors;
              }
            }
          </script>

          <form on:submit|preventDefault={handleSubmit}>
            <input type="email" bind:value={email}>
            {#if errors.email}<span>{errors.email}</span>{/if}
            <input type="password" bind:value={password}>
            {#if errors.password}<span>{errors.password}</span>{/if}
            <button type="submit">Submit</button>
          </form>
---