const UserRouter = require("./UserRoter");

const routes = (app) => {
    app.use('/api/user', UserRouter);
}

module.exports = routes