import React from 'react'
import { Box, SvgIcon, Button } from '@mui/material'
import { ReactComponent as Logo } from "../moralis-logo.svg";
import { Link } from 'react-router-dom';

function Header(props) {

  const {address, isConnected, connect} = props;


  return (
    <Box sx={{ display: 'flex', background: '#38383888', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 2, paddingBottom: 2, paddingLeft: '10%', paddingRight: '10%',
    "box-shadow": `0px 0px 10px 0px #383838`,
    "-webkit-box-shadow": `0px 0px 10px 0px #383838`,
    "-moz-box-shadow": `0px 0px 10px 0px #383838`,
    }}>
      <SvgIcon fontSize='large'>
        <Logo />
      </SvgIcon>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Box sx={{ marginRight: 2 }}>
          <Link to="/">
            <Button variant='outlined' color={'third'}>Swap</Button>
          </Link>
        </Box>
        <Box sx={{ marginLeft: 2 }}>
          <Link to="/tokens">
            <Button variant='outlined' color={'third'}>Tokens</Button>
          </Link>
        </Box>
      </Box>
      <Button onClick={connect} variant='contained' color={'third'}>{isConnected ? (address.slice(0,4) +"..." +address.slice(38)) : "Connect"}</Button>
    </Box>
  )
}

export default Header