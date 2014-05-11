/* globals describe, it */

var time = require('../'),
    assert = require('assert'),

    TIMER_NAME = 'test',
    INTERVAL = 50;

describe('start()', function() {
    it('should start timer and return function to stop it', function(done) {
        var ctx = {},
            stop = time.start(ctx, TIMER_NAME);

        setTimeout(function() {
            var result = stop();

            assert.strictEqual(result.id, TIMER_NAME);
            assert(result.time >= INTERVAL);

            done();
        }, INTERVAL);
    });

    it('timers with the same id, but in the different contexts must be handled separately', function(done) {
        var ctx1 = {},
            ctx2 = {},
            stop1 = time.start(ctx1, TIMER_NAME),
            stop2 = time.start(ctx2, TIMER_NAME);

        setTimeout(function() {
            var result1 = stop1();

            setTimeout(function() {
                var result2 = stop2();

                assert.strictEqual(result1.id, result2.id);
                assert(result2.time - result1.time >= INTERVAL);

                done();
            }, INTERVAL);
        }, INTERVAL);
    });
});

describe('stop()', function() {
    it('should stop timer by passed context and timer id', function() {
        var ctx = {};

        time.start(ctx, TIMER_NAME);

        assert(time.stop(ctx, TIMER_NAME) !== null);
    });

    it('should return `null` if timer is not exists (or stopped)', function() {
        var ctx = {},
            stop = time.start(ctx, TIMER_NAME);

        assert(stop() !== null);

        assert.strictEqual(stop(), null);
        assert.strictEqual(time.stop(ctx, TIMER_NAME), null);
        assert.strictEqual(time.stop({}, TIMER_NAME), null);
    });
});