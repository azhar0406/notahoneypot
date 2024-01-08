import { useState } from 'react';
import { ethers } from 'ethers';
import '../styles/style.css';
import '../styles/globals.css';


const CheckPage = () => {
    const [tokenAddress, setTokenAddress] = useState('');
    const [result, setResult] = useState('');

    const checkHoneypot = async () => {
        try {
            // Set up the provider (using Alchemy)
            const provider = new ethers.providers.JsonRpcProvider('https://eth-mainnet.alchemyapi.io/v2/your_alchemy_api_key');

            // Your contract ABI and address
            const contractABI = []; // Replace with your contract's ABI
            const contractAddress = 'your_contract_address';

            // Create a contract instance
            const contract = new ethers.Contract(contractAddress, contractABI, provider);

            // Call the checkToken function
            const isHoneypot = await contract.checkToken(tokenAddress);
            setResult(`The token is ${isHoneypot ? 'not a honeypot' : 'a honeypot'}.`);
        } catch (error) {
            console.error(error);
            setResult('An error occurred while checking the token.');
        }
    };

    return (
      <div className="flex flex-col h-screen justify-between">
            <header className="p-4 shadow-md">
                <img src="next.svg" alt="Logo" className="h-12 w-auto" />
            </header>
            <main className="flex flex-1 items-center justify-center">
            <div className="text-center">
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

export default CheckPage;
