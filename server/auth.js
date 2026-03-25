const jwt = require("jsonwebtoken");
const secret = "BlogApplication";

module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        userName: user.userName,
        isAdmin: user.isAdmin
    };
    return jwt.sign(data, secret, {});
};

module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;
    if (typeof token === "undefined") {
        return res.status(401).send({ auth: "Failed", error: "No Token Provided" });
    } else {
        token = token.slice(7, token.length);
        jwt.verify(token, secret, function (err, decodedToken) {
            if (err) {
                return res.status(401).send({ auth: "Failed", error: err.message });
            } else {
                console.log("decodedToken:", decodedToken);
                req.user = decodedToken;
                next();
            }
        });
    }
};

module.exports.verifyAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden"
        });
    }
};

module.exports.errorHandler = (err, req, res, next) => {
    if (err.code === 11000) {
        return res.status(409).send({
            error: "Duplicate Entry",
            message: `${Object.keys(err.keyValue)} already exists`
        });
    }
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).send({
            error: "Validation Error",
            message: messages.join(", ")
        });
    }
    if (err.name === "JsonWebTokenError") {
        return res.status(401).send({
            error: "Unauthorized",
            message: "Invalid token"
        });
    }
    if (err.name === "CastError") {
        return res.status(400).send({
            error: "Invalid ID",
            message: `${err.value} is not a valid ID`
        });
    }
    return res.status(500).send({
        error: "Internal Server Error",
        message: err.message
    });
};