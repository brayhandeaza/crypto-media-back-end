const Web3 = require('web3');
const { ERC20ABI, UniswapABI } = require("./abis")

class ERC20 {
    constructor() {
        this.web3 = new Web3(process.env.ETHREUM_HTTP_PROVIDER_URL);
        this.uniswapFCAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
        this.wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
        this.usdAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
        this.uniswapContract = new this.web3.eth.Contract(UniswapABI, this.uniswapFCAddress);
    }

    getETHPrice = async () => {
        const pairAddress = await this.uniswapContract.methods.getPair(this.wethAddress, this.usdAddress).call();
        const pairContract = new this.web3.eth.Contract(ERC20ABI, pairAddress);
        const pairReserves = await pairContract.methods.getReserves().call();

        const r_0 = pairReserves._reserve0;
        const r_1 = pairReserves._reserve1;
        const price = (r_0 * (10 ** 18)) / (r_1 * (10 ** 18))

        return price
    }

    getTokenName = async (tokenAddress) => {
        const tokenContract = new this.web3.eth.Contract(ERC20ABI, tokenAddress)
        return await tokenContract.methods.name().call()
    }

    getTokenSymbol = async (tokenAddress) => {
        const tokenContract = new this.web3.eth.Contract(ERC20ABI, tokenAddress)
        return await tokenContract.methods.symbol().call()
    }

    getTokenDecimal = async (tokenAddress) => {
        const tokenContract = new this.web3.eth.Contract(ERC20ABI, tokenAddress)
        return await tokenContract.methods.decimals().call()
    }

    getTokenSupply = async (tokenAddress) => {
        const tokenContract = new this.web3.eth.Contract(ERC20ABI, tokenAddress)
        const tokenDecimal = await this.getTokenDecimal(tokenAddress)

        let totalSupply = await tokenContract.methods.totalSupply().call()
        totalSupply *= 10 ** -(tokenDecimal)

        return totalSupply
    }

    getTokenMarketCap = async (tokenAddress, isInverseDivision, addresses) => {
        const tokenContract = new this.web3.eth.Contract(ERC20ABI, tokenAddress)
        const totalSupply = await this.getTokenSupply(tokenAddress)
        const tokenDecimal = await this.getTokenDecimal(tokenAddress)
        const bernArray = []

        for (let i = 0; i < addresses.length; i++) {
            let totalBurned = await tokenContract.methods.balanceOf(addresses[i]).call()
            totalBurned *= 10 ** -(tokenDecimal)
            bernArray.push(totalBurned)
        }

        const berned = bernArray.reduce((partialSum, a) => partialSum + a, 0)
        const circulating = totalSupply - berned
        const price = await this.getTokenPrice(tokenAddress, isInverseDivision)
        const marketCap = circulating * price

        return {
            totalSupply,
            marketCap,
            totalBurned: berned,
            circulating
        }
    }

    getTokenPrice = async (tokenAddress, isInverseDivision) => {
        const pairAddress = await this.uniswapContract.methods.getPair(tokenAddress, this.wethAddress).call();
        const pairContract = new this.web3.eth.Contract(ERC20ABI, pairAddress);
        const pairReserves = await pairContract.methods.getReserves().call();
        const tokenDecimal = await this.getTokenDecimal(tokenAddress)
        const r_0 = pairReserves._reserve0;
        const r_1 = pairReserves._reserve1;

        let price = null

        if (isInverseDivision) {
            price = (r_0 * (10 ** tokenDecimal)) / (r_1 * (10 ** 18))
        }
        else {
            price = (r_1 * (10 ** tokenDecimal)) / (r_0 * (10 ** 18))
        }

        const ethPrice = await this.getETHPrice()
        price = price * ethPrice

        return price;
    }

    getTokenInfo = async (address, isInverseDivision, liquility = "weth") => {

        switch (liquility) {
            case "weth":
                this.wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
                break;
            case "usdc":
                this.wethAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
                break;
            case "usdt":
                this.wethAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"
                break;
            case "dai":
                this.wethAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
                break;
            default:
                this.wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
                break;
        }

        const name = await this.getTokenName(address)
        const symbol = await this.getTokenSymbol(address)
        const price = await this.getTokenPrice(address, isInverseDivision)
        const totalSupply = await this.getTokenSupply(address)
        const data = await this.getTokenMarketCap(address, isInverseDivision, [
            "0x11450058d796b02eb53e65374be59cff65d3fe7f",
            '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
            "0x27C70Cd1946795B66be9d954418546998b546634",
            "0x9813037ee2218799597d83d4a5b6f3b6778218d9",
            "0x000000000000000000000000000000000000dead",
            "0xadf86e75d8f0f57e0288d0970e7407eaa49b3cab",
            "0xdead000000000000000042069420694206942069",
            "0x8B3192f5eEBD8579568A2Ed41E6FEB402f93f73F",
        ])

        // console.log({
        //     name,
        //     symbol,
        //     price,
        //     totalSupply: parseInt(totalSupply),
        //     marketCap: parseInt(data.marketCap),
        //     totalBurned: parseInt(data.totalBurned),
        //     circulating: parseInt(data.circulating)
        // });

        return {
            name,
            symbol,
            price,
            totalSupply: parseInt(totalSupply),
            marketCap: parseInt(data.marketCap),
            totalBurned: parseInt(data.totalBurned),
            circulating: parseInt(data.circulating)
        }
    }

}


// const erc20 = new ERC20()
// erc20.getTokenInfo("0x30dcba0405004cf124045793e1933c798af9e66a", false, "weth")


module.exports = ERC20


