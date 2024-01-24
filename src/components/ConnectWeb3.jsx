import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

function ButtonMetamask() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const connectMetamask = async () => {
    try {
      if (window.ethereum) {
        if (!isConnected) {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
          const web3 = new Web3(window.ethereum);

          const getAccount = accounts[0];
          setAccount(getAccount);
          console.log("Address :",getAccount)

          const getBalance = await web3.eth.getBalance(accounts[0]);
          const balanceInEther = web3.utils.fromWei(getBalance, 'ether');
          setBalance(balanceInEther);
          console.log("Balance :",balanceInEther," ETH")

          setIsConnected(true);
          console.log('Connect Success');
        } else {
          setAccount('');
          setBalance('');
          setIsConnected(false);
          console.log('Disconnected');
        }
      } else {
        console.log('not have metamask');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleNetworkChange = () => {
      connectMetamask();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleNetworkChange);
      window.ethereum.on('chainChanged', handleNetworkChange);

      return () => {
        window.ethereum.off('accountsChanged', handleNetworkChange);
        window.ethereum.off('chainChanged', handleNetworkChange);
      };
    }
  }, []);

  return (
    <div>
      <div className="navbar p-3 border-b border-white rounded ">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl">NPRU</a>
        </div>
        <div className="navbar-end">
          <a className={`btn glass me-5 ${isConnected ? 'disconnect-btn' : ''}`} onClick={connectMetamask}>
            {isConnected ? 'Disconnect' : 'Connect'}
          </a>
          <div className="dropdown dropdown-end me-">
            <div tabIndex={0} role="button" className="btn glass me-5">Account</div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-auto">
              <li><p>Account : {account}</p></li>
              <li><p>Balance : {balance}</p></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ButtonMetamask;
