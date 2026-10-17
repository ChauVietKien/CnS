const UserRouter = require("./UserRoter");
const TutorPostRouter = require("./TutorPostRouter");
const TutorProfileRouter = require("./TutorProfileRouter");
const ApplicationRouter = require("./ApplicationRouter");
const EvaluationRouter = require("./EvaluationRouter");

const routes = (app) => {
    app.use('/api/user', UserRouter);
    app.use('/api/tutor-post', TutorPostRouter);
    app.use('/api/tutor-profile', TutorProfileRouter);
    app.use('/api/application', ApplicationRouter);
    app.use('/api/evaluation', EvaluationRouter);
}

module.exports = routes