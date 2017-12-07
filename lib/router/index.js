const Layer = require('./layer');
const Route = require('./route');
const http = require('http');

class Router {
    constructor() {
        this.stack = [new Layer('*', function (req, res) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('404');
        })]
    }

    route(path) {
        let route = new Route(path);
        let layer = new Layer(path, route.dispatch.bind(route));
        layer.route = route;
        this.stack.push(layer);
        return route;
    }

    get(path, fn) {
        let route = this.route(path);
        route.get(fn);
        return this;
        // this.stack.push(new Layer(path, fn));
    }

    handle(req, res, done) {
        let self = this;
        let method = req.method;
        let idx = 0;
        let stack = self.stack;

        function next(err) {
            let layerError = (err === 'route' ? null : err);

            //跳过路由系统
            if(layerError === 'router') {
                return done(null);
            }

            if(idx >= stack.length || layerError) {
                return done(layerError);
            }

            let layer = stack[idx++];
            //匹配，执行
            if(layer.match(req.url) && layer.route &&
                layer.route._handlesMethod(method)) {
                return layer.handleRequest(req, res, next);
            } else {
                next(layerError);
            }
        }

        next();
        // this.stack.forEach(e => {
        //     if (e.match(req.url) && e.route && e.route._handlesMethod(method)) {
        //         return e.handleRequest(req, res);
        //     }
        // })
        // return this.stack[0].handleRequest(req, res);
    }
}

http.METHODS.forEach(function(method) {
    method = method.toLowerCase();
    Router.prototype[method] = function(path, fn) {
        var route = this.route(path);
        route[method].call(route, fn);
        return this;
    };
});

module.exports = Router;