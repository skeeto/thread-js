/**
 * @param {Function} f
 * @constructor
 * @namespace
 */
function Thread(f) {
    this.alive = true;
    this.schedule(f);
}

/**
 * The currently running thread.
 * @type Thread
 */
Thread.current = null;

/**
 * @param {Function} f
 * @returns {Function} A function that runs f in the thread.
 * @method
 * @private
 */
Thread.prototype.runner = function(f) {
    var _this = this;
    return function() {
        if (_this.alive) {
            try {
                Thread.current = _this;
                f.apply(this, arguments);
            } finally {
                Thread.current = null;
            }
        }
    };
};

/**
 * Schedule a function to run in this thread.
 * @param {Function} f
 * @method
 * @private
 */
Thread.prototype.schedule = function(f) {
    setTimeout(this.runner(f), 0);
};

/**
 * Permanently stop this thread from running.
 * @method
 */
Thread.prototype.destroy = function() {
    this.alive = false;
};

/**
 * @returns {String}
 * @method
 */
Thread.prototype.toString = function() {
    return '[object Thread]';
};

/**
 * Yield so that other threads can run.
 * @param {Function} f
 */
Thread.yield = function(f) {
    Thread.current.schedule(f);
};

/**
 * Return a version of a function that will run in the current thread.
 * @param {Function} f
 * @returns {Function}
 */
Thread.wrap = function(f) {
    return Thread.current.runner(f);
};
