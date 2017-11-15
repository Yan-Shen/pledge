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
  // to be abstracted into its own fnction and called here + in internalResolve

  // if (this._state === 'fulfilled') {
  //   console.log('am i running?')
  //   successCb(this._value);
  //   newPromise._internalResolve(this._value)
  // } else if (this._state === 'rejected' && errorCb){
  //   errorCb(this._value);
  //   newPromise._internalReject(this._value)
  // }



  this._handlerGroups.push({
    successCb, errorCb, downstreamPromise: newPromise
  })
  // this._callHandlers(this._value)
  console.log('I AM THE NEW PROMISE: ', newPromise)
  return newPromise;
}

$Promise.prototype._callHandlers = function(value){
  if (this._state === 'fulfilled' && this._handlerGroups[0].downstreamPromise) {
    console.log('I AM THIS: ', this._handlerGroups[0].downstreamPromise._internalResolve)
    this._handlerGroups[0].downstreamPromise._internalResolve(value)
  } else if (this._state === 'rejected' && errorCb){
    this._handlerGroups[0].downstreamPromise._internalReject(value)
  }
}

$Promise.prototype.catch = function(fnc){
  return this.then(null, fnc);
}

$Promise.prototype._internalResolve = function(value){

  if (this._state === 'pending'){
    // console.log('I AM THE STATE: ', this._state)
    this._state = 'fulfilled';
    this._value = value;
  }
  // console.log('I AM THE FULFILLED STATE: ', this._state)
  // console.log('I AM THE FULFILLED VALUE: ', this._value)
  this._callHandlers(value)

  // QUESTION FOR REVIEW: What is 'this' referring to when called in the cbObj callback? Why doesn't it refer to the cbObj rather than the Promise instance?
  this._handlerGroups.forEach(cbObj => {
    if (cbObj.successCb) {
      return cbObj.successCb(this._value)
    }
    // cbObj.downstreamPromise._internalResolve(value)
  })
  // console.log(this._handlerGroups, 'handlerGroups')
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
