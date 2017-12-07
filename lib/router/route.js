const Layer = require('./layer');
const http = require('http');

class Route {
    constructor(path) {
        this.path = path;
        this.stack = [];
        this.methods = {};
    }

    _handlesMethod(method) {
        let name = method.toLowerCase();
        return Boolean(this.methods[name]);
    }

    get(fn) {
        let layer = new Layer('/', fn);
        layer.method = 'get';
        this.methods['get'] = true;
        this.stack.push(layer);
        return this;
    }

    dispatch(req, res, done) {
        let self = this;
        let method = req.method.toLowerCase();
        let idx = 0;
        let stack = self.stack;

        function next(err) {//跳过route
            if(err && err === 'route') {
                return done();
            }

            //跳过整个路由系统
            if(err && err === 'router') {
                return done(err);
            }

            //越界
            if(idx >= stack.length) {
                return done(err);
            }

            //不等枚举下一个
            var layer = stack[idx++];
            if(method !== layer.method) {
                return next(err);
            }

            if(err) {//主动报错
                return done(err);
            } else {
                layer.handleRequest(req, res, next);
            }
        }
        next();
        // self.stack.forEach(e => {
        //     if (method === e.method) {
        //         return e.handleRequest(req, res)
        //     }
        // })
    }
}

http.METHODS.forEach(function(method) {
    method = method.toLowerCase();
    Route.prototype[method] = function(fn) {
        var layer = new Layer('/', fn);
        layer.method = method;
        this.methods[method] = true;
        this.stack.push(layer);
        return this;
    };
});

module.exports = Route;