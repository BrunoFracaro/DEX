import React from 'react'
import { Box, Button, Typography, Link } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { ReactComponent as Logo } from "../cryptoswap.svg";

function Header(props) {

  const { address, isConnected, connect } = props;

  const location = useLocation();

  return (
    <>
      {window.innerWidth > 500 ? (
        <Box sx={{
          display: 'flex', background: '#38383888', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: '10%', flex: 1, height: '70px',
          "box-shadow": `0px 0px 10px 0px #383838`,
          "-webkit-box-shadow": `0px 0px 10px 0px #383838`,
          "-moz-box-shadow": `0px 0px 10px 0px #383838`,
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
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
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <Logo />
          </Box>
          <Button sx={{
            "box-shadow": `0px 0px 10px 0px #36E5C7`,
            "-webkit-box-shadow": `0px 0px 10px 0px #36E5C7`,
            "-moz-box-shadow": `0px 0px 10px 0px #36E5C7`,
          }} onClick={connect} variant='contained' color={'third'}>{isConnected ? (address.slice(0, 4) + "..." + address.slice(38)) : "Connect Wallet"}</Button>
        </Box>
      ) : (
        <Box sx={{
          display: 'flex', background: '#38383888', flexDirection: 'column', alignItems: 'center', flex: 1,
          "box-shadow": `0px 0px 10px 0px #383838`,
          "-webkit-box-shadow": `0px 0px 10px 0px #383838`,
          "-moz-box-shadow": `0px 0px 10px 0px #383838`,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70px' }}>
            <Logo />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Link href="/" underline="none">
              <Box className={'color-transition'} sx={{ display: 'flex', width: '96%', background: location.pathname == '/' ? '#0CD0AC' : '#38383888', height: '70px', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 2 }}>
                <Typography sx={{ fontSize: 20 }}>SWAP</Typography>
              </Box>
            </Link>
            <Link href="/tokens" underline="none">
              <Box className={'color-transition2'} sx={{ display: 'flex', width: '96%', background: location.pathname == '/tokens' ? '#36E5C7' : '#38383888', height: '70px', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 2 }}>
                <Typography sx={{ fontSize: 20 }}>TOKENOMICS</Typography>
              </Box>
            </Link>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70px' }}>
            <Button sx={{
              "box-shadow": `0px 0px 10px 0px #36E5C7`,
              "-webkit-box-shadow": `0px 0px 10px 0px #36E5C7`,
              "-moz-box-shadow": `0px 0px 10px 0px #36E5C7`,
            }} onClick={connect} variant='contained' color={'third'}>{isConnected ? (address.slice(0, 4) + "..." + address.slice(38)) : "Connect Wallet"}</Button>
          </Box>
        </Box>
      )}
    </>
  )
}

export default Header