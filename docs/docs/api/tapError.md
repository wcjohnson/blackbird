---
layout: api
id: tap
title: .tap
---


[← Back To API Reference](/docs/api-reference.html)
<div class="api-code-section"><markdown>
##.tapError


`.tapError` is a convenience method for reacting to errors without handling them with promises - similar to `finally` but only called on rejections. Useful for logging errors.

It comes in two variants.
 - A tapError-all variant similar to [`.catch`](.) block. This variant is compatible with native promises. 
 - A filtered variant (like other non-JS languages typically have) that lets you only handle specific errors. **This variant is usually preferable**. 


### `tapError` all
```js
.tapError(function(any value) handler) -> Promise
```


Like [`.finally`](.) that is not called for fulfillments.

```js
getUser().tapError(function(err) {
    return logErrorToDatabase(err);
}).then(function(user) {
    //user is the user from getUser(), not logErrorToDatabase()
});
```

Common case includes adding logging to an existing promise chain:

**Rate Limiting**
```
Promise.
  try(logIn).
  then(respondWithSuccess).
  tapError(countFailuresForRateLimitingPurposes).
  catch(respondWithError);
```

**Circuit Breakers**
```
Promise.
  try(makeRequest).
  then(respondWithSuccess).
  tapError(adjustCircuitBreakerState).
  catch(respondWithError);
```

**Logging**
```
Promise.
  try(doAThing).
  tapError(logErrorsRelatedToThatThing).
  then(respondWithSuccess).
  catch(respondWithError);
```
*Note: in browsers it is necessary to call `.tapError` with `console.log.bind(console)` because console methods can not be called as stand-alone functions.*

### Filtered `tapError`


```js
.tapError(
    class ErrorClass|function(any error),
    function(any error) handler
) -> Promise
```
```js
.tapError(
    class ErrorClass|function(any error),
    function(any error) handler
) -> Promise


```
This is an extension to [`.tapError`](.) to filter exceptions similarly to languages like Java or C#. Instead of manually checking `instanceof` or `.name === "SomeError"`, you may specify a number of error constructors which are eligible for this tapError handler. The tapError handler that is first met that has eligible constructors specified, is the one that will be called.

Usage examples include:

**Rate Limiting**
```
Bluebird.
  try(logIn).
  then(respondWithSuccess).
  tapError(InvalidCredentialsError, countFailuresForRateLimitingPurposes).
  catch(respondWithError);
```

**Circuit Breakers**
```
Bluebird.
  try(makeRequest).
  then(respondWithSuccess).
  tapError(RequestError, adjustCircuitBreakerState).
  catch(respondWithError);
```

**Logging**
```
Bluebird.
  try(doAThing).
  tapError(logErrorsRelatedToThatThing).
  then(respondWithSuccess).
  catch(respondWithError);
```

</markdown></div>

<div id="disqus_thread"></div>
<script type="text/javascript">
    var disqus_title = ".tap";
    var disqus_shortname = "bluebirdjs";
    var disqus_identifier = "disqus-id-tap";
    
    (function() {
        var dsq = document.createElement("script"); dsq.type = "text/javascript"; dsq.async = true;
        dsq.src = "//" + disqus_shortname + ".disqus.com/embed.js";
        (document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(dsq);
    })();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>