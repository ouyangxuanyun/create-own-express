const http = require('http');

const router = [{
    path: '*',
    method: '*',
    handle: function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('404');
    }
}];

module.exports = {
    get(path, fn) {
        console.log('expross().get function');
        router.push({path,method:'GET',handle:fn});
    },

    listen(port, fn) {
        const server = http.createServer((req, res) => {
            console.log('htt.createServer Running')
            router.forEach(e => {
                if ((req.url === e.path || e.path === '*') && (req.method === e.method || e.method === '*')) {
                    return e.handle && e.handle(req, res);
                }
            })

        });
        return server.listen(...arguments);
    }
}