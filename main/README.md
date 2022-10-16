<h1>Social Media Server</h1>

This is an overview of the <b>Social Media</b> documentation and related resources.

<h2>Token Query</h2>


<b>Get all token current price </b>
```javascript
{
  ethereum(network: bsc) {
    TOKEN: dexTrades(
      baseCurrency: {is: "0x984811e6f2695192add6f88615dF637bf52a5Cae"}
      quoteCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}
    ) {
      price: maximum(of: block, get: quote_price)
    }
  }
}
```


