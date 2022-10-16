const router = require("express").Router()
const { GetAll, GetOne, DeleteOne, User, GetOneWithFilter, GetOneWithParam } = require("../auth/routesMaker")
const { Users, Posts, UsersFollowers, Comments } = require("../models")
const joi = require("joi")
const { Op, fn, col,  } = require('sequelize')

// User Schema
const UsersSchema = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    uuid: joi.string().required(),
    username: joi.string().required(),
    image: joi.string().required(),
    dob: joi.string().required(),
})


router.post("/login", async (req, res) => {
    await Users.findOne({
        where: {
            uuid: req.body.uuid,
        }
    }).then((users) => {
        res.json(users)
    }).catch((err) => {
        res.json({
            error: true,
            message: err.message.toString()
        })
    })
})


// Get all users
router.get("/", async (req, res) => {
    // GetAll(req, res, Users)
    await Users.findAll({
        attributes: {
            include: [[fn("COUNT", col("posts.id")), "postCount"]]
        },
        group: "users.id",
        include: [{
            model: Posts, attributes: []
        }],
    }).then((users) => {
        res.json(users)
    })
})

// Get one user by id
router.get("/search", (req, res) => {
    GetOneWithFilter(req, res, Users)
})

// Get one user by id
router.get("/:id", (req, res) => {
    GetOne(req, res, Users)
})

// Get one user by uuid
router.get("/f/:id", (req, res) => {
    GetOneWithParam(req, res, Users, "uuid")
})

// Get one user by id
router.get("/q/:id", (req, res) => {
    GetOneWithParam(req, res, Users, "username")
})

// Create single user
router.post("/", (req, res, next) => {
    User.Post(req, res, next, Users, UsersSchema)
}, async (req, res) => {
    if (!req.user.error) await UsersFollowers.create({ fallower: req.user.user.id, userId: req.user.user.id })

    res.json({
        user: req.user
    })
})

// Update single user
router.patch("/:id", (req, res) => {
    User.Patch(req, res, Users)
})

// Update single user
router.patch("/:id", (req, res) => {
    User.Patch(req, res, Users)
})

// Delete single user
router.delete("/:id", (req, res) => {
    DeleteOne(req, res, Users)
})

// Unfollow single user
router.delete("/:userId/following/:followingId", async (req, res) => {
    await UsersFollowers.findOne({
        where: {
            [Op.and]: [
                { fallower: req.params.userId },
                { userId: req.params.followingId },
            ]
        }
    }).then((fallower) => {
        fallower.destroy().then(() => {
            res.json({
                status: 400,
                error: false,
                message: "This row does not exist in this table"
            })
        }).catch((err) => {
            res.json({
                error: true,
                message: err.toString()
            })
        })
    }).catch((err) => {
        res.json({
            error: true,
            message: "This row does not exist in this table"
        })
    })
})

module.exports = router