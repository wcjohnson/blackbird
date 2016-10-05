"use strict";

var assert = require("assert");
var testUtils = require("./helpers/util.js");

var c = {
    val: 3,
    method: function() {
        return [].slice.call(arguments).concat(this.val);
    }
};

var getValues = function() {
    return {
        thenableFulfill: {then: function(fn){setTimeout(function(){fn(3);}, 1);}},
        thenableReject: {then: function(_, fn){setTimeout(function(){fn(3);}, 1);}}
    };
};

describe("call", function() {
    specify("basic then", function() {
        console.log("******** Creating promise");
        var pr = Promise.resolve(true);
        console.log("******** Thenning promise");
        pr = pr.then(function() {
            console.log("******** Promise.then 1", Promise.getDeepContext());
            Promise.setDeepContext({ test1: 1});
            console.log(Promise.getDeepContext());
        });
        console.log("******** Thenning promise 2nd time");
        pr = pr.then(function() {
            console.log("******** Promise.then 2", Promise.getDeepContext());
            Promise.setDeepContext({ test2: 2});
            console.log(Promise.getDeepContext());
        });
        console.log("******** Thenning promise 3rd time");
        pr = pr.then(function() {
            console.log("******** Promise.then 3", Promise.getDeepContext());
            console.log(Promise.getDeepContext());
            console.log("******** Making subpromise");
            new Promise(function(resolve, reject){
                console.log("******** Subpromise executor");
                Promise.setDeepContext({ test3: 3});
                console.log(Promise.getDeepContext());
                resolve(1);
            }).then(function() {
                console.log("******** Subpromise then", Promise.getDeepContext());
                Promise.setDeepContext({ test4: 4});
                console.log(Promise.getDeepContext());
            });
        });
    });
});
