import React from 'react'
import { Box, Button, Typography, Link } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { ReactComponent as Logo } from "../cryptoswap.svg";

function Header(props) {

  const { address, isConnected, connect } = props;

  const location = useLocation();

  return (
    <Box sx={{
      display: 'flex', background: '#38383888', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: '10%',
      "box-shadow": `0px 0px 10px 0px #383838`,
      "-webkit-box-shadow": `0px 0px 10px 0px #383838`,
      "-moz-box-shadow": `0px 0px 10px 0px #383838`,
    }}>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Link href="/" underline="none">
          <Box className={'color-transition'} sx={{ display: 'flex', width: 200, background: location.pathname == '/' ? '#0CD0AC' : '#38383888', height: '70px', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 2 }}>
            <Typography sx={{ fontSize: 20 }}>SWAP</Typography>
          </Box>
        </Link>
        <Link href="/tokens" underline="none">
          <Box className={'color-transition2'} sx={{ display: 'flex', width: 200, background: location.pathname == '/tokens' ? '#36E5C7' : '#38383888', height: '70px', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 2 }}>
            <Typography sx={{ fontSize: 20 }}>TOKENOMICS</Typography>
          </Box>
        </Link>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center'}}>
        <Logo />
      </Box>
      <Button onClick={connect} variant='contained' color={'third'}>{isConnected ? (address.slice(0, 4) + "..." + address.slice(38)) : "Connect"}</Button>
    </Box>
  )
}

export default Header