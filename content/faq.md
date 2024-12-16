---
title: "FAQ"
description: "Frequently asked questions about Aurelia"
type: "faq"
---

## Who maintains Aurelia?

Aurelia was originally architected by Rob Eisenberg in 2015, bringing his extensive experience in front-end development and framework design to create a powerful, developer-friendly framework. Today, Aurelia has grown into a vibrant, community-driven project with a dedicated core team of passionate developers who actively maintain and enhance the framework.

The combination of professional leadership and community involvement ensures Aurelia remains modern, stable, and responsive to developers' needs. Our core team works closely with community contributors to maintain high quality standards while continuing to evolve the framework.

---

## What's the difference between Aurelia 1 and Aurelia 2?

Aurelia 2 represents the next evolution of the framework, building upon the solid foundation of Aurelia 1 while introducing modern features and improvements. Key enhancements include:

- **Enhanced Performance**: Completely rewritten rendering engine with better memory management and faster updates
- **Modern TypeScript**: Built from the ground up with TypeScript, offering better type safety and developer experience
- **Simplified APIs**: Streamlined APIs while maintaining the convention-over-configuration philosophy
- **Better Browser Support**: Modern browser features support while maintaining broad compatibility
- **Smaller Bundle Size**: Improved tree-shaking and module system
- **Enhanced Reactivity**: New reactive system with better performance and debugging capabilities

Most Aurelia 1 applications can be migrated to Aurelia 2 with minimal changes, as the framework maintains high backwards compatibility while offering new features and improvements.

---

## Can I still use Aurelia 1?

Yes, you can continue using Aurelia 1. It's currently in maintenance mode, which means:

- Critical security fixes and major bugs will still be addressed
- The framework remains stable and production-ready
- Documentation and existing resources remain available
- Community support continues through forums and chat

However, new feature development and enhancements are focused on Aurelia 2. For new projects, we recommend starting with Aurelia 2 to take advantage of its modern features and ongoing development.

---

## Is Aurelia reliable?

Aurelia has established itself as one of the most reliable frameworks in the ecosystem since its inception in 2015. Our commitment to stability is demonstrated through:

- **Minimal Breaking Changes**: Even major version updates maintain high backwards compatibility
- **Semantic Versioning**: Strict adherence to semver principles
- **Long-term Support**: Extended support periods for major versions
- **Production Proven**: Used in mission-critical applications by organizations worldwide
- **Thorough Testing**: Comprehensive test coverage and rigorous review processes
- **Predictable Updates**: Clear deprecation policies and migration paths

This stability-first approach means developers can confidently build long-term applications without worrying about frequent breaking changes or major rewrites.

---

## Is Aurelia fast?

Aurelia is designed for exceptional performance while maintaining developer productivity. Key performance characteristics include:

- **Minimal Memory Footprint**: Efficient memory usage through smart dependency management
- **No Virtual DOM**: Direct DOM updates through our reactive binding system
- **Efficient Updates**: Fine-grained reactivity that updates only what needs to change
- **Smart Batching**: Automatic batching of DOM updates for optimal performance
- **Tree-Shakeable**: Only ship the code you actually use
- **Resource Efficient**: Lower CPU and memory usage means better battery life and reduced carbon footprint
- **Fast Startup**: Quick initial load times and time-to-interactive

These optimizations mean you can build complex applications that remain fast and responsive while being environmentally conscious and respectful of your users' hardware resources.

---

## Should I be concerned that Aurelia isn't as popular as other options?

While Aurelia may have a smaller community compared to some frameworks, this shouldn't be a concern for several reasons:

- **Production Ready**: Used in production by companies ranging from startups to Fortune 500 enterprises since 2015
- **Active Development**: Regular updates, bug fixes, and new features from both the core team and community
- **Dogfooding**: The core team uses Aurelia in production daily, ensuring we experience the framework just like our users do
- **Quality Over Quantity**: Our focused community produces high-quality plugins and resources
- **Direct Support**: Get answers directly from core team members on Discord and forums, often within hours
- **Enterprise Backing**: Commercial support available for business-critical applications
- **Strong Ecosystem**: Integration with popular tools and libraries works out of the box
- **Learning Resources**: Comprehensive documentation, video courses, and community tutorials
- **Job Security**: Companies using Aurelia tend to be long-term committed users, offering stable career opportunities
- **Proven Track Record**: 8+ years of production use in mission-critical applications

The size of a framework's community isn't always the best metric for evaluating its suitability. Aurelia's architecture, stability, and dedicated community make it an excellent choice for teams that value clean code, standards compliance, and long-term maintainability. Many developers find that Aurelia's smaller, more focused community actually leads to higher quality discussions and more personalized support than what's available in larger communities.

---

## How does Aurelia compare to other frameworks and libraries?

Aurelia stands out through several key advantages:

