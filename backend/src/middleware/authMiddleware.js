const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

const authAdminMiddleware = (req, res, next) => {
    const tokenHeader = req.headers.authorization || req.headers.token;

    if (!tokenHeader || !tokenHeader.includes(' ')) {
        return res.status(401).json({ status: "ERR", message: "Token is required"});
    }

    const token = tokenHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(401).json({
                status: "ERR",
                message: "Token invalid",
            })
        }
        if (!user?.isAdmin) {
            return res.status(403).json({
                status: "ERR",
                message: "Not allow excute this action",
            })
        }
        req.user = user;
        next();
    });
}

const authUserMiddleware = (req, res, next) => {
    const tokenHeader = req.headers.authorization || req.headers.token;

    if (!tokenHeader || !tokenHeader.includes(' ')) {
        return res.status(401).json({ status: "ERR", message: "Token is required"});
    }

    const token = tokenHeader.split(' ')[1];
    const userId = req.params.id;

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(401).json({
                status: "ERR",
                message: "Authentication error",
            })
        }    
        if (!userId || user?.isAdmin || user?.id===userId) {
            req.user = user;
            return next();
        }
        return res.status(403).json({
            status: "ERR",
            message: "Permission denied"
        })
    });
}

const authMiddlewareOnlyToken = (req, res, next) => {
    const tokenHeader = req.headers.authorization || req.headers.token;

    if (!tokenHeader || !tokenHeader.includes(' ')) {
        return res.status(401).json({ status: "ERR", message: "Token is required"});
    }

    const token = tokenHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(401).json({
                status: "ERR",
                message: "Token invalid",
            })
        }
        req.user = user;
        next();
    });
}

module.exports = {
    authAdminMiddleware,
    authUserMiddleware,
    authMiddlewareOnlyToken
}