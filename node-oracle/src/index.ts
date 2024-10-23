import { 
    createGearApi, 
    sailsInstance, 
    gearKeyringByWalletData 
} from "./utils.js";
import { 
    CONTRACT_ID, 
    IDL, 
    NETWORK, 
    WALLET_MNEMONIC, 
    WALLET_NAME 
} from "./consts.js";
import { RandomNumberRange } from "./types.js";
import { commands } from "./contract-methods/index.js";
import express from "express";
import axios from "axios";

// Create express instance
const app = express();

const startServer = async () => {
    try {
        // Set the api
        const api = await createGearApi(NETWORK);
        // Set the sails instance
        const sails = await sailsInstance(
            api,
            NETWORK,
            CONTRACT_ID,
            IDL
        );
        // Set the signer 
        const signer = await gearKeyringByWalletData(
            WALLET_NAME,
            WALLET_MNEMONIC
        );

        // Set the subscription to the event RequestRangeOfRandomNumbers
        // to handle events in the specified contract
        const unsubscribeRequestNumberInRange = sails
            .services // function to get services
            .OracleService // Service selected (OracleService)
            .events // Function to get the events from the service
            .RequestRangeOfRandomNumbers // Select the service event
            .subscribe(async (data) => { // Subscribe to the event to detect events in the contract
                console.log('Event detected: RequestRangeOfRandomNumbers');
                console.log('Data from contract event:');
                console.log(data);

                const range = data as RandomNumberRange;

                // Send the off-chain data to the contract
                const apiResponse = await axios.get(`http://www.randomnumberapi.com/api/v1.0/random?min=${range.min}&max=${range.max}`);
                const new_random_number = apiResponse.data[0];

                const response = await commands.commandSetRandomNumber(
                    sails,
                    signer,
                    new_random_number
                );

                // Print contract result
                console.log(`Contract resposne: ${JSON.stringify(response)}`);
            });

        // No data specified because event dont send data
        // Set the subscription to the event RequestRandomNumber
        // to handle events in the specified contract
        const unsubscribeRequestNumber = sails
            .services // function to get services
            .OracleService // Service selected (OracleService)
            .events // Function to get the events from the service
            .RequestRandomNumber // Select the service event
            .subscribe(async () => {  // Subscribe to the event to detect events in the contract 
                console.log('Event detected: RequestRandomNumber');
                // Get the off-chain data
                const apiResponse = await axios.get(`http://www.randomnumberapi.com/api/v1.0/random?min=0&max=500}`);

                const new_random_number = apiResponse.data[0];

                // Send the off-chain data to the contract
                const response = await commands.commandSetRandomNumber(
                    sails,
                    signer,
                    new_random_number
                );

                // Print contract result
                console.log(`Contract resposne: ${JSON.stringify(response)}`);
            });

        // No data specified because event dont send data
        // Set the subscription to the event RequestRandomWord
        // to handle events in the specified contract
        const unsubscribeRequestWord = sails
            .services // function to get services
            .OracleService // Service selected (OracleService)
            .events // Function to get the events from the service
            .RequestRandomWord // Select the service event
            .subscribe(async () => { // Subscribe to the event to detect events in the contract 
                console.log('Event detected: RequestRandomWord');
                // Get the off-chain data
                const apiResponse = await axios.get('https://random-word-api.vercel.app/api?words=1');

                const new_random_word = apiResponse.data[0];

                // Send the off-chain data to the contract
                const response = await commands.commandSetRandomWord(
                    sails,
                    signer,
                    new_random_word
                );

                // Print contract result
                console.log(`Contract response: ${JSON.stringify(response)}`);
            });

        // Middleware and paths
        app.use(express.json()); // Accept JSON

        // Set the root path
        app.get('/', (_, res) => {
            res.send('Node oracle active!');
        });

        // Specify the port
        const port = 3000;

        // Start de server with express and set the server variable, 
        // to handle when the sserver is closed.
        const server = app.listen(port, () => {
            console.log('Server listening in http://localhost:3000');
        });

        // Set the process when the dev close the server
        process.on('SIGINT', async () => {
            console.log('\nClosing server...');

            // Disconnect from vara network
            await unsubscribeRequestNumberInRange
            await unsubscribeRequestNumber;
            await unsubscribeRequestWord;
            
            api.provider.disconnect();
            
            // Close the server
            server.close(() => {
                console.log('Server was closed!');
            });
        });
    } catch(e) {
        console.log('Error while starting the server!');
        throw e;
    }
}

// Starts the node server
startServer().catch(error => {
    console.log('Error in server!');
    throw error;
});