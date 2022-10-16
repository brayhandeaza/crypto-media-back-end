const router = require("express").Router()
const { GetAll, GetOne, Post, Patch } = require("../auth/routesMaker")
const { Posts, Likes, CommentLikes, Comments, ReplyLikes, Reply } = require("../models")
const joi = require("joi")
const { Op } = require("sequelize")


// Like Schema
const ReplyLikeSchema = joi.object({
    userId: joi.number().required(),
})
// Like Schema
const LikeSchema = joi.object({
    userId: joi.number().required(),
    postId: joi.number().optional(),
})

// CommentLikes Schema
const CommentLikeSchema = joi.object({
    userId: joi.number().required(),
    commentId: joi.number().optional()
})

router.get("/", (req, res) => {
    GetAll(req, res, Likes)
})

router.get("/comment/:id", async (req, res) => {
    await CommentLikes.findAll({
        where: {
            commentId: req.params.id,
        },
        attributes: ["commentId"]
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
            message: err
        })
    })
})

router.get("/post/:id", async (req, res) => {
    await Likes.findAll({
        where: {
            postId: req.params.id,
        },
        attributes: ["userId"]
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
            message: err
        })
    })
})

router.get("/post/count/:id", async (req, res) => {
    await Likes.count({
        where: {
            postId: req.params.id,
        },
        order: [['updatedAt', 'DESC']],
    }).then((data) => {
        res.json({
            data,
            error: false,
            search: req.headers["type"]
        })
    }).catch((err) => {
        res.json({
            error: true,
            message: err
        })
    })
})

router.get("/:id", (req, res) => {
    GetOne(req, res, Likes)
})

// Create Comment Like
router.post("/comment", (req, res) => {
    Post(req, res, CommentLikes, CommentLikeSchema)
})
router.post("/", (req, res) => {
    Post(req, res, Likes, LikeSchema)
})

router.patch("/:id", (req, res) => {
    Patch(req, res, Likes)
})

router.post("/comment/:id", async (req, res) => {
    CommentLikeSchema.validateAsync(req.body).then(async () => {
        await CommentLikes.findOne({
            where: {
                [Op.and]: [
                    { commentId: req.params.id },
                    { userId: req.body.userId }
                ]
            }
        }).then(async (table) => {
            if (table) {
                table.destroy().then(async () => {
                    await CommentLikes.count({
                        where: {
                            commentId: req.params.id,
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
                await CommentLikes.create({
                    commentId: req.params.id,
                    userId: req.body.userId
                }).then(async () => {
                    await CommentLikes.count({
                        where: {
                            commentId: req.params.id,
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

router.post("/reply/:id", async (req, res) => {
    ReplyLikeSchema.validateAsync(req.body).then(async () => {
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
                    res.json({
                        err
                    })
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

router.get("/reply/:id", async (req, res) => {
    await Reply.findAll({
        where: {
            commentId: req.params.id,
        },
        include: [
            {
                model: ReplyLikes,
                attributes: ["id"]
            }
        ]

    }).then((count) => {
        res.json({
            data: count,
        })
    })
})


router.post("/:id", async (req, res) => {
    LikeSchema.validateAsync(req.body).then(async () => {
        await Likes.findOne({
            where: {
                [Op.and]: [
                    { postId: req.params.id },
                    { userId: req.body.userId }
                ]
            }
        }).then(async (table) => {
            if (table) {
                table.destroy().then(async () => {
                    await Likes.count({
                        where: {
                            postId: req.params.id,
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
                await Likes.create({
                    postId: req.params.id,
                    userId: req.body.userId
                }).then(async () => {
                    await Likes.count({
                        where: {
                            postId: req.params.id,
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

module.exports = router