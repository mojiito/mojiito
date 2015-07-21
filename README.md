# mojito
Lightweight Controller JS Framework

## What is it
mojito.js is just a little framework on top of [jQuery](https://github.com/jquery/jquery) to better structurize your JavaScript for your (static) website.
- put controller on DOM Nodes
- the controller handles the JavaScript you need to write for that specific part and encapsulate it
- communicate with other controllers to make your application rich
- add actions/event to a DOM Node (e.g. <button>) and handle it in the controller
- extend from other controllers and inherit function, variables and logic

## What is it not
- It is not a MVC JavaScript framework for client side applications like [Angular](https://www.angularjs.org/), [React](http://facebook.github.io/react/), [Ember](http://emberjs.com/), ...
- It is not a abstraction layer for web components [Polymer](https://www.polymer-project.org/1.0/).

## Functionality
After you installed mojito and included it in your project, the doors are now open to write your first controller:

### Create a controller
To create a controller, add the following code to your javascipt. We suggest to put every controller in its own file, for a better structure.
```JavaScript
Mojito.Controller.extend('FooController', {
    // Your code goes here
});
```
The first parameter is the name of the controller class, the second one is an object were you put your variables, functions and actions. After that your newly created `FooController` Class has been a to mojito.js

### Link the controller to a DOM Node
After creating the controller you need to append/link it to a HTML-Tag.
```HTML
<div class="some css classes" data-mojito-controller="FooController"></div>
```
With `data-mojito-controller` you define which controller class is responsible for this HTML-Tag. Mojito now creates a new instance of `FooController` and links it to this <div>

## How to install it
We suggest you to use bower for installing mojito.js

### bower
Install mojito.js via bower.

1. executed the following command in your terminal
```Shell
bower install --save thomaspink/mojito.js
```

2. Include mojito in your project
```HTML
<script src="bower_components/mojito/src/core.js"></script>
```

## Issues/Feedback
If you find any issues please submit it here on github.
Feel free to submit any feedback - thanks
