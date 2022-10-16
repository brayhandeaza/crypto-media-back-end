const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const GetAll = async (req, res, model) => {
    await model.findAll().then((data) => {
        res.json({
            data,
            error: false
        })
    }).catch((err) => {
        res.json({
            error: true,
            message: err.toString()
        })
    })
}

const GetOne = async (req, res, model) => {
    await model.findByPk(req.params.id).then((data) => {
        res.json({
            data,
            error: false
        })
    }).catch((err) => {
        res.json({
            error: true,
            message: err.toString()
        })
    })
}

const GetOneWithFilter = async (req, res, model) => {
    await model.findAll(
        {
            where: {
                [Op.or]: [
                    {
                        firstName: { [Op.like]: `%${req.query.search}%` }
                    },
                    {
                        lastName: { [Op.like]: `%${req.query.search}%` }
                    }
                ]
            },
            limit: 3
        }
    ).then((data) => {
        res.json({
            data,
            error: false,
            search: req.headers["type"]
        })
    }).catch((err) => {
        res.json({
            error: true,
            message: err.toString()
        })
    })
}

const GetAllWithFilterWithInclude = async (req, res, model, params, value, include) => {
    await model.findAll({
        where: {
            [params]: value
        },
        include: {
            model: include,
            attributes: ['id']
        }
    }
    ).then((data) => {
        res.json({
            data,
            error: false,
            search: req.headers["type"]
        })
    }).catch((err) => {
        res.json({
            error: true,
            message: err.toString()
        })
    })
}

const GetAllWithFilter = async (req, res, model, params, value) => {
    await model.findAll(
        {
            where: { [params]: value },
        }
    ).then((data) => {
        res.json({
            data,
            error: false,
            search: req.headers["type"]
        })
    }).catch((err) => {
        res.json({
            error: true,
            message: err.toString()
        })
    })
}

const GetOneWithParam = async (req, res, model, params) => {
    await model.findOne(
        {
            where: { [params]: req.params.id },
        }
    ).then((data) => {
        res.json({
            data,
            error: false,
            search: req.headers["type"]
        })
    }).catch((err) => {
        res.json({
            error: true,
            message: err.toString()
        })
    })
}

const GetCoinsWithFilter = async (req, res, model) => {
    await model.findAll(
        {
            where: {
                [Op.or]: [
                    {
                        name: { [Op.like]: `%${req.query.search.toLowerCase()}%` }
                    },
                    {
                        symbol: { [Op.like]: `%${req.query.search.toUpperCase()}%` }
                    }
                ]
            },
            limit: 3
        }
    ).then((data) => {
        res.json({
            data,
            error: false,
            search: req.headers["type"]
        })
    }).catch((err) => {
        res.json({
            error: true,
            message: err.toString()
        })
    })
}

const PatchOne = async (model, req, res) => {
    await model.findOne({ where: { id: req.params.id } }).then(async (table) => {
        if (table) {
            await table.update(req.body).then(updatedTable => {
                res.json(updatedTable)
            }).catch((err) => {
                res.json({
                    error: true,
                    message: err.toString()
                })
            })
        } else {
            res.json({
                status: 400,
                message: "This row does not exis in this tablet",
            })
        }
    })
}

const PostUser = async (req, res, next, model, JoiSchema) => {
    JoiSchema.validateAsync(req.body).then(async () => {
        const User = await model.findOne({ where: { uuid: req.body.uuid } })

        if (!User) {
            await model.create(req.body).then(async (user) => {
                const token = jwt.sign({ id: user.id, exp: Math.floor(Date.now() / 1000) * 60 }, "jwt")
                req.user = {
                    error: false,
                    user,
                    token
                }
                next()
            }).catch((err) => {
                res.json({
                    error: true,
                    message: err.toString()
                })
            })
        } else {
            const token = jwt.sign({ id: User.id, exp: Math.floor(Date.now() / 1000) * 60 }, "jwt")
            res.json({
                error: true,
                message: "user already exist",
                user: User,
                token
            })
        }
    }).catch((err) => {
        res.send(err)
    })
}

const Post = (req, res, model, JoiSchema) => {
    JoiSchema.validateAsync(req.body).then(async (bag) => {
        if (bag) {
            await model.create(bag).then((data) => {
                res.json({
                    status: 200,
                    error: false,
                    data,
                })
            }).catch((err) => {
                res.json({
                    error: true,
                    message: err.toString()
                })
            })
        }
    }).catch((err) => {
        res.send(err)
    })
}

const PatchUser = async (req, res, model) => {
    await model.findOne({ where: { id: req.params.id } }).then(async (table) => {
        const salt = await bcrypt.genSalt(10)
        const { firstName, lastName, image, username, password, theme } = req.body
        const hashPassword = await bcrypt.hash(password, salt)
        if (table) {
            await table.update({
                firstName: firstName || table.firstName,
                lastName: lastName || table.lastName,
                username: username || table.username,
                password: hashPassword || table.password,
                image: image || table.image,
                theme: theme || table.theme,
            }).then(updatedTable => {
                res.json(updatedTable)
            }).catch((err) => {
                res.json({
                    error: true,
                    message: err.toString()
                })
            })
        } else {
            res.json({
                status: 400,
                message: "user does not exis",
            })
        }
    })
}

const Patch = async (req, res, model) => {
    await model.findOne({ where: { id: req.params.id } }).then(async (table) => {

        if (table) {
            await table.update(req.body).then(async table => {
                model.count({
                    where: {
                        [Op.and]: [
                            { id: req.params.id },
                            { hidden: false }
                        ]
                    }
                }).then((count) => {
                    res.json({
                        table,
                        count
                    })
                }).catch((err) => {
                    res.json({
                        error: true,
                        table,
                        message: err.toString()
                    })
                })
            }).catch((err) => {
                res.json({
                    error: true,
                    message: err.toString()
                })
            })
        } else {
            res.json({
                status: 400,
                message: "This row does not exis in this tablet",
            })
        }
    }).catch((err) => {
        res.json({
            error: true,
            message: err.toString()
        })
    })
}

const DeleteOne = async (req, res, model) => {
    await model.findOne({ where: { id: req.params.id } }).then((table) => {
        if (table) {
            table.destroy().then(() => {
                res.json({
                    status: 200,
                    message: "row deleted succefully"
                })
            }).catch((err) => {
                res.send(err)
            })
        } else {
            res.json({
                status: 400,
                message: "This row does not exist in this table"
            })
        }
    }).catch((err) => {
        res.send(err)
    })
}

const UserLogin = async (req, res, model) => {
    await model.findOne({ where: { uuid: req.body.uuid } }).then((user) => {
        const token = jwt.sign({ id: user.id, exp: Math.floor(Date.now() / 1000) * 60 }, "jwt")
        if (user) {
            res.json({
                auth: true,
                message: "You are corrently loged in",
                token,
                user
            })
        } else {
            res.json({
                auth: false,
                message: "user does not exist"
            })
        }
    }).catch(() => {
        res.json({
            auth: false,
            message: "Invalid uuid"
        })
    })
}

module.exports = {
    GetAll,
    GetOne,
    PatchOne,
    DeleteOne,
    GetOneWithFilter,
    GetCoinsWithFilter,
    GetOneWithParam,
    GetAllWithFilter,
    GetAllWithFilterWithInclude,
    Post,
    Patch,
    User: {
        Post: PostUser,
        Patch: PatchUser,
        Login: UserLogin,
    }
}