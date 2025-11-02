

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import MyToken from "./MyToken.json"; // Make sure this JSON is in src/

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState("0");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const tokenAddress = "YOUR_DEPLOYED_TOKEN_ADDRESS_HERE"; // Replace this

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask first!");
      return;
    }
    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    await browserProvider.send("eth_requestAccounts", []);
    const signer = await browserProvider.getSigner();
    const account = await signer.getAddress();

    const tokenContract = new ethers.Contract(tokenAddress, MyToken.abi, signer);

    setProvider(browserProvider);
    setSigner(signer);
    setAccount(account);
    setContract(tokenContract);
  };

  // Fetch balance
  const fetchBalance = async () => {
    if (contract && account) {
      const bal = await contract.balanceOf(account);
      setBalance(ethers.formatUnits(bal, 18)); // Assuming 18 decimals
    }
  };

  // Send tokens
  const sendTokens = async () => {
    if (contract && recipient && amount) {
      const tx = await contract.transfer(recipient, ethers.parseUnits(amount, 18));
      await tx.wait();
      alert("Transfer successful!");
      fetchBalance();
    }
  };

  useEffect(() => {
    if (contract && account) {
      fetchBalance();
    }
  }, [contract, account]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>MyToken DApp</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>Connected account: {account}</p>
          <p>Token balance: {balance}</p>

          <h3>Send Tokens</h3>
          <input
            type="text"
            placeholder="Recipient address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <input
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={sendTokens}>Send</button>
        </>
      )}
    </div>
  );
}

export default App;
