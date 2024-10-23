import { GearApi, GearKeyring } from "@gear-js/api";
import { HexString } from "@gear-js/api/types";
import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring } from "@polkadot/api";
import { Sails } from "sails-js";
import { SailsIdlParser } from "sails-js-parser";

// Function that create a GearApi instance with the given network
export const createGearApi = (network: string): Promise<GearApi> => {
    return new Promise(async (resolve, reject) => {
        try {
            const api = await GearApi.create({
                providerAddress: network
            });

            resolve(api);
        } catch(e) {
            reject(e);
        }    
    });
}

// Function that returns the signer from wallet name and mneminic
export const gearKeyringByWalletData = (walletName: string, walletMenemonic: string): Promise<KeyringPair> => {
    return new Promise(async (resolve, reject) => {
        try {
            const signer = await GearKeyring.fromMnemonic(walletMenemonic, walletName);
            resolve(signer);
        } catch(e) {
            reject(e);
        }
    });
}

// Function that returns the signer from wallet name and mnemonic
export const keyringByWalletData = (walletName: string, walletMenemonic: string): Promise<KeyringPair> => {
    return new Promise(async (resolve, reject) => {
        try {
            const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });
            const signer = keyring.addFromMnemonic(walletMenemonic);
            resolve(signer);
        } catch(e) {
            reject(e);
        }
    });
}

// Function that reuturns a Sails intance from given GearApi, network, contractId and idl
export const sailsInstance = (api: GearApi, network: string, contractId: HexString, idl: string): Promise<Sails> => {
    return new Promise(async (resolve, reject) => {
        const parser = await SailsIdlParser.new();
        const sails = new Sails(parser);

        try {
            sails.setApi(api);
            sails.setProgramId(contractId);
            sails.parseIdl(idl);

            resolve(sails);
        } catch (e) {
            reject(e);
        }
    });
}