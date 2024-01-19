import React from 'react'
import { Box, Typography, TextField, Fab, Popover, Button } from '@mui/material'
import SwapVertIcon from '@mui/icons-material/SwapVert';
import axios from 'axios'
import { useSendTransaction, useWaitForTransaction } from "wagmi";

const tokenList = require('../tokenList.json')

function Swap(props) {
  const { address, isConnected } = props;

  const [value, setValue] = React.useState('')
  const [exch1, setExch1] = React.useState(0)
  const [exch2, setExch2] = React.useState(0)
  const [tokenOneType, setTokenOneType] = React.useState(tokenList[0])
  const [tokenTwoType, setTokenTwoType] = React.useState(tokenList[1])

  const [txDetails, setTxDetails] = React.useState({
    to: null,
    data: null,
    value: null,
  });

  const { data, sendTransaction } = useSendTransaction({
    request: {
      from: address,
      to: String(txDetails.to),
      data: String(txDetails.data),
      value: String(txDetails.value),
    }
  })

  React.useEffect(() => {

    if (txDetails.to && isConnected) {
      sendTransaction();
    }
  }, [txDetails])

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  async function fetchDexSwap() {

    const allowance = await axios.get(`https://api.1inch.io/v5.0/1/approve/allowance?tokenAddress=${tokenOneType.address}&walletAddress=${address}`)

    if (allowance.data.allowance === "0") {

      const approve = await axios.get(`https://api.1inch.io/v5.0/1/approve/transaction?tokenAddress=${tokenOneType.address}`)

      setTxDetails(approve.data);
      console.log("not approved")
      return

    }

    const tx = await axios.get(
      `https://api.1inch.io/v5.0/1/swap?fromTokenAddress=${tokenOneType.address}&toTokenAddress=${tokenTwoType.address}&amount=${value.padEnd(tokenOneType.decimals + value.length, '0')}&fromAddress=${address}&slippage=${2.5}`
    )

    setTxDetails(tx.data.tx);

  }


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
      fetchPrices(tokenTwoType.address, tokenOneType.address)
    } else {
      setTokenOneType(item)
      fetchPrices(item.address, tokenTwoType.address)
    }
    handlePopoverClose()
  }

  const handleChangeToken2 = (item) => {
    if (item.name == tokenOneType.name) {
      setTokenTwoType(tokenOneType)
      setTokenOneType(tokenTwoType)
      fetchPrices(tokenTwoType.address, tokenOneType.address)
    } else {
      setTokenTwoType(item)
      fetchPrices(tokenOneType.address, item.address)
    }
    setTokenTwoType(item)
    handlePopoverClose()
  }

  const invert = () => {
    setTokenTwoType(tokenOneType)
    setTokenOneType(tokenTwoType)
    fetchPrices(tokenTwoType.address, tokenOneType.address)
  }

  React.useEffect(() => {
    fetchPrices(tokenList[0].address, tokenList[1].address)
  }, [])

  const fetchPrices = async (one, two) => {
    const res = await axios.get('http://localhost:3001/tokenPrice', {
      params: { addressOne: one, addressTwo: two }
    })

    setExch1(res.data.tokenOne)
    setExch2(res.data.tokenTwo)
  }

  return (
    <Box sx={{ display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
      <Box sx={{
        width: '20%', marginTop: '200px', height: '500px', minWidth: 350, paddingBottom: 5, background: '#38383888', borderRadius: 10, boxShadow: 10,
        "box-shadow": `0px 0px 10px 0px #fafafa`,
        "-webkit-box-shadow": `0px 0px 10px 0px #fafafa`,
        "-moz-box-shadow": `0px 0px 10px 0px #fafafa`,
      }}>

      </Box>
      <Box sx={{
        width: '40%', minWidth: 450, height: '400px', paddingBottom: 5, background: '#38383888', borderRadius: 10, boxShadow: 10,
        "box-shadow": `0px 0px 10px 0px #9FCC2E`,
        "-webkit-box-shadow": `0px 0px 10px 0px #9FCC2E`,
        "-moz-box-shadow": `0px 0px 10px 0px #9FCC2E`,
      }}>
        <Typography mb={5} fontWeight={'700'} fontSize={32} color={'third.main'}>CryptoSwap</Typography>
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <TextField placeholder='0' InputProps={{ sx: { borderRadius: 5, color: '#f00' } }} inputProps={{ style: { color: '#fff' } }} sx={{ color: '#fff', background: '#000', width: '60%', borderRadius: 5 }} focused color='primary' id="outlined-basic" label="" variant="outlined" value={value} onChange={(e) => setValue(e.target.value)} />
          <Typography sx={{ width: 80 }}>{tokenOneType.ticker}</Typography>
          <Fab onClick={handlePopoverOpen} id={'myToken'} color="primary" aria-label="add">
            <Box component="img" sx={{ width: '70%', borderRadius: 5 }} alt="Lottery 1" src={tokenOneType.img} />
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
                  <Typography color='#9FCC2E'>{item.name}</Typography>
                  <Box component="img" sx={{ width: 50, borderRadius: 5 }} alt="Lottery 1" src={item.img} />
                </Box>
              ))}
            </Box>
          </Popover>
        </Box>
        <Box sx={{ marginTop: '10px', marginBottom: '20px', display: 'flex', width: '90%', flexDirection: 'row', justifyContent: 'space-between', marginLeft: '5%' }}>
          <Typography sx={{ color: '#9FCC2E' }}>US$ {Math.round(value * exch1 * 100) / 100}</Typography>
          <SwapVertIcon onClick={() => invert()} sx={{ cursor: 'pointer', marginTop: '10px' }} color={'third'} fontSize='large' />
        </Box>
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <TextField InputProps={{ sx: { borderRadius: 5 } }} inputProps={{ style: { color: '#fff' } }} sx={{ color: '#fff', background: '#000', width: '60%', borderRadius: 5 }} focused color='primary' id="outlined-basic" label="" variant="outlined" value={Math.round(value * exch1 / exch2 * 10000) / 10000} />
          <Typography sx={{ width: 80 }}>{tokenTwoType.ticker}</Typography>
          <Fab onClick={handlePopoverOpen2} id={'changeToken'} color="primary" aria-label="add">
            <Box component="img" sx={{ width: '70%', borderRadius: 5 }} alt="Lottery 1" src={tokenTwoType.img} />
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
                  <Typography color='#9FCC2E'>{item.name}</Typography>
                  <Box component="img" sx={{ width: 50, borderRadius: 5 }} alt="Lottery 1" src={item.img} />
                </Box>
              ))}
            </Box>
          </Popover>
        </Box>
        <Button onClick={fetchDexSwap} disabled={!value || !isConnected} sx={{ width: '90%', height: '50px', marginTop: '30px' }} color='third' variant='contained'>Swap</Button>
      </Box>
      <Box sx={{
        width: '20%', marginTop: '200px', height: '500px', minWidth: 350, paddingBottom: 5, background: '#38383888', borderRadius: 10, boxShadow: 10,
        "box-shadow": `0px 0px 10px 0px #fafafa`,
        "-webkit-box-shadow": `0px 0px 10px 0px #fafafa`,
        "-moz-box-shadow": `0px 0px 10px 0px #fafafa`,
      }}>

      </Box>
    </Box>
  )
}

export default Swap