'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:
function $Promise (fnc){
  if (typeof fnc !== 'function'){
    throw new TypeError('executor not a function')
  }
  this._handlerGroups = []

  // State handling:
  this._state = 'pending';
  this._value = undefined;
  fnc(this._internalResolve.bind(this), this._internalReject.bind(this));

}

$Promise.prototype.then = function(successCb, errorCb) {
  if (typeof successCb !== 'function') {
    successCb = null
  }
  if (typeof errorCb !== 'function') {
    errorCb = null
  }

  this._handlerGroups.push({
    successCb, errorCb
  })

  if (this._state === 'fulfilled') {
    successCb(this._value);
  }
}

$Promise.prototype._internalResolve = function(value){
  if(this._state === 'pending'){
    this._state = 'fulfilled';
    this._value = value;
  }
  // if(this._value === null) {
  //   this._value = value;
  // }

  // QUESTION FOR REVIEW: What is 'this' referring to when called in the cbObj callback? Why doesn't it refer to the cbObj rather than the Promise instance?

  this._handlerGroups.forEach(cbObj => {
    return cbObj.successCb(this._value)
  })
};

$Promise.prototype._internalReject = function(value){
  if(this._state === 'pending'){
    this._state = 'rejected';
    this._value = value;
  }
  // if(this._value === null) {
  //   this._value = value;
  // }
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
