const router = require("express").Router()
const { GetAll, GetOne, DeleteOne, GetCommentsWithFilter, Post, Patch, GetAllWithFilterWithInclude } = require("../auth/routesMaker")
const { Users, CommentLikes, Comments, Reply, Likes, ReplyLikes } = require("../models")
const joi = require("joi")
const { db } = require("../config/db")
const ReplyOfReply = require("../models/ReplyOfReply")
const { Op, fn, col, literal } = require("sequelize")

// Comments Schema
const CommentsSchema = joi.object({
    body: joi.string().required().allow(null),
    imageUrl: joi.string().required().allow(null),
    userId: joi.number().required(),
    postId: joi.number().required(),
    parentId: joi.number().required().allow(null),
})


router.get("/", (req, res) => {
    GetAll(req, res, Comments)
})

router.get("/count/:id", async (req, res) => {
    await Comments.findAndCountAll({
        where: {
            postId: req.params.id
        }
    }).then((count) => {
        res.send(count)
    })
})

router.get("/post/:id", async (req, res) => {
    await Comments.findAll({
        where: {
            [Op.and]: [
                { postId: req.params.id },
                { hidden: false }
            ]
        },
        order: [['id', 'DESC']],
        limit: req.query.limit,
        include: [
            {
                model: Reply,
                attributes: ["id"],
            },
            {
                model: Users,
                attributes: ["id", "image", "firstName", "lastName", "username"]
            },
            {
                model: CommentLikes,
                attributes: ["id"],
                include: {
                    model: Users,
                    attributes: ["id", "image"],
                }
            }
        ]
    }).then(async (data) => {
        await Comments.count({
            where: {
                [Op.and]: [
                    { postId: req.params.id },
                    { hidden: false }
                ]
            }
        }).then((count) => {
            res.json({
                data,
                count,
                error: false,
            })
        })
    }).catch((err) => {
        res.json({
            error: true,
            message: err
        })
    })
})

router.get("/:id", (req, res) => {
    GetOne(req, res, Comments)
})

router.post("/", (req, res) => {
    CommentsSchema.validateAsync(req.body).then(async (bag) => {
        if (bag) {
            await Comments.create(req.body).then((comment) => {
                res.json({
                    error: false,
                    comment,
                    action: "create"
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
})

router.patch("/:id", (req, res) => {
    Patch(req, res, Comments)
})

router.delete("/:id", async (req, res) => {
    try {
        const comment = await Comments.findOne({
            where: { id: req.params.id },
        })
        await CommentLikes.destroy({
            where: { commentId: comment.id },
        })

        const reply = await Reply.findAll({
            where: { commentId: comment.id },
        })

        for (let i = 0; i < reply.length; i++) {
            await ReplyLikes.destroy({
                where: { replyId: reply[i].id },
            })
        }

        Reply.destroy({
            where: { commentId: comment.id },
        })

        comment.destroy()

        res.json({
            auth: true,
            message: "row deleted succefully"
        })
    } catch (error) {
        res.json({
            auth: true,
            message: error

        })
    }
})

module.exports = router