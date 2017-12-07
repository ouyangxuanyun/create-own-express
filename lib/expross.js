const Application = require('./application');

const createApplication = () => {
    let app = new Application();
    return app;
}

module.exports = createApplication;