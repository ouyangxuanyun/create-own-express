const expross = require('../');
const app = expross();
// app.get();
app.listen(3000);

app.get('/', function (req, res) {
    res.send('111 get Hello World!');
});

app.get('/', function (req, res) {
    res.send('222 get Hello World!');
});