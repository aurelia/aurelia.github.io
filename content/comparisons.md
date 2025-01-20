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
          <li repeat.for="item of items">${item}</li>
        </ul>
    others:
      - framework: "React"
        code: |
          {/* List rendering with map */}
          <ul>
            {items.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
      - framework: "Vue"
        code: |
          <!-- List rendering with v-for -->
          <ul>
            <li v-for="(item, index) in items" :key="item.id || index">
              {{ item }}
            </li>
          </ul>
      - framework: "Angular"
        code: |
          <!-- List rendering with *ngFor -->
          <ul>
            <li *ngFor="let item of items">{{ item }}</li>
          </ul>
      - framework: "Svelte"
        code: |
          <!-- List rendering with each block -->
          <ul>
            {#each items as item}
              <li>{item}</li>
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
---