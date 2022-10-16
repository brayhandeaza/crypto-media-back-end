const { faker } = require('@faker-js/faker');
const { Users, Coins } = require('../models')



for (let i = 0; i < 20; i++) {
    Users.create({
        "firstName": faker.name.firstName().toLowerCase(),
        "lastName": faker.name.lastName().toLowerCase(),
        "uuid": faker.random.alphaNumeric(),
        "username": faker.internet.userName().toLowerCase(),
        "image": faker.internet.avatar(),
        "dob": Date()
    })
}