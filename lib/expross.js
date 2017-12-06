const app = require('./application');

app.get('/', function(req, res) {
    res.send('get Hello World!');
});

const createApplication = () => {
    return app;

}

module.exports = createApplication;