- **Clean, Convention-based Code**: Write less boilerplate and focus on your business logic
- **Standards Compliance**: Embraces web standards instead of creating framework-specific abstractions
- **Extensibility**: Highly modular architecture that's easy to extend and customize
- **Learning Curve**: Familiar concepts for developers who know JavaScript/TypeScript
- **Performance**: Excellent performance characteristics without complex optimization requirements
- **Reactivity**: A reactive binding system without the need for a virtual DOM resulting in better performance and debugging capabilities
- **Third-party friendly**: Aurelia is designed to work with a wide range of third-party libraries and tools without the need for complex configuration or wrappers
- **Testing**: First-class testing support with straightforward unit testing approaches
- **Enterprise Ready**: Built with large-scale applications in mind

While other frameworks might have larger ecosystems, Aurelia's focus on developer experience, standards compliance, and clean architecture makes it an excellent choice for teams who value maintainable, scalable code.

---

## How do I contribute to Aurelia?

We welcome contributions of all kinds from our community! There are many ways to contribute:

- **Code Contributions**: From fixing bugs to adding new features
- **Documentation**: Help improve our docs, fix typos, or add new examples
- **Tutorials & Blog Posts**: Share your knowledge and experiences
- **Bug Reports**: Help us identify and fix issues
- **Feature Requests**: Share your ideas for improving Aurelia
- **Community Support**: Help other developers on Discord and the forums
- **Testing**: Try new features and provide feedback

Every contribution, no matter how small, helps make Aurelia better for everyone. Check out our [Contributing Guide](https://docs.aurelia.io/community-contribution/contributor-guide) to get started.

---

## How to manage state in Aurelia 2 applications?

Aurelia 2 offers multiple ways to handle state management in your application:

- **Simple State Management**: Built-in observable properties for component state
- **Global State Management**: Official @aurelia/store package for Redux-style state
- **Third-Party Integration**: Easy setup with popular libraries like MobX and Redux
- **Local Component State**: Efficient state handling within components
- **Service-based State**: State sharing through dependency injection
- **Modern Reactivity**: Signal-based state management for precise updates

Choose the approach that matches your application's complexity - from simple component state to full application state management.

---

## What types of web applications can you build with Aurelia 2?

Aurelia 2 supports building any modern web application, including:

- **Modern Single Page Apps**: Fast, dynamic web applications
- **Progressive Web Applications**: Install-able apps with offline support
- **Enterprise Software**: Large-scale business applications
- **Micro Frontend Apps**: Independent, deployable frontend modules
- **Mobile Web Apps**: Touch-friendly, responsive applications
- **Basic Websites**: Simple, content-focused sites
- **Desktop Applications**: Cross-platform apps using Electron
- **Cloud-native Apps**: Integration with serverless architecture

Scale your application from a simple website to a complex enterprise system with Aurelia 2's flexible architecture.

---

## How to implement routing in Aurelia 2?

Aurelia 2's powerful routing system includes:

- **Easy Route Setup**: Simple component-to-route mapping
- **Nested Routes**: Parent-child route organization
- **Authentication Routes**: Secure routes with auth guards
- **Dynamic Routes**: URL parameters and query string support
- **Performance Routing**: Automatic code-splitting
- **Browser Integration**: HTML5 history API
- **Route Configuration**: Simple setup with decorators
- **Navigation Control**: Full lifecycle hooks

Build simple to complex navigation structures while maintaining clean, organized code.

---

## How to test Aurelia 2 applications?

Aurelia 2 makes testing your application straightforward with:

- **JavaScript Testing**: Support for Jest, Mocha, and popular test runners
- **UI Component Tests**: Isolated component testing tools
- **End-to-End Testing**: Integration with Playwright and Cypress
- **Testing Tools**: Built-in test helpers and utilities
- **Test Data Setup**: Easy dependency injection mocking
- **Cross-browser Testing**: Multi-browser test support
- **Automated Testing**: CI/CD pipeline integration

Write and maintain tests easily with Aurelia 2's testing-friendly architecture.

---

## What is Aurelia's license?

Aurelia is released under the MIT license, one of the most permissive and flexible open source licenses available. This means:

- **Free to Use**: Use Aurelia in personal and commercial projects at no cost
- **Modify Freely**: Modify the source code to suit your needs
- **Distribute**: Share your modifications with others
- **Commercial Use**: Use in commercial products without royalty fees
- **No Warranty**: Provided as-is with no warranties
- **Attribution**: Simple attribution requirement in your documentation

The MIT license ensures you can confidently use Aurelia in any project while maintaining full control of your code.

---

## How is Aurelia funded?

Aurelia thrives through a sustainable community-driven funding model:

- **Community Sponsors**: Individual developers and community members supporting through GitHub Sponsors and OpenCollective
- **Corporate Sponsors**: Companies using Aurelia in production contributing financial support
- **Professional Services**: Revenue from consulting, training, and enterprise support
- **Commercial Users**: Companies investing in Aurelia's development to support their business needs
- **Volunteer Contributors**: Community members donating their time and expertise

This diverse funding approach ensures Aurelia's long-term sustainability while maintaining its independence and commitment to the open source community. Every contribution, whether financial or through code contributions, helps maintain and improve the framework for everyone.