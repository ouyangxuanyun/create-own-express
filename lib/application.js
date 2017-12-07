const http = require('http');
const Router = require('./router');


class Application {
    constructor() {
        this._router = new Router();
    }

    listen(port, fn) {
        const server = http.createServer((req, res) => {
            console.log('htt.createServer Running')
            return this.handle(req, res);
        });
        return server.listen(...arguments);
    }

    handle(req, res) {
        if (!res.send) {
            res.send = function (body) {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end(body);
            };
        }
        let router =  this._router;
        router.handle(req, res);
    }
}

http.METHODS.forEach(function(method) {
    method = method.toLowerCase();
    Application.prototype[method] = function(path, fn) {
        this._router[method](...arguments);
        return this;
    };
});

module.exports = Application;