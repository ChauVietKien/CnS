const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

const genneralAccessToken = (payload) => {
    const userId = payload?.id || payload?._id;
    const isAdmin = payload?.isAdmin === true;

    const expiresIn = isAdmin ? '5m' : '15m';

    return jwt.sign(
        { id: userId, isAdmin },
        process.env.ACCESS_TOKEN,
        { expiresIn },
    );
};

const refreshAccessToken = (payload) => {
    const userId = payload?.id || payload?._id;
    const isAdmin = payload?.isAdmin === true;

    const expiresIn = isAdmin ? '2d' : '7d';

    return jwt.sign(
        { id: userId, isAdmin },
        process.env.REFRESH_TOKEN,
        { expiresIn },
    );
}
//ham refresh access token
const refreshTokenJwtService = (token) => {
    try {
        if (!token) {
            return {
                status: "ERR",
                message: "Token is not existed",
            }
        };

        const decode = jwt.verify(token, process.env.REFRESH_TOKEN);
        //khi ma access_token ht han thi xet refresh token con han khong
        //neu con thi refresh accesstoken, nguoc lai thi log out user accurent

        const newAccess_token = genneralAccessToken({
            id:  decode?.id || decode?._id,
            isAdmin: decode?.isAdmin === true,
        })

        return {
            status: "OK",
            message: "Success",
            access_token: newAccess_token,
        };
    } catch (e) {
        return {
            status: "ERR",
            message: "Token is invalid or expired",
        }
    };
}

module.exports = {
    genneralAccessToken,
    refreshAccessToken,
    refreshTokenJwtService
}

