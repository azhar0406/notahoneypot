import { useState } from 'react';
import { ethers } from 'ethers';
const contractInfo = require("../app/abi.json");
require('dotenv').config();
import '../styles/style.css';
import '../styles/globals.css';


// const index = () => {
//     const [tokenAddress, setTokenAddress] = useState('');
//     const [result, setResult] = useState('');

//     const checkHoneypot = async () => {
//         try {
//             // Set up the provider (using Alchemy)
//             const provider = new ethers.providers.JsonRpcProvider("https://1rpc.io/bnb");
    
//             // Your contract ABI and address
//             const contractABI = contractInfo; // Replace with your contract's ABI
//             const contractAddress = '0x77Dd873ad58418c40974016EbB792D2c20A1ABCA';
    
//             // Create a contract instance
//             const contract = new ethers.Contract(contractAddress, contractABI, provider);
    
//             // Call the checkToken function
//             const isHoneypot = await contract.callStatic.isHoneyPot("0x10ED43C718714eb63d5aA57B78B54704E256024E","0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c","0xD53A69f2E1D39D7f12C81958979597B84A6029C3");
//             setResult(`The token is ${isHoneypot ? 'not a honeypot' : 'a honeypot'}.`);
//         } catch (error) {
//             console.error(error);
//             setResult('An error occurred while checking the token.');
//         }
//     };

    const index = () => {
        const [tokenAddress, setTokenAddress] = useState('');
        const [result, setResult] = useState('');
    
        const checkHoneypot = async () => {
            try {
                // Set up the provider (using Alchemy)
                const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");
        
                // Your contract ABI and address
                const contractABI = contractInfo; // Replace with your contract's ABI
                const contractAddress = '0x33DA6E9D5A05382e1fB318a242c9d57BFbF9AD5C';
        
                // Create a contract instance
                const contract = new ethers.Contract(contractAddress, contractABI, provider);
        
                // Call the checkToken function
                //usdt 0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684;
                //honeypot 0x3Ac01deb134d4d7501394F2C9bFaDa3c5632B155
                const isHoneypot = await contract.callStatic.isHoneyPot("0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd","0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3","0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",tokenAddress);
                // console.log(isHoneypot);
                setResult(`The token is ${isHoneypot[0] ? 'a honeypot' : 'not a honeypot'}.`);
            } catch (error) {
                console.error(error);
                setResult('An error occurred while checking the token.');
            }
        };

    return (
      <div className="flex flex-col h-screen justify-between">
            <header className="p-4 shadow-md">
                <img src="logo.png" alt="Logo" className="h-12 w-auto" />
            </header>
            <main className="flex flex-1 items-center justify-center">
            <div className="text-center">
            <img src="banner.png" alt="Logo" style={{ height: '13.25rem', marginBottom: '2rem' }}/>
                    <input 
                        type="text" 
                        value={tokenAddress} 
                        onChange={e => setTokenAddress(e.target.value)} 
                        placeholder="Enter ERC20 Token Address"
                        className="p-2 border border-gray-300 rounded-md"
                    />
                    <button 
                        onClick={checkHoneypot}
                        className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Check
                    </button>
                    {result && <p className="mt-4">{result}</p>}
                </div>
            </main>
            <footer className="p-4 bg-gray-200">
                <div className="flex justify-between items-center">
                    <span>Copyright 2023 notahoneypot.in All rights reserved.</span>
                    <div>
                        <a href="https://twitter.com/your_handle" className="mr-4">Twitter</a>
                        <a href="https://github.com/your_username">GitHub</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default index;
