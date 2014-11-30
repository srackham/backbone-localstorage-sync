/*

backbone-localstorage-sync
https://github.com/srackham/backbone-localstorage-sync

*/
'use strict';

// Constructor function for creating Backbone sync adaptor objects.
var BackboneLocalStorage = function(name) {
  this.name = name;
  var json = window.localStorage.getItem(this.name);
  // data is keyed by model model id and contains model attribute hashes.
  this.data = (json && JSON.parse(json)) || {};
};

var syncCache = {};

// Returns a Backbone sync function that is bound to the options.name
// BackboneLocalStorage instance.
// This is the only object exported by the module.
module.exports = BackboneLocalStorage.sync = function(name) {
  // Ensure there is only on sync adapter per localStorage item.
  if (!syncCache[name]) {
    var localStorage = new BackboneLocalStorage(name);
    syncCache[name] = localStorage.sync.bind(localStorage);
  }
  return syncCache[name];
};

BackboneLocalStorage.prototype = {

  saveData: function() {
    window.localStorage.setItem(this.name, JSON.stringify(this.data));
  },

  create: function(model) {
    if (!model.id) {
      model.id = model.attributes.id = guid();
    }
    return this.update(model);
  },

  update: function(model) {
    this.data[model.id] = model.toJSON();
    this.saveData();
    return model.toJSON();
  },

  find: function(model) {
    return this.data[model.id];
  },

  findAll: function() {
    // Return array of all models attribute hashes.
    return Object.keys(this.data).map(
      function(id) {
        return this.data[id];
      }.bind(this)
    );
  },

  destroy: function(model) {
    delete this.data[model.id];
    this.saveData();
    return model.toJSON();
  },

  /*
   Overrides Backbone.sync function.

   Called by Backbone Model fetch, save and destroy APIs (with the `model` argument set
   to the bound Model) and by the Collection fetch API (with the `model` argument set
   to the bound Collection).

   Backbone exposes a success/error style callback interface to the fetch, save, and destroy APIs.
   This is to accommodate asynchronous client/server interactions e.g. using AJAX. But because
   all localStorage requests synchronously the fetch, save and destroy APIs behave synchronous.

   */
  sync: function(method, model, options) {
    var resp; // JSON response from the "server".
    switch (method) {
      case 'read':    // Model/Collection `fetch` APIs.
        resp = model.id ? this.find(model) : this.findAll();
        break;
      case 'create':  // Model `save` API.
        resp = this.create(model);
        break;
      case 'update':  // Model `save` API.
        resp = this.update(model);
        break;
      case 'delete':  // Model `destroy` API.
        resp = this.destroy(model);
        break;
    }
    if (resp) {
      // 1. If necessary update the model/collection.
      // 2. Execute the fetch/save/destroy `options.success` callback.
      // 3. Emit a "sync" event with arguments model,resp,options.
      options.success(resp);
    } else {
      // 1. Execute the fetch/save/destroy `options.error` callback.
      // 2. Emit an "error" event with arguments model,resp,options.
      options.error(method);
    }
  }

};

// Generate four random hex digits.
function s4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

// Generate a pseudo-GUID by concatenating random hexadecimal.
function guid() {
  return (s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4());
}

