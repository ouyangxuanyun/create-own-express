const http = require('http');
const Router = require('./router')

// const router = [{
//     path: '*',
//     method: '*',
//     handle: function (req, res) {
//         res.writeHead(200, {'Content-Type': 'text/plain'});
//         res.end('404');
//     }
// }];

module.exports = {
    _router: new Router(),

    get(path, fn) {
        console.log('expross.get function');
        return this._router.get(path, fn);
    },

    listen(port, fn) {
        const server = http.createServer((req, res) => {
            console.log('htt.createServer Running')
            if (!res.send) {
                res.send = function (body) {
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    res.end(body);
                };
            }
            return this._router.handle(req, res)
        });
        return server.listen(...arguments);
    }
}