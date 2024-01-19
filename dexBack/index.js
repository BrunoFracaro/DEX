const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/tokenPrice", async (req, res) => {

  const {query} = req

  console.log({query})

  const responseOne = await Moralis.EvmApi.token.getTokenPrice({
    address: query.addressOne
  })

  const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
    address: query.addressTwo
  })

  const usdPrices = {
    tokenOne: responseOne.raw.usdPrice,
    tokenTwo: responseTwo.raw.usdPrice,
    ratio: responseOne.raw.usdPrice/responseTwo.raw.usdPrice,
  }
  
  return res.status(200).json(usdPrices);
});

app.get("/allowance", async (req, res) => {

  const {query} = req

  console.log({query})

  const responseOne = await fetch(`https://api.1inch.io/v5.0/1/approve/allowance?tokenAddress=${query.addressToken}&walletAddress=${query.address}`)
  console.log('responseOne.data', responseOne.data)

  await fetch(`https://api.1inch.io/v5.0/1/approve/allowance?tokenAddress=${query.addressToken}&walletAddress=${query.address}`)
  .then((response) => response.json())
  .then((responseJson) => console.log('here', responseJson))

});


Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});
