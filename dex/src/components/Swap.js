import React from 'react'

import { Box, Typography, TextField, Fab, Popover, Button } from '@mui/material'

import SwapVertIcon from '@mui/icons-material/SwapVert';

const tokenList = require('../tokenList.json')

function Swap() {

  const [value, setValue] = React.useState('')
  const [value2, setValue2] = React.useState('')
  const [tokenOneType, setTokenOneType] = React.useState(tokenList[0])
  const [tokenTwoType, setTokenTwoType] = React.useState(tokenList[1])

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
    } else {
      setTokenOneType(item)
    }
    handlePopoverClose()
  }

  const handleChangeToken2 = (item) => {
    if (item.name == tokenOneType.name) {
      setTokenTwoType(tokenOneType)
      setTokenOneType(tokenTwoType)
    } else {
      setTokenTwoType(item)
    }
    setTokenTwoType(item)
    handlePopoverClose()
  }

  const invert = () => {
    setTokenTwoType(tokenOneType)
    setTokenOneType(tokenTwoType)
  }

  return (
    <Box sx={{
      width: 500, height: 500, background: '#38383888', borderRadius: 10, boxShadow: 10,
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
          <Box sx={{ background: '#383838', padding: 2, height: 200 }}>
            {tokenList.map((item) => (
              <Box onClick={() => handleChangeToken1(item)} sx={{ display: 'flex', width: 200, flexDirection: 'row', alignItems: 'center', cursor: 'pointer', padding: 1, justifyContent: 'space-between' }}>
                <Typography color='#9FCC2E'>{item.name}</Typography>
                <Box component="img" sx={{ width: 50, borderRadius: 5 }} alt="Lottery 1" src={item.img} />
              </Box>
            ))}
          </Box>
        </Popover>
      </Box>
      <Box sx={{ marginTop: '10px', marginBottom: '20px', display: 'flex', width: '90%', flexDirection: 'row', justifyContent: 'space-between', marginLeft: '5%' }}>
        <Typography sx={{color: '#9FCC2E' }}>US$ {value * 15000}</Typography>
        <SwapVertIcon onClick={() => invert()} sx={{ cursor: 'pointer', marginTop: '10px' }} color={'third'} fontSize='large' />
      </Box>
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-evenly', alignItems: 'center' }}>
        <TextField InputProps={{ sx: { borderRadius: 5 } }} inputProps={{ style: { color: '#fff' } }} sx={{ color: '#fff', background: '#000', width: '60%', borderRadius: 5 }} focused color='primary' id="outlined-basic" label="" variant="outlined" value={value2} />
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
          <Box sx={{ background: '#383838', padding: 2, height: 200 }}>
            {tokenList.sort().map((item) => (
              <Box onClick={() => handleChangeToken2(item)} sx={{ display: 'flex', width: 200, flexDirection: 'row', alignItems: 'center', cursor: 'pointer', padding: 1, justifyContent: 'space-between' }}>
                <Typography color='#9FCC2E'>{item.name}</Typography>
                <Box component="img" sx={{ width: 50, borderRadius: 5 }} alt="Lottery 1" src={item.img} />
              </Box>
            ))}
          </Box>
        </Popover>
      </Box>
      <Button sx={{width: '90%', height: '50px', marginTop: '30px'}} color='third' variant='contained'>Swap</Button>
    </Box>
  )
}

export default Swap