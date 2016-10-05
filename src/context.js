"use strict";
module.exports = function(Promise) {
var longStackTraces = false;
var contextStack = [];

//////////////////////////// DEEP CONTEXT
var deepContextStack = [];

// Push an entry onto the deep context stack.
function dc_push(dc) {
    deepContextStack.push(dc);
}

// Pop an entry off the deep context stack.
function dc_pop() {
    if (deepContextStack.length > 0) {
        deepContextStack.pop();
    }
}

// Peek at the deep context stack.
function dc_peek() {
    var lastIndex = deepContextStack.length - 1;
    if (lastIndex >= 0) {
        return deepContextStack[lastIndex];
    } else {
        return null;
    }
}

// On promise init, pull deep context from stack
Promise.prototype._deepContextSetup = function() {
    // console.log("Promise._deepContextSetup");
    var runningPromise = dc_peek();
    if (runningPromise) {
        // console.log("_deepContextSetup: passing COPY instruction");
        this._dc_shouldCopy = runningPromise;
    }
};

// Pass deep context on promise chaining.
Promise.prototype._deepContextPass = function(other) {
    delete other._dc_shouldCopy;
    if (this._dc) {
        // console.log("_deepContextPass: passing context", this._dc);
        other._dc = this._dc;
    } else {
        other._dc_shouldInherit = this;
        // console.log("_deepContextPass: passing INHERIT instruction");
    }
};

// Manage context stack when promise context is push/pop'd
function dc_promisePushContext(pr) {
    dc_push(pr);
}

function dc_promisePopContext() {
    dc_pop();
}

// Find the deep context of a promise.
function dc_resolve(pr) {
    if(pr._dc) return pr._dc;
    if(pr._dc_shouldInherit) {
        pr._dc = dc_resolve(pr._dc_shouldInherit);
        delete pr._dc_shouldInherit;
        // console.log("dc_resolve: inherited context:", pr._dc);
        return pr._dc;
    }
    if(pr._dc_shouldCopy) {
        pr._dc = Object.assign({}, dc_resolve(pr._dc_shouldCopy));
        delete pr._dc_shouldCopy;
        // console.log("dc_resolve: MALLOC: copied context:", pr._dc);
        return pr._dc;
    }
    // console.log("dc_resolve: MALLOC: creating new context: {}");
    return {};
}

Promise._runningPromise = function() {
    return dc_peek();
};

// Inspect the current deep context.
Promise.getDeepContext = function() {
    return dc_resolve(dc_peek());
};

// Assign to the current deep context.
Promise.setDeepContext = function(obj) {
    var runningPromise = dc_peek();
    // Makes no sense to set DC outside of a promise.
    if (!runningPromise) return;
    // Find DC and assign object to it.
    Object.assign(dc_resolve(runningPromise), obj);
};

//////////////////////////// ORIGINAL BLUEBIRD CONTEXT
Promise.prototype._promiseCreated = function() {};
Promise.prototype._pushContext = function() {
    dc_promisePushContext(this);
};
Promise.prototype._popContext = function() {
    dc_promisePopContext(); return null;
};
Promise._peekContext = Promise.prototype._peekContext = function() {};

function Context() {
    this._trace = new Context.CapturedTrace(peekContext());
}
Context.prototype._pushContext = function () {
    dc_promisePushContext(this);
    if (this._trace !== undefined) {
        this._trace._promiseCreated = null;
        contextStack.push(this._trace);
    }
};

Context.prototype._popContext = function () {
    dc_promisePopContext();
    if (this._trace !== undefined) {
        var trace = contextStack.pop();
        var ret = trace._promiseCreated;
        trace._promiseCreated = null;
        return ret;
    }
    return null;
};

function createContext() {
    if (longStackTraces) return new Context();
}

function peekContext() {
    var lastIndex = contextStack.length - 1;
    if (lastIndex >= 0) {
        return contextStack[lastIndex];
    }
    return undefined;
}
Context.CapturedTrace = null;
Context.create = createContext;
Context.deactivateLongStackTraces = function() {};
Context.activateLongStackTraces = function() {
    var Promise_pushContext = Promise.prototype._pushContext;
    var Promise_popContext = Promise.prototype._popContext;
    var Promise_PeekContext = Promise._peekContext;
    var Promise_peekContext = Promise.prototype._peekContext;
    var Promise_promiseCreated = Promise.prototype._promiseCreated;
    Context.deactivateLongStackTraces = function() {
        Promise.prototype._pushContext = Promise_pushContext;
        Promise.prototype._popContext = Promise_popContext;
        Promise._peekContext = Promise_PeekContext;
        Promise.prototype._peekContext = Promise_peekContext;
        Promise.prototype._promiseCreated = Promise_promiseCreated;
        longStackTraces = false;
    };
    longStackTraces = true;
    Promise.prototype._pushContext = Context.prototype._pushContext;
    Promise.prototype._popContext = Context.prototype._popContext;
    Promise._peekContext = Promise.prototype._peekContext = peekContext;
    Promise.prototype._promiseCreated = function() {
        var ctx = this._peekContext();
        if (ctx && ctx._promiseCreated == null) ctx._promiseCreated = this;
    };
};
return Context;
};
