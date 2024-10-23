import { Sails } from "sails-js";
import { KeyringPair } from '@polkadot/keyring/types';
import { RandomNumberRange } from "src/types.js";

export const commandSetRandomNumber = (sails: Sails, signer: KeyringPair, new_random_number: number): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        const transaction = await sails
            .services // function to get services
            .OracleService // Service selected (OracleService)
            .functions // Get the functions from the service (commands - change state)
            .SetNewRandomNumber(new_random_number) // Command selected from service, if there are arguments, they are put here
            .withAccount(signer) // Set the account that will sign the message
            .calculateGas(); // Calculate gas fees for extrinsic

        // Sign the message, and get the blockhash and the "async" response
        const { blockHash, response } = await transaction.signAndSend();
    
        // Print the block hash
        console.log(`Block hash: ${blockHash}`);

        try {
            // Waiting for response from contract
            const contractResponse = await response();

            // return response 
            resolve(contractResponse);
        } catch (e) {
            reject(e);
        }
    });
}

export const commandSetRandomWord = (sails: Sails, signer: KeyringPair, new_random_word: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        const transaction = await sails
            .services // function to get services
            .OracleService // Service selected (OracleService)
            .functions // Get the functions from the service (commands - change state)
            .SetNewRandomWord(new_random_word) // Command selected from service, if there are arguments, they are put here
            .withAccount(signer) // Set the account that will sign the message
            .calculateGas(); // Calculate gas fees for extrinsic

        // Sign the message, and get the blockhash and the "async" response
        const { blockHash, response } = await transaction.signAndSend();
    
        // Print the block hash
        console.log(`Block hash: ${blockHash}`);

        try {
            // Waiting for response from contract
            const contractResponse = await response();

            // return response 
            resolve(contractResponse);
        } catch (e) {
            reject(e);
        }
    });
}
