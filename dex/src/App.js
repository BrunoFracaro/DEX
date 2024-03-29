import "./App.css";
import Header from './components/Header'
import Swap from './components/Swap'
import Tokens from './components/Tokens'
import { ThemeProvider } from '@mui/material/styles';
import defaultTheme from "../src/assets/theme";
import { Routes, Route } from "react-router-dom";
import { useConnect, useAccount } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

function App() {

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });

  return (
    <div className="App">
      <ThemeProvider theme={defaultTheme}>
        <Header connect={connect} isConnected={isConnected} address={address} />
        <div className="pageBack">
          <Routes>
            <Route path="/" element={<Swap connect={connect} isConnected={isConnected} address={address} />} />
            <Route path="/tokens" element={<Tokens />} />
          </Routes>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
