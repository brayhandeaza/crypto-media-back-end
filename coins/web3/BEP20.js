const Web3 = require('web3')
const { ERC20ABI, PancakeswapABI, UniswapABI } = require("./abis")

class BEP20 {
    constructor() {
        this.web3 = new Web3(process.env.BINANCE_HTTP_PROVIDER_URL)
        this.exchangeAddress = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73'
        this.ERC20ABI = ERC20ABI
        this.exchangeABI = PancakeswapABI
        this.baseAddress = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
        this.usdAddress = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
        this.exchangeContract = new this.web3.eth.Contract(this.exchangeABI, this.exchangeAddress);
    }

    watch = (address) => {
        const account = address.toLowerCase();
        const subscription = this.web3.eth.subscribe('pendingTransactions', (err, res) => {
            if (err) console.error(err);
        })
        subscription.on('data', (txHash) => {
            setTimeout(async () => {
                try {
                    const tx = await web3.eth.getTransaction(txHash);
                    if (tx && tx.to) { // This is the point you might be looking for to filter the address
                        if (tx.to.toLowerCase() === account) {
                            console.log('=====================================') // a visual separator
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            })
        })
    }

    getPrice = async () => {
        const pairAddress = await this.exchangeContract.methods.getPair(this.baseAddress, this.usdAddress).call();
        const pairContract = new this.web3.eth.Contract(this.ERC20ABI, pairAddress);
        const pairReserves = await pairContract.methods.getReserves().call();
        const r_0 = pairReserves._reserve0;
        const r_1 = pairReserves._reserve1;
        const price = (r_1 * (10 ** 18)) / (r_0 * (10 ** 18))
        return price
    }

    getTokenName = async (tokenAddress) => {
        const tokenContract = new this.web3.eth.Contract(this.ERC20ABI, tokenAddress)
        const name = await tokenContract.methods.name().call()
        return name
    }

    getTokenSymbol = async (tokenAddress) => {
        const tokenContract = new this.web3.eth.Contract(this.ERC20ABI, tokenAddress)
        const symbol = await tokenContract.methods.symbol().call()
        return symbol
    }

    getTokenDecimal = async (tokenAddress) => {
        const tokenContract = new this.web3.eth.Contract(this.ERC20ABI, tokenAddress)
        const decimal = await tokenContract.methods.decimals().call()
        return decimal
    }

    getTotalSupply = async (tokenAddress) => {
        const tokenContract = new this.web3.eth.Contract(this.ERC20ABI, tokenAddress)
        const tokenDecimal = await this.getTokenDecimal(tokenAddress)

        let totalSupply = await tokenContract.methods.totalSupply().call()
        totalSupply *= 10 ** -(tokenDecimal)

        return totalSupply
    }

    getTokenMarketCap = async (tokenAddress, isInverseDivision) => {
        const tokenContract = new this.web3.eth.Contract(this.ERC20ABI, tokenAddress)
        const totalSupply = await this.getTotalSupply(tokenAddress)
        const tokenDecimal = await this.getTokenDecimal(tokenAddress)

        let totalBurned = await tokenContract.methods.balanceOf('0x000000000000000000000000000000000000dead').call()
        totalBurned *= 10 ** -(tokenDecimal)

        const circulating = totalSupply - totalBurned
        const price = await this.getTokenPrice(tokenAddress, isInverseDivision)
        const marketCap = circulating * price

        return {
            totalSupply,
            totalBurned,
            circulating,
            marketCap
        }
    }

    getTokenPrice = async (tokenAddress, isInverseDivision) => {
        try {
            const pairAddress = await this.exchangeContract.methods.getPair(tokenAddress, this.baseAddress).call();
            const pairContract = new this.web3.eth.Contract(this.ERC20ABI, pairAddress);
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

            const ethPrice = await this.getPrice()
            price = price * ethPrice

            return price

        } catch (error) {
            console.log(error.message);
        }
    }

    i = 0

    getTokenInfo = async (tokenAddress, isInverseDivision) => {
        const name = await this.getTokenName(tokenAddress)
        const symbol = await this.getTokenSymbol(tokenAddress)
        const totalSupply = await this.getTotalSupply(tokenAddress)
        const price = await this.getTokenPrice(tokenAddress, isInverseDivision)
        const token = await this.getTokenMarketCap(tokenAddress, isInverseDivision)
        this.i++
        console.log(this.i);
        const data = {
            name,
            symbol,
            price,
            totalSupply,
            marketCap: token.marketCap,
            totalBurned: token.totalBurned,
            circulatingSupply: token.circulating,
        }

        // console.log(data);
        return data
    }
}

// const bep20 = new BEP20()
// bep20.getTokenInfo("0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82", false)

module.exports = BEP20
