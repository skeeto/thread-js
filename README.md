# User Space JavaScript Threads

See the article:
[Userspace Threading in JavaScript](http://nullprogram.com/blog/2013/04/28/)

This is experimental. I don't yet know how practical it would be in a
real application.

```js
/* Recursively fetch status string in a thread. */
function updateStatus() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/status', true);  // long poll
    xhr.send();
    xhr.onload = Thread.wrap(function() {
        document.getElementById('status').innerHTML = xhr.responseText;
        Thread.yield(updateStatus);
    });
};

/* Start a thread to handle status updates. */
var statusThread = new Thread(updateStatus);

/* Stop and start the thread at will. */
statusThread.stop();
// ...
statusThread.start();
```
