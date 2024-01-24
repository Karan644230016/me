import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3 from 'web3';
import ABI from '../contract/abi.json';

function AddActivity() {
  const [activityName, setActivityName] = useState('');
  const [studentID, setStudentID] = useState('');
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const contractAddress = '0xd463F0C5FE7c101DF018ebb71B8E92364a77C43b';

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
          console.log("Address:", getAccount);

          const getBalance = await web3.eth.getBalance(accounts[0]);
          const balanceInEther = web3.utils.fromWei(getBalance, 'ether');
          setBalance(balanceInEther);
          console.log("Balance:", balanceInEther, " ETH");

          const contractInstance = new web3.eth.Contract(ABI, contractAddress);
          setContract(contractInstance);

          setIsConnected(true);
          console.log('Connect Success');
        } else {
          setAccount('');
          setBalance('');
          setIsConnected(false);
          console.log('Disconnected');
        }
      } else {
        console.log('Metamask not found');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (contract) {
        const activityArray = [activityName];
        const studentIDArray = [parseInt(studentID)];

        await contract.methods.addActivity(activityArray, studentIDArray).send({ from: account });

        setActivityName('');
        setStudentID('');
      } else {
        console.error('Contract not connected.');
      }
    } catch (error) {
      console.error('Error adding activity:', error.message);
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
      <div className="navbar p-3 border-b border-white rounded">
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

      {isConnected && (
        <form className="m-3" onSubmit={handleSubmit}>
          <label className="block text-start m-3">Activity</label>
          <input
            type="text"
            placeholder="Activity Name"
            className="input input-bordered input-info w-full max-w-xs"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
          />

          <label className="block text-start m-3">StudentID</label>
          <input
            type="number"
            placeholder="StudentID"
            className="input input-bordered input-info w-full max-w-xs"
            value={studentID}
            onChange={(e) => setStudentID(e.target.value)}
          />

          <button type="submit" className="block btn glass mt-5">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default AddActivity;
