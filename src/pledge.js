'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:
function $Promise (fnc){
  if (typeof fnc !== 'function'){
    throw new TypeError('executor not a function')
  }
  this._handlerGroups = [];

  // State handling:
  this._state = 'pending';
  this._value = undefined;
  fnc(this._internalResolve.bind(this), this._internalReject.bind(this));
}

$Promise.prototype.then = function(successCb, errorCb) {
  var newPromise = new $Promise(function(){})

  if (typeof successCb !== 'function') {
    successCb = null
  }
  if (typeof errorCb !== 'function') {
    errorCb = null
  }

  if (this._state === 'fulfilled') {
    successCb(this._value);
    newPromise._internalResolve(this._value)
  } else if (this._state === 'rejected' && errorCb){
    errorCb(this._value);
    newPromise._internalReject(this._value)
  }

  this._handlerGroups.push({
    successCb, errorCb, downstreamPromise: newPromise
  })

  return newPromise;
}

$Promise.prototype.catch = function(fnc){
  return this.then(null, fnc);
}

$Promise.prototype._internalResolve = function(value){
  if (this._state === 'pending'){
    this._state = 'fulfilled';
    this._value = value;
  }

  // QUESTION FOR REVIEW: What is 'this' referring to when called in the cbObj callback? Why doesn't it refer to the cbObj rather than the Promise instance?
  this._handlerGroups.forEach(cbObj => {
    cbObj.downstreamPromise._internalResolve(value)
  })
  console.log(this._handlerGroups, 'handlerGroups')
  this._handlerGroups = [];
};

$Promise.prototype._internalReject = function(value){
  if (this._state === 'pending'){
    this._state = 'rejected';
    this._value = value;
  }
  this._handlerGroups.forEach(cbObj => {
    return cbObj.errorCb(this._value)
  })
};

/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = $Promise;

So in a Node-based project we could write things like this:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
