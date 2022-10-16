const router = require("express").Router()
const { GetAll, GetOne, DeleteOne, GetCommentsWithFilter, Post, Patch, GetAllWithFilterWithInclude } = require("../auth/routesMaker")
const { Users, CommentLikes, Comments, Reply, ReplyLikes, ReplyOfReply, ReplyOfReplyLikes } = require("../models")
const joi = require("joi")
const { db } = require("../config/db")
const { Op } = require("sequelize")

// Comments Schema
const ReplySchema = joi.object({
    body: joi.string().required().allow(null),
    imageUrl: joi.string().required().allow(null),
    userId: joi.number().required(),
    commentId: joi.number().optional(),
    replyId: joi.number().optional()
})

router.get("/", async (req, res) => {
    await Reply.findAll().then((replies) => {
        res.json(replies)
    })
})

router.get("/comment/:id", async (req, res) => {
    await Reply.findAll({
        where: {
            [Op.and]: [
                { commentId: req.params.id },
                { hidden: false }
            ]
        },
        order: [['id', 'DESC']],
        limit: req.query.limit,
        include: [
            {
                model: ReplyLikes,
                attributes: ["id", "replyId", "userId"]
            },
            {
                model: ReplyOfReply,
                // attributes: ["id"]
            },
            {
                model: Users,
                attributes: ["id", "uuid", "username", "image", "firstName", "lastName"]
            }
        ]
    }).then(async (data) => {
        await Reply.count({
            where: {
                [Op.and]: [
                    { commentId: req.params.id },
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

router.get("/:id/reply-of-reply", async (req, res) => {
    await ReplyOfReply.findAll({
        where: {
            [Op.and]: [
                { replyId: req.params.id },
                { hidden: false }
            ]
        },
        order: [['id', 'DESC']],
        limit: req.query.limit,
        include: [
            {
                model: ReplyOfReplyLikes
            },
            {
                model: Users,
                attributes: ["id", "uuid", "username", "image", "firstName", "lastName"]
            }
        ]
    }).then(async (data) => {
        await ReplyOfReply.count({
            where: {
                [Op.and]: [
                    { replyId: req.params.id },
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

router.post("/", async (req, res) => {
    ReplySchema.validateAsync(req.body).then(async (bag) => {
        if (bag) {
            await Reply.create(req.body).then((replies) => {
                res.json({
                    error: false,
                    replies,
                })
            }).catch((err) => {
                res.json({
                    error: true,
                    message: err
                })
            })
        }
    }).catch((err) => {
        res.send(err)
    })
})

router.post("/reply-of-reply", async (req, res) => {
    ReplySchema.validateAsync(req.body).then(async (bag) => {
        if (bag) {
            await ReplyOfReply.create(req.body).then((replies) => {
                res.json({
                    error: false,
                    replies,
                })
            }).catch((err) => {
                res.json({
                    error: true,
                    message: err
                })
            })
        }
    }).catch((err) => {
        res.send(err)
    })
})

router.post("/:id", async (req, res) => {
    ReplySchema.validateAsync(req.body).then(async () => {
        await ReplyLikes.findOne({
            where: {
                [Op.and]: [
                    { replyId: req.params.id },
                    { userId: req.body.userId }
                ]
            }
        }).then(async (table) => {
            if (table) {
                table.destroy().then(async () => {
                    await ReplyLikes.count({
                        where: {
                            replyId: req.params.id,
                        },
                        order: [['updatedAt', 'DESC']],
                    }).then((count) => {
                        res.json({
                            status: 200,
                            likesCount: count,
                            action: "delete"
                        })
                    })
                }).catch((err) => {
                    res.send("err")
                })
            } else {
                await ReplyLikes.create({
                    replyId: req.params.id,
                    userId: req.body.userId
                }).then(async () => {
                    await ReplyLikes.count({
                        where: {
                            replyId: req.params.id,
                        }
                    }).then((count) => {
                        res.json({
                            status: 200,
                            likesCount: count,
                            action: "create"
                        })
                    })
                })
            }
        }).catch((err) => {
            res.send(err)
        })
    }).catch((err) => {
        res.send(err)
    })
})

router.patch("/:id", (req, res) => {
    Patch(req, res, Reply)
})

router.delete("/:id", async (req, res) => {
    await Reply.destroy({ where: { id: req.params.id } }).then(() => {
        res.json({
            error: false,
            message: "reply deleted successfully"
        })
    }).catch((err) => {
        res.json({
            error: true,
            message: err.toString()
        })
    })
})

module.exports = router