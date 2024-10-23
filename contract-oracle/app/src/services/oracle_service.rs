use sails_rs::{
    prelude::*,
    gstd::msg,
    cell::RefMut
};

use crate::states::oracle_state::OracleState;

// Service struct for 'OracleService', it will receive the state as RefMut
pub struct OracleService<'a> {
    oracle_state: RefMut<'a, OracleState>
}

// Oracle service, with specified events
#[service(events = OracleEvent)]
impl<'a> OracleService<'a> {
    pub fn new(
        oracle_state: RefMut<'a, OracleState>
    ) -> Self {
        Self {
            oracle_state
        }
    }

    // Method (command) that will change the provider address
    // ONly the owner can call this command
    pub fn change_provider(&mut self, new_provider: ActorId) -> OracleServiceResponse {
        let caller = msg::source();

        if self.oracle_state.owner != caller {
            return OracleServiceResponse::Errors(
                OracleErrors::ActionOnlyForOwner
            );
        }

        self.oracle_state.provider = Some(new_provider);

        OracleServiceResponse::NewProviderSet
    }

    // Change the value of the random number in default range (0-500)
    pub fn change_random_number(&mut self) -> OracleServiceResponse {
        // Check if the provider is set
        if self.oracle_state.provider.is_none() {
            return OracleServiceResponse::Errors(
                OracleErrors::NoProviderInContract
            );
        }

        // Specify the event trigger
        let event = OracleEvent::RequestRandomNumber;

        // Notifies the provider of the event
        self.notify_on(event).unwrap();

        OracleServiceResponse::WIllChangeRandomNumber
    }

    // Change the value of the random number in the specified range
    pub fn change_random_number_in_range(&mut self, min: u64, max: u64) -> OracleServiceResponse {
        // Check if the range is correct
        if min > max {
            return OracleServiceResponse::Errors(
                OracleErrors::BadRange { min, max }
            );
        }

        // Check if the provider is set
        if self.oracle_state.provider.is_none() {
            return OracleServiceResponse::Errors(
                OracleErrors::NoProviderInContract
            );
        }

        // Specify the event trigger
        let event = OracleEvent::RequestRangeOfRandomNumbers { 
            min, 
            max
        };

        // Notifies the provider of the event
        self.notify_on(event).unwrap();

        OracleServiceResponse::WIllChangeRandomNumber
    }

    // Change the random word value for a new random word
    pub fn change_random_word(&mut self) -> OracleServiceResponse {
        // Check if the provider is set
        if self.oracle_state.provider.is_none() {
            return OracleServiceResponse::Errors(
                OracleErrors::NoProviderInContract
            );
        }

        // Specify the event trigger
        let event = OracleEvent::RequestRandomWord;

        // Notifies the provider of the event
        self.notify_on(event).unwrap();

        OracleServiceResponse::WIllChangeRandomWord
    }

    // Command to be called by the provider, it will set the new randon number
    pub fn set_new_random_number(&mut self, new_random_number: u64) -> OracleServiceResponse {
        // Get the current caller address
        let caller = msg::source();
        // owner address
        let owner = self.oracle_state.owner;
        // provider address
        let provider = self.oracle_state.provider;

        // Check if the provider exists and if the caller is the owner or the provider
        if owner != caller && (provider.is_none() || provider.unwrap() != caller) {
            return OracleServiceResponse::Errors(
                OracleErrors::ActionOnlyForProviderOrOwner
            );
        }

        // Set the new random number
        self.oracle_state.actual_random_number = new_random_number;

        // Return contract response
        OracleServiceResponse::RandomNumberSet
    }

    // Command to be called by the provider, it will set the new random word
    pub fn set_new_random_word(&mut self, new_random_word: String) -> OracleServiceResponse {
        // Get the current caller address
        let caller = msg::source();
        // owner address
        let owner = self.oracle_state.owner;
        // provider address
        let provider = self.oracle_state.provider;

        // Check if the provider exists and if the caller is the owner or the provider
        if owner != caller && (provider.is_none() || provider.unwrap() != caller) {
            return OracleServiceResponse::Errors(
                OracleErrors::ActionOnlyForProviderOrOwner
            );
        }

        // Set the new random word
        self.oracle_state.actual_random_word = new_random_word;

        // Return contract response
        OracleServiceResponse::RandomWordSet
    }

    // Query, gives the actual random number
    pub fn actual_random_number(&self) -> OracleServiceResponse {
        let random_number = self.oracle_state
            .actual_random_number;
        
        OracleServiceResponse::RandomNumber(random_number)
    }

    // Query, gives the actual random word
    pub fn actual_random_word(&self) -> OracleServiceResponse {
        let random_word = self.oracle_state
            .actual_random_word
            .clone();

        OracleServiceResponse::RandomWord(random_word)
    }
    
    pub fn hello(&mut self) -> String {
        // self.notify_on(RandomNumberEvent::NeedRandomNUmber).unwrap();
        "Hello world!".to_string()
    }
}

// Oracle service responses 
#[derive(Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum OracleServiceResponse {
    NoGivenState,
    WIllChangeRandomNumber,
    WIllChangeRandomWord,
    RandomNumberSet,
    RandomWordSet,
    RandomNumber(u64),
    RandomWord(String),
    NewProviderSet,
    Errors(OracleErrors)
}

// Errors from Oracle service
#[derive(Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum OracleErrors {
    NoProviderInContract,
    ActionOnlyForOwner,
    ActionOnlyForProviderOrOwner,
    BadRange {
        min: u64,
        max: u64
    }
}

// Events for Oracle service
#[derive(Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum OracleEvent {
    RequestRandomNumber,
    RequestRandomWord,
    RequestRangeOfRandomNumbers {
        min: u64,
        max: u64
    }
}