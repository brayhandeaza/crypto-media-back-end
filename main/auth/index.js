const jwt = require('jsonwebtoken')

const checkingForAPIKEY = (req, res, next) => {
    const fKey = "cbsdbcjhadvchgdvhcg"

    if (req.headers["x-api-key-f"] != fKey) {
        return res.json({
            error: true,
            "API-KEY": "Invalid API KEY"
        })
    } else {
        next()
    }
}

const verifyTokenAuth = (req, res, next) => {
    const token = req.headers['authorization']
    // if (!token) return res.status(401).json({
    //     auth: false,
    //     error: 'Unauthorize user'
    // })
    // try {
    //     const decoded = jwt.verify(token, "jwt");
    //     req.user = decoded
    //     next()
    // } catch (e) {
    //     res.status(400).json({
    //         auth: false,
    //         message: 'Token not valid',
    //         error: e
    //     })
    // }
    next()
}


module.exports = {
    checkingForAPIKEY,
    verifyTokenAuth
}
