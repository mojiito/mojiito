# Dependency Injection   
Mojito's dependency injection is basically a simpler version of [Angular's DI](https://angular.io).      
All the credits and respect to the Angular team.

DI documentation on angular.io:
* [Dependency Injection](https://angular.io/docs/ts/latest/guide/dependency-injection.html)
* [Hierarchical Dependency Injection](https://angular.io/docs/ts/latest/guide/hierarchical-dependency-injection.html)

We use this dependency injection (DI) to resolve dependencies of classes, components and services.    
There are two principles: Injectors and Providers
**Injector**
An `Injector` is a replacement for a `new` operator, which can automatically resolve the
 * constructor dependencies.    
     
**Provider**
Describes how the {@link Injector} should instantiate a given token.