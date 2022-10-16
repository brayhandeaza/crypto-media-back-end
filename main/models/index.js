const Users = require("./Users")
const Coins = require("./Coins")
const Posts = require("./Posts")
const Likes = require("./Likes")
const Comments = require("./Comments")
const CommentLikes = require("./CommentLikes")
const UsersFollowers = require("./UsersFollowers")
const Reply = require("./Reply")
const ReplyOfReply = require("./ReplyOfReply")
const ReplyOfReplyLikes = require("./ReplyOfReplyLikes")
const ReplyLikes = require("./ReplyLikes")
const Share = require("./Share")

Posts.belongsTo(Users)
Users.hasMany(Posts)
Users.hasMany(Comments)
Posts.hasMany(Comments)

Users.belongsToMany(Users, {
    through: UsersFollowers,
    as: "fallower",
    foreignKey: "fallower",
})

Users.belongsToMany(Users, {
    through: UsersFollowers,
    as: "fallowing",
    foreignKey: "userId",
})

UsersFollowers.belongsTo(Users)

Comments.belongsTo(Posts)
Comments.belongsTo(Users)

CommentLikes.belongsTo(Comments)
Comments.hasMany(CommentLikes, { onDelete: 'CASCADE' })
CommentLikes.belongsTo(Users)

Likes.belongsTo(Users)
Users.hasMany(Likes)

Likes.belongsTo(Posts)
Posts.hasMany(Likes)
Posts.hasMany(Likes)

Reply.belongsTo(Comments)
Reply.belongsTo(Users)
Comments.hasMany(Reply)

ReplyLikes.belongsTo(Reply)
Reply.hasMany(ReplyLikes)

ReplyLikes.belongsTo(Users)
Users.hasMany(ReplyLikes)

ReplyOfReplyLikes.belongsTo(ReplyOfReply)
ReplyOfReply.hasMany(ReplyOfReplyLikes)

ReplyOfReplyLikes.belongsTo(Users)
Users.hasMany(ReplyOfReplyLikes)

ReplyOfReply.belongsTo(Reply)
Reply.hasMany(ReplyOfReply)

ReplyOfReply.belongsTo(Users)
Users.hasMany(ReplyOfReply)

Share.belongsTo(Users)
Users.hasMany(Share)

Share.belongsTo(Posts)
Posts.hasMany(Share)


module.exports = {
    Users,
    Coins,
    Posts,
    Likes,
    Comments,
    CommentLikes,
    Reply,
    UsersFollowers,
    ReplyLikes,
    ReplyOfReply,
    Share,
    ReplyOfReplyLikes
}