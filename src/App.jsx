import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';

//abi smart contract file
import abi from "./utils/WavePortal.json";


const App = () => {


  //this is the wave portal address
  const contractAddress = "0xc37eC9798729371C7DDFF867fCC6672AEf8E1bA1";

  const contractABI = abi.abi;
  
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      //imediately creates the post
      // getAllWaves(); //does not work 

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
        
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });


      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)


        getAllWaves();
        
        
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }


  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);


      //struct waves here   -ONLY WORKING FOLDER.
      getAllWaves();
      
    } catch (error) {
      console.log(error)
    }
  }



  //wave --------------------------------------------------

  /*
  * All state property to store all waves
  */
  const [allWaves, setAllWaves] = useState([]);

  /*
  * Create a method that gets all waves from your contract
  */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
  


  //function
  /*wave function - retrieves total number of waves*/
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        /* using abi smart contract here */
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());


        /*grab data*/
        let TheMessage = document.querySelector('#TheMessage').value ; 
        console.log("------The message made is:", TheMessage);     



        
        /*
        * Execute the actual wave from your smart contract


        */
        const waveTxn = await wavePortalContract.wave(TheMessage);
        console.log("Mining... (New Transaction)", waveTxn.hash);

        //clear queary selector
        document.querySelector('#TheMessage').value = "";

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);




        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total array count...", count.toNumber());


        //you can use getElementBy Id to change messages! 
        // document.getElementById("greeting").innerHTML = count;

        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }



 


  //This smart function was created by Gabe
  const checkTotalWaves = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        /* using abi smart contract here */
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        //you can use getElementBy Id to change messages! 

        // let text1 = "";
        // let text2 = account; 
        // let result = text1.concat(text2, "/owned");

        document.getElementById("totalcl9-1").innerHTML = "Number of waves pushed to chain:";

        document.getElementById("totalcl9").innerHTML = count;

        /*function here*/
        getAllWaves();
        

        
      } else {
        console.log("Ethereum object doesn't exist!");

      }
    } catch (error) {
      console.log(error);
    }
  }

  

  
  
    

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

   
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">


  
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          Hello my name is Gabe and I am trying to create a wave portal :)) Pretty cool right!?
        </div>


         <div className="box-container">
          <div className="center-things">

                <input id="TheMessage" type="text" name="typedMSG" />
            
          </div>
        </div>


        


    
    
          


        
          <button className="waveButton" onClick={wave}>
            Wave - pushes 1 transaction (No counter)
          </button>
  
           {/*
          * If there is no currentAccount render this button
          */}
          {!currentAccount && (

              <button className="waveButton" onClick={connectWallet}>
                Connect Wallet
              </button>
           
          )}


           {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}



        
        


        
        
        <div className="box-container">
          <div className="center-things">
        
          <button className="Button-1" onClick={checkTotalWaves}>
            Check how many transactions pushed
          </button>

          </div>
        </div>

        <div className="center-things1">        
          <p id="totalcl9-1"></p>
        </div>
        
        <div className="center-things">        
          <p id="totalcl9"></p>
        </div>
        
      </div>

      
    </div>
    );
  }
export default App
