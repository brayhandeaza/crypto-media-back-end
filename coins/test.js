const Ethers = require("ethers")
const abi = require("./abi.json")
const ERC20 = require("./web3/ERC20")
const erc20 = new ERC20()

const transaction = async () => {
    const address = "0xe8e8486228753E01Dbc222dA262Aa706Bd67e601"
    const provider = new Ethers.providers.WebSocketProvider(`wss://mainnet.infura.io/ws/v3/${process.env.INFIRA_API_KEY}`)

    const contract = new Ethers.Contract(address, abi, provider)

    // contract.on("Transfer", async () => {
    // })
    await erc20.getTokenInfo(address, false, [
        "0x11450058d796b02eb53e65374be59cff65d3fe7f",
        '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
        "0x27C70Cd1946795B66be9d954418546998b546634",
        "0x9813037ee2218799597d83d4a5b6f3b6778218d9",
        "0x000000000000000000000000000000000000dead",
        "0xadf86e75d8f0f57e0288d0970e7407eaa49b3cab",
        "0xdead000000000000000042069420694206942069",
        "0x8B3192f5eEBD8579568A2Ed41E6FEB402f93f73F",
    ]).then((info) => {
        console.log({
            info
        });
    })
}

transaction();
