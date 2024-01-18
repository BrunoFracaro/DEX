import "./App.css";
import Header from './components/Header'
import Swap from './components/Swap'
import Tokens from './components/Tokens'
import { ThemeProvider } from '@mui/material/styles';
import defaultTheme from "./theme";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={defaultTheme}>
        <Header />
        <div className="mainWindow">
          <Routes>
            <Route path="/" element={<Swap />} />
            <Route path="/tokens" element={<Tokens />} />
          </Routes>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
