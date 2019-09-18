let email = require('./email');

module.exports = function setRoutes(app) {
    app.use('/email', email);
}
