/**
 * If a function is provided, the thread is automatically started.
 * @param {Function} [f]
 * @constructor
 * @namespace
 */
function Thread(f) {
    this.queue = [];
    if (f != null) {
        this.running = true;
        this.schedule(f);
    } else {
        this.running = false;
    }
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
    var thread = this;
    return function() {
        if (thread.running) {
            try {
                Thread.current = thread;
                f.apply(this, arguments);
            } finally {
                Thread.current = null;
            }
        } else {
            thread.queue.push(f.bind.apply(f, [this].concat(arguments)));
        }
    };
};

/**
 * Schedule a function to run in this thread.
 * @param {Function} f
 * @returns this
 * @method
 * @private
 */
Thread.prototype.schedule = function(f) {
    setTimeout(this.runner(f), 0);
    return this;
};

/**
 * Pause the thread, waiting to be restarted.
 * @returns this
 * @method
 */
Thread.prototype.stop = function() {
    this.running = false;
    return this;
};

/**
 * Continue running a stopped thread.
 * @returns this
 * @method
 */
Thread.prototype.start = function() {
    this.running = true;
    while (this.queue.length > 0) {
        this.schedule(this.queue.shift());
    }
    return this;
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
