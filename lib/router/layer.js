class Layer {
    constructor(path, fn) {
        this.handle = fn;
        this.name = fn.name || '<anonymous>';
        this.path = path;
    }

    handleRequest(req, res, next) {
        const fn = this.handle;
        // if (fn) {
        //     fn(req, res);
        // }
        try {
            fn(req, res, next)
        } catch (err) {
            next(err)
        }
    }

    match(path) {
        if (path === this.path || path === '*') {
            return true;
        }
        return false;
    }
}

module.exports = Layer;