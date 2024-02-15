import React from 'react'
import { Box, Typography, TextField, Fab, Popover, Button } from '@mui/material'
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useSendTransaction, useWaitForTransaction, useBalance, erc20ABI, useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import { ReactComponent as Logo } from "../assets/images/eth.svg";
import { Alchemy, Network } from "alchemy-sdk";
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import SimpleAreaChart from './swapChart';
import { ReactComponent as Metamask } from "../assets/images/metamask.svg";
const qs = require('qs');
import { MAX_ALLOWANCE } from './constants';

const chainlink = require('../assets/historical/chainLink_historical.json')
const theter = require('../assets/historical/theter_historical.json')

const config = {
  apiKey: process.env.REACT_APP_ALCHEMY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

const tokenList = require('../assets/historical/tokenList.json')

function Swap(props) {
  const { address, isConnected, connect } = props;

  const historical = [chainlink, theter]
  const [value, setValue] = React.useState('')
  const [displayBalance, setDisplayBalance] = React.useState('')
  const [userBalance, setUserBalance] = React.useState([])
  const [convertRatio, setConvertRatio] = React.useState(0)
  const [tokenOneType, setTokenOneType] = React.useState(tokenList[0])
  const [tokenTwoType, setTokenTwoType] = React.useState(tokenList[1])
  const [selected, setSelected] = React.useState(0)
  const balance = useBalance({
    address: address,
  })

  const [dimensions, setDimensions] = React.useState([0, 0])
  const ref = React.useRef(null)

  const [dimensions2, setDimensions2] = React.useState([0, 0])
  const ref2 = React.useRef(null)

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverOpen2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setAnchorEl2(null);
  };

  const handleChangeToken1 = (item) => {
    if (item.name == tokenTwoType.name) {
      setTokenOneType(tokenTwoType)
      setTokenTwoType(tokenOneType)
      fetchPrices(tokenTwoType, tokenOneType)
      updateBalance(tokenTwoType)
    } else {
      setTokenOneType(item)
      fetchPrices(item, tokenTwoType)
      updateBalance(item)
    }
    handlePopoverClose()
  }

  const handleChangeToken2 = (item) => {
    if (item.name == tokenOneType.name) {
      setTokenTwoType(tokenOneType)
      setTokenOneType(tokenTwoType)
      fetchPrices(tokenTwoType, tokenOneType)
      updateBalance(tokenTwoType)
    } else {
      setTokenTwoType(item)
      fetchPrices(tokenOneType, item)
    }
    handlePopoverClose()
  }

  const invert = () => {
    setTokenTwoType(tokenOneType)
    setTokenOneType(tokenTwoType)
    fetchPrices(tokenTwoType, tokenOneType)
    updateBalance(tokenTwoType)
  }

  React.useEffect(() => {
    const handleResize = () => {
      setDimensions([ref.current.clientWidth, ref.current.clientHeight])
      setDimensions2([ref2.current.clientWidth, ref2.current.clientHeight])
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  React.useEffect(() => {
    fetchPrices(tokenList[0], tokenList[1])
    getUserBalance()
    setDimensions([ref.current.clientWidth, ref.current.clientHeight])
    setDimensions2([ref2.current.clientWidth, ref2.current.clientHeight])
  }, [])

  const [txDetails, setTxDetails] = React.useState({
    to: null,
    data: null,
    value: null,
  });

  React.useEffect(() => {
    if (txDetails.to && isConnected) {
      sendTransaction();
    }
  }, [txDetails])

  const { data, sendTransaction } = useSendTransaction({
    request: {
      from: address,
      to: String(txDetails.to),
      data: String(txDetails.data),
      value: String(txDetails.value),
    }
  })

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  React.useEffect(() => {
    console.log({ isSuccess })
  }, [isSuccess])

  const exchangeProxy = "0xDef1C0ded9bec7F1a1670819833240f027b25EfF";

  const { data: allowance, refetch } = useContractRead({
    address: tokenOneType.address,
    abi: erc20ABI,
    functionName: "allowance",
    args: [address, exchangeProxy],
  });

  const { data: allowData, sendTransaction: allowSend } = useSendTransaction({
    request: {
      from: address,
      to: tokenOneType.address,
      abi: erc20ABI,
      functionName: "allowance",
      args: [address, exchangeProxy],
    }
  })

  const { isLoading: allowLoading, isSuccess: allowSucc } = useWaitForTransaction({
    hash: allowData?.hash,
  })

  React.useEffect(() => {
    console.log({ allowLoading, allowSucc })
  }, [allowLoading, allowSucc])

  async function fetchDexSwap() {

    const absoluteValue = String(Math.pow(10, tokenOneType.decimals) * value)

    const params = {
      sellToken: tokenOneType.address,
      buyToken: tokenTwoType.address,
      sellAmount: absoluteValue,
      takerAddress: address,
    }

    const headers = { "0x-api-key": process.env.REACT_APP_OX };

    const response = await fetch(
      `https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`, { headers }
    );

    const responseJson = await response.json()

    console.log({responseJson})

    await refetch()

    console.log({allowance})

    if (allowance._hex == '0x00'){
      allowSend()
      console.log('dsdsds', allowSucc)
    }

    const newTx = {
      to: responseJson.to,
      data: responseJson.data,
      value: responseJson.value
    }
    setTxDetails(newTx)
  }

  const getUserBalance = async () => {
    const tokenAddress = tokenList.map((item) => item.address)
    const data = await alchemy.core.getTokenBalances(
      address,
      tokenAddress
    );
    setUserBalance(data.tokenBalances)
    const balance = data.tokenBalances.filter((item) => item.contractAddress == tokenOneType.address)[0].tokenBalance
    setDisplayBalance(Number(balance))
  }

  const updateBalance = (newTokenOne) => {
    const balance = userBalance.filter((item) => item.contractAddress == newTokenOne.address)[0].tokenBalance
    setDisplayBalance(Number(balance))
  }

  const fetchPrices = async (one, two) => {

    const absoluteValue = String(Math.pow(10, one.decimals) * 1)

    const params = {
      sellToken: one.address,
      buyToken: two.address,
      sellAmount: absoluteValue,
      takerAddress: address,
    };

    const headers = { "0x-api-key": process.env.REACT_APP_OX };

    const response = await fetch(
      `https://api.0x.org/swap/v1/price?${qs.stringify(params)}`, { headers }
    );

    const responseJson = await response.json()

    setConvertRatio(responseJson.price)
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2, flex: 1, flexWrap: 'wrap', }}>
      <Box ref={ref} sx={{
        height: 'fit-content', width: '30%', minWidth: window.screen.width < 400 ? window.screen.width * 0.9 : 400, paddingBottom: 2, background: '#38383888', borderRadius: 5, boxShadow: 10, marginBottom: 2,
        "box-shadow": `0px 0px 10px 0px #0CD0AC`,
        "-webkit-box-shadow": `0px 0px 10px 0px #0CD0AC`,
        "-moz-box-shadow": `0px 0px 10px 0px #0CD0AC`,
      }}>
        {!isConnected || isLoading ? (
          <Box className={'modalGlass'} sx={{ zIndex: 100000, borderRadius: 5, position: 'absolute', display: 'flex', width: dimensions[0], height: dimensions[1], justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            {!isConnected ? (
              <>
                <Logo />
                <Typography marginBottom={2} color={'third.light'} width={'50%'} marginTop={2} fontWeight={600}>
                  Connect your Ethereum wallet to make ERC-20 tokens swaps
                </Typography>
                <Button sx={{
                  "box-shadow": `0px 0px 10px 0px #36E5C7`,
                  "-webkit-box-shadow": `0px 0px 10px 0px #36E5C7`,
                  "-moz-box-shadow": `0px 0px 10px 0px #36E5C7`,
                  textTransform: 'none'
                }} onClick={connect} variant='contained' color={'third'}>
                  <Metamask width='30' height='30' />
                  <Typography marginLeft={2}>{isConnected ? (address.slice(0, 4) + "..." + address.slice(38)) : "Connect Wallet"}</Typography>
                </Button>
              </>
            ) : (
              <>
                <Typography color={'third.light'} fontWeight={600} marginBottom={2} >Approve the transactions on your wallet</Typography>
                <Typography width={'80%'} fontWeight={600} marginBottom={2} >In your first swap with a token, the gas fee is higher as you need to approve the transaction of the token</Typography>
                <Stack sx={{ width: '80%' }} spacing={2}>
                  <LinearProgress sx={{ borderRadius: 3, height: 10 }} color="third" />
                </Stack>
              </>
            )}
          </Box>
        ) : undefined}
        <Typography ml={'10%'} width={'80%'} mb={5} mt={2} fontSize={28} color={'third.main'}>Swap your ERC-20 token on the Ethereum Blockchain</Typography>
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <TextField type={'number'} placeholder='0' InputProps={{ sx: { borderRadius: 2, color: '#f00' } }} inputProps={{ style: { color: '#fff' } }} sx={{ color: '#fff', background: '#000', width: '60%', borderRadius: 2 }} focused color='primary' id="outlined-basic" label="" variant="outlined" value={value} onChange={(e) => setValue(e.target.value)} />
          <Typography sx={{ width: 80 }}>{tokenOneType.ticker}</Typography>
          <Fab onClick={handlePopoverOpen} id={'myToken'} color="primary" aria-label="add">
            {tokenOneType.ticker == "ETH" ? (
              <Logo width={'40'} />
            ) : (
              <Box component="img" sx={{ width: '40px', borderRadius: 5 }} alt="selected token" src={tokenOneType.img} />
            )}
          </Fab>
          <Popover
            id={'myTokenPopover'}
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Box sx={{ padding: 2, height: 250, }}>
              {tokenList.map((item) => (
                <Box onClick={() => handleChangeToken1(item)} sx={{ display: 'flex', width: 150, flexDirection: 'row', alignItems: 'center', cursor: 'pointer', padding: 1, justifyContent: 'space-between' }}>
                  <Typography color='third.main'>{item.name}</Typography>
                  {item.ticker == "ETH" ? (
                    <Logo width={'40'} />
                  ) : (
                    <Box component="img" sx={{ width: '40px', borderRadius: 5 }} alt="selected token" src={item.img} />
                  )}
                </Box>
              ))}
            </Box>
          </Popover>
        </Box>
        <Box sx={{ marginTop: '10px', marginBottom: '20px', display: 'flex', width: '90%', flexDirection: 'row', justifyContent: 'space-between', marginLeft: '5%' }}>
          {/* <Typography sx={{ color: 'third.main', fontSize: 12 }}>US$ {Math.round(value * convertRatio * 100) / 100}</Typography> */}
          {tokenOneType.ticker == "ETH" ? (
            <Typography sx={{ color: 'primary.medium', fontSize: 12 }}>Your balance: {!balance.data ? '' : Math.round(balance.data.formatted * 100000) / 100000}</Typography>
          ) : (
            <Typography sx={{ color: 'primary.medium', fontSize: 12 }}>Your balance: {Math.round(displayBalance * 100) / 100}</Typography>
          )}
          <SwapVertIcon onClick={() => invert()} sx={{ cursor: 'pointer', marginTop: '10px' }} color={'third'} fontSize='large' />
        </Box>
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <TextField InputProps={{ sx: { borderRadius: 2 } }} inputProps={{ style: { color: '#fff' } }} sx={{ color: '#fff', background: '#000', width: '60%', borderRadius: 2 }} focused color='primary' id="outlined-basic" label="" variant="outlined" value={Math.round(value * convertRatio * 10000) / 10000} />
          <Typography sx={{ width: 80 }}>{tokenTwoType.ticker}</Typography>
          <Fab onClick={handlePopoverOpen2} id={'changeToken'} color="primary" aria-label="add">
            {tokenTwoType.ticker == "ETH" ? (
              <Logo width={'40'} />
            ) : (
              <Box component="img" sx={{ width: '40px', borderRadius: 5 }} alt="selected token" src={tokenTwoType.img} />
            )}
          </Fab>
          <Popover
            id={'changeTokenPopover'}
            open={Boolean(anchorEl2)}
            anchorEl={anchorEl2}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Box sx={{ padding: 2, height: 250 }}>
              {tokenList.sort().map((item) => (
                <Box onClick={() => handleChangeToken2(item)} sx={{ display: 'flex', width: 150, flexDirection: 'row', alignItems: 'center', cursor: 'pointer', padding: 1, justifyContent: 'space-between' }}>
                  <Typography color={'third.main'}>{item.name}</Typography>
                  {item.ticker == "ETH" ? (
                    <Logo width={'40'} />
                  ) : (
                    <Box component="img" sx={{ width: '40px', borderRadius: 5 }} alt="selected token" src={item.img} />
                  )}
                </Box>
              ))}
            </Box>
          </Popover>
        </Box>
        <Button onClick={fetchDexSwap} disabled={!value || !isConnected} sx={{ width: '90%', height: '50px', marginTop: '30px' }} color='third' variant='contained'>Swap</Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', minWidth: window.screen.width < 400 ? window.screen.width * 0.9 : 400, }}>
        <Box sx={{
          width: '95%', height: 'fit-content', paddingBottom: 2, background: '#38383888', borderRadius: 5, boxShadow: 10,
          "box-shadow": `0px 0px 10px 0px #fafafa`,
          "-webkit-box-shadow": `0px 0px 10px 0px #fafafa`,
          "-moz-box-shadow": `0px 0px 10px 0px #fafafa`,
        }}>
          <Typography textAlign={'left'} ml={'5%'} width={'90%'} mb={5} mt={2} fontSize={28} color={'primary.ligth'}>Swapping ERC-20 tokens</Typography>
          <Typography textAlign={'left'} ml={'5%'} width={'90%'} color={'primary.medium'}>First you have to authorize our contract to spent your ERC-20 tokens that you want to give, as for defult, no one is authorized to trade tokens on your behalf. Next we will transfer your desired tokens from a pool of tokens using the Alchemy aggregator. This will asure the minimum gas fee and stragith convertio rate. We dont take any profit from the swap.</Typography>
        </Box>
        <Box ref={ref2} sx={{
          marginTop: 2, width: '95%', height: 'fit-content', paddingBottom: 2, background: '#38383888', borderRadius: 5, boxShadow: 10,
          "box-shadow": `0px 0px 10px 0px #36E5C7`,
          "-webkit-box-shadow": `0px 0px 10px 0px #36E5C7`,
          "-moz-box-shadow": `0px 0px 10px 0px #36E5C7`,
        }}>
          <Box className={'modalGlass'} sx={{ zIndex: 100, borderRadius: 5, position: 'absolute', display: 'flex', width: dimensions2[0], height: dimensions2[1], justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Typography color={'third.light'} fontWeight={600} marginBottom={2}>Tokenomics tab coming soon...</Typography>
          </Box>
          <Typography textAlign={'left'} ml={'5%'} width={'90%'} mb={5} mt={2} fontSize={28} color={'third.ligth'}>Tokenomics</Typography>
          <Typography textAlign={'left'} ml={'5%'} width={'90%'} color={'primary.medium'}>Check the TOKENOMICS tab to see more about each token project out there.</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', maxWidth: window.screen.width < 400 ? 260 : 120, flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 2, alignItems: 'center' }}>
              {tokenList.sort().slice(0, 4).map((item, index) => (
                <Box onClick={() => setSelected(index)} sx={{ cursor: 'pointer', display: 'flex', width: 120, paddingTop: 0.5, paddingBottom: 0.5, borderRadius: 5, background: selected == index ? '#36E5C7' : '#00000000', border: 0.7, borderColor: '#36E5C7', alignItems: 'center', justifyContent: 'center', marginBottom: 1 }}>
                  <Typography>{item.name}</Typography>
                </Box>
              ))}
            </Box>
            <SimpleAreaChart dimensions={dimensions2} historical={historical[selected]} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Swap