class Router {
    constructor() {
        this.stack = [new Layer('*', function (req, res) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('404');
        })]
    }

    get(path, fn) {
        this.stack.push(new Layer(path, fn));
    }

    handle(req, res) {
        this.stack.forEach(e => {
            if (e.match(req.url)) {
                return e.handleRequest(req, res);
            }
        })

        return this.stack[0].handleRequest(req, res);
    }
}

class Layer {
    constructor(path, fn) {
        this.handle = fn;
        this.name = fn.name || '<anonymous>';
        this.path = path;
    }

    handleRequest(req, res) {
        const fn = this.handle;
        if (fn) {
            fn(req, res);
        }
    }

    match(path) {
        if (path === this.path || path === '*') {
            return true;
        }
        return false;
    }
}

class Route {
    constructor(path){
        this.path = path;
        this.stack = [];
        this.method = {};
    }
}

module.exports = Router;