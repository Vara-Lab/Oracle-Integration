import { Sails } from "sails-js";

export const queryActualRandomNumber = (sails: Sails, userAddress: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await sails
                .services // function to get services
                .OracleService // Service selected (OracleService)
                .queries // Get the queries from the service (queries - no changes state)
                .ActualRandomNumber(userAddress); // Query selected from the service

            // Return the response
            resolve(response);
        } catch(e) {
            reject(e);
        }
    });
}

export const queryActualRandomWord = (sails: Sails, userAddress: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await sails
                .services // function to get services
                .OracleService // Service selected (OracleService)
                .queries // Get the queries from the service (queries - no changes state)
                .ActualRandomWord(userAddress); // Query selected from the service

            // Return the response
            resolve(response);
        } catch(e) {
            reject(e);
        }
    });
}