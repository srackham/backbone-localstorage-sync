# Backbone LocalStorage sync adaptor

A Backbone sync function adapter for persisting Models and Collections to
browser LocalStorage.

Based on [example in Backbone Fundamentals
book](https://github.com/addyosmani/backbone-fundamentals/blob/gh-pages/practicals/modular-todo-app/js/libs/backbone/localstorage.js).

Modifications:

- Converted to a Node compatible module for use by Browserify/Webpack.
- No dependencies (Backbone or Underscore).
- You can specify separate stores for each Model and Collection.


## Installing
Install module with `npm install backbone-localstorage-sync`


## Using
Globally (one store for all models and collections), for example:

    var BackboneLocalStorageSync = require('backbone-localstorage-sync');
    Backbone.sync = BackboneLocalStorageSync('flux-backbone-todo');

Storage a per Model/Collection class basis, for example:

    var BackboneLocalStorageSync = require('backbone-localstorage-sync');

    var TodoItem = Backbone.Model.extend({
      sync: BackboneLocalStorageSync('flux-backbone-todo'),
    });

    var TodoStore = Backbone.Collection.extend({
      model: TodoItem,
      sync: BackboneLocalStorageSync('flux-backbone-todo'),
    });

These examples assume you are bundling your app with a CommonJS comaptible tool such as Webpack or Browserify.

**NOTE:** Because LocalStorage requests execute synchronously the fetch, save
and destroy APIs are also synchronous (differs from the usual async behavior of
client-server adapters).

