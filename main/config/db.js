const { Sequelize } = require("sequelize")

const db = new Sequelize({
    host: process.env.POSTGRES_HOST,
    dialect: "postgres",
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    port: 5432,
    password: process.env.POSTGRES_PASSWORD
})

const checkDatabaseConnection = async () => {
    try {
        await db.authenticate()
        db.sync()
        console.log('Connection has been established successfully.')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
        await new Promise(res => setTimeout(res, 5000))
    }
}

module.exports = {
    db,
    checkDatabaseConnection
}