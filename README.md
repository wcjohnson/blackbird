<a href="http://promisesaplus.com/">
    <img src="http://promisesaplus.com/assets/logo-small.png" alt="Promises/A+ logo"
         title="Promises/A+ 1.1 compliant" align="right" />
</a>
# Introduction

Blackbird is a fork of Bluebird, which is a fully featured promise library with focus on innovative features and performance.

See the [**bluebird website**](http://bluebirdjs.com/docs/getting-started.html) for further documentation, references and instructions. See the [**API reference**](http://bluebirdjs.com/docs/api-reference.html) here.

# Differences from Bluebird

## Deep Context

Blackbird provides a mechanism for maintaining deep context through promise chains. This is like a "super" version of `Promise.bind` -- it provides an environment that is not only shared by the current promise chain, but also by any subchains consisting of Blackbird promises.

We use deep context to store information collected in the top layers of our API (say, information about the currently logged-in user) so that it can be utilized seamlessly even by deep subsystems without worrying about lexical this or spaghetti argument passing.

#### Spec

The "deep context" of a promise is either:
* The deep context of its preceding promise, if it is the result of `.then`ing another promise
* The deep context of its parent promise, if it is the result of creating a promise while another promise is running.
* An empty object, `{}`, otherwise.

##### setDeepContext
```js
Promise.setDeepContext(object) -> undefined
```
Merges the given object (as if `Object.assign()`ed) with the deep context of the currently-running Promise.

##### getDeepContext
```js
Promise.getDeepContext() -> object
```
Gets the deep context of the currently-running Promise. The deep context should be treated as immutable; use `.setDeepContext` to modify it.

# License

The MIT License (MIT)

Copyright (c) 2013-2016 Petka Antonov
Copyright (c) 2016 William C. Johnson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
