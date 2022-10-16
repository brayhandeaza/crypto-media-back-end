const { Coins } = require("./models")


const tokens = [
    {
        "currency": {
            "symbol": "CERBERUS",
            "address": "0x8b3268a23131dafbd77165690767f285c1aac6c5"
        },
        "value": 637
    },
    {
        "currency": {
            "symbol": "RICH",
            "address": "0xc7bc24c4c18f8251d31611114d0e7b5f5ef76762"
        },
        "value": 113548678.55791092
    },
    {
        "currency": {
            "symbol": "YUMMY",
            "address": "0x05f2df7b3d612a23fe12162a6c996447dce728a5"
        },
        "value": 4366.265143369
    },
    {
        "currency": {
            "symbol": "Key",
            "address": "0x6652462466dcee5cb1dda95379fae3c3e57f6719"
        },
        "value": 0
    },
    {
        "currency": {
            "symbol": "CLU",
            "address": "0x1162e2efce13f99ed259ffc24d99108aaa0ce935"
        },
        "value": 20643641.72374813
    },
    {
        "currency": {
            "symbol": "CAPT",
            "address": "0xd357f048a31d93f2a2b0bad09dd25e3519d6e15c"
        },
        "value": 450000000.9
    },
    {
        "currency": {
            "symbol": "BT",
            "address": "0x8d32605b25921b548eefccdabc11e46543597aa7"
        },
        "value": 38.25
    },
    {
        "currency": {
            "symbol": "RISKMOON",
            "address": "0xa96f3414334f5a0a529ff5d9d8ea95f42147b8c9"
        },
        "value": 149880500.85
    },
    {
        "currency": {
            "symbol": "CATEMOON",
            "address": "0x6ce93e478829b48c70475c935e0ac93044147833"
        },
        "value": 450000000001
    },
    {
        "currency": {
            "symbol": "KEY",
            "address": "0x85c128ee1feeb39a59490c720a9c563554b51d33"
        },
        "value": 0
    },
    {
        "currency": {
            "symbol": "SAFEMOON",
            "address": "0x2df0b14ee90671021b016dab59f2300fb08681fa"
        },
        "value": 750000000000.0001
    },
    {
        "currency": {
            "symbol": "TADP",
            "address": "0xa7acafedcdf33ad7541698701e9a76b48ec62728"
        },
        "value": 888888
    },
    {
        "currency": {
            "symbol": "USDT",
            "address": "0x55d398326f99059ff775485246999027b3197955"
        },
        "value": 0
    },
    {
        "currency": {
            "symbol": "DS",
            "address": "0x498d6109fbcbd09fbce020f5626e1ea26f44ca54"
        },
        "value": 158831459384.9915
    },
    {
        "currency": {
            "symbol": "VIM",
            "address": "0x5bcd91c734d665fe426a5d7156f2ad7d37b76e30"
        },
        "value": 0
    },
    {
        "currency": {
            "symbol": "SCORGI",
            "address": "0x5a81b31b4a5f2d2a36bbd4d755dab378de735565"
        },
        "value": 192000000.96
    },
    {
        "currency": {
            "symbol": "MARKET",
            "address": "0xc7176abdaeb40bb10789347eba20ef0e41f007b5"
        },
        "value": 0.111
    },
    {
        "currency": {
            "symbol": "Cake-LP",
            "address": "0xc5b0d73a7c0e4eaf66babf7ee16a2096447f7ad6"
        },
        "value": 0
    },
    {
        "currency": {
            "symbol": "XVS",
            "address": "0xcf6bb5389c92bdda8a3747ddb454cb7a64626c63"
        },
        "value": -3.2e-17
    },
    {
        "currency": {
            "symbol": "MONS",
            "address": "0xe4c797d43631f4d660ec67b5cb0b78ef5c902532"
        },
        "value": 0
    },
    {
        "currency": {
            "symbol": "VANCAT",
            "address": "0x8597ba143ac509189e89aab3ba28d661a5dd9830"
        },
        "value": 2512326
    },
    {
        "currency": {
            "symbol": "safemoon-dividend.com",
            "address": "0xdbe3e700ab26cbf3523d850b5d892fd17e0ce343"
        },
        "value": 31820
    },
    {
        "currency": {
            "symbol": "NEAR",
            "address": "0x1fa4a73a3f0133f0025378af00236f3abdee5d63"
        },
        "value": 0
    },
    {
        "currency": {
            "symbol": "TBBT.org",
            "address": "0xbf7183b8c8e5bb2d10f63678abb5d52df72712b2"
        },
        "value": 49999.99999999999
    },
    {
        "currency": {
            "symbol": "FIGHT",
            "address": "0x4f39c3319188a723003670c3f9b9e7ef991e52f3"
        },
        "value": 0
    }
]


for (let i = 0; i < tokens.length; i++) {
    const coin = new Coins([
        {
            _id:
                "62eda2b8c8efe63f1e1fb1f4",
            name:
                "MetaElfLand",
            symbol:
                "MELT",
            price:
                0.01048417473186559,
            totalSupply:
                433014316,
            marketCap:
                10329207,
            totalBurned:
                0,
            circulating:
                433014316,
            type:
                "bep20",
            explorer:
                "https://bscscan.com/token/0x7eb35225995b097c84eF10501dD6E93A49bdFd63",
            imageUrl:
                "https://s2.coinmarketcap.com/static/img/coins/200x200/21276.png",
            address:
                "0x7eb35225995b097c84eF10501dD6E93A49bdFd63",
            liquility:
                "usdt",
            createdAt
                :
                "2022 - 08 - 05T23: 06: 55.716+00: 00",
            updatedAt:
                "2022 - 08 - 06T19: 15: 36.632+00: 00",
            inverse:
                false,
            __v:
                0,
        }
    ])

    coin.save()
}