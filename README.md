# contimer

```javascript
var timer = require('contimer'),
    connect = require('connect');

connect(
    function (req, res, next) {
        timer.start(req, 'total');
        next();
    },
    function (req, res, next) {
        var time = timer.stop(req, 'total').time;

        res.end('Response processing time: ' + time + 'ms');
    }
).listen(8080);
```

## Methods

### hook()

`hook(handler) → {Object}`

* `{Function} handler` — callback with signature `function(id, time)`.

Setups the `handler` as the callback for the `stop()` method.

### start()

`start(context, label) → {Function}`

* `{Object} context` — Object, which will be used as context;
* `{String} label` — Timed identifier, must be unique in the context.

Creates new timer in the `context`.

> Be aware, that `start()` creates non-enumerable property `__sw_timers`
> in the `context` object to store timestamps.

Method returns function, which can be used to stop created timer without
passing any arguments to it. Or you can call the `stop()` method with the
same arguments to stop timer.

### stop()

`stop(context, label) → {{ label: String, time: Number }}`
