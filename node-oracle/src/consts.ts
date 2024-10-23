import { HexString } from '@gear-js/api/types';

// Const to use in the program
export const NETWORK: string = 'wss://testnet.vara.network'
export const WALLET_NAME: string = 'admindavid';
export const WALLET_MNEMONIC: string = 'strong orchard plastic arena pyramid lobster lonely rich stomach label clog rubber';
export const CONTRACT_ID: HexString = '0x5851462185ff708993b9807ae66a750fd0c344f73c9429262a88d534c9fa1f6c';
export const IDL: string = `
  type OracleServiceResponse = enum {
    NoGivenState,
    WIllChangeRandomNumber,
    WIllChangeRandomWord,
    RandomNumberSet,
    RandomWordSet,
    RandomNumber: u64,
    RandomWord: str,
    NewProviderSet,
    Errors: OracleErrors,
  };

  type OracleErrors = enum {
    NoProviderInContract,
    ActionOnlyForOwner,
    ActionOnlyForProviderOrOwner,
    BadRange: struct { min: u64, max: u64 },
  };

  constructor {
    New : ();
  };

  service OracleService {
    ChangeProvider : (new_provider: actor_id) -> OracleServiceResponse;
    ChangeRandomNumber : () -> OracleServiceResponse;
    ChangeRandomNumberInRange : (min: u64, max: u64) -> OracleServiceResponse;
    ChangeRandomWord : () -> OracleServiceResponse;
    Hello : () -> str;
    SetNewRandomNumber : (new_random_number: u64) -> OracleServiceResponse;
    SetNewRandomWord : (new_random_word: str) -> OracleServiceResponse;
    query ActualRandomNumber : () -> OracleServiceResponse;
    query ActualRandomWord : () -> OracleServiceResponse;

    events {
      RequestRandomNumber;
      RequestRandomWord;
      RequestRangeOfRandomNumbers: struct { min: u64, max: u64 };
    }
  };
`;