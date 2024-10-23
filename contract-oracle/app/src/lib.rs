#![no_std]
use sails_rs::{
    prelude::*,
    gstd::msg,
    cell::RefCell
};

pub mod services;
pub mod states;

use services::oracle_service::OracleService;
use states::oracle_state::OracleState;

pub struct OracleProgram {
    oracle_state: RefCell<OracleState>,
}

#[program]
impl OracleProgram {
    // Program constructor
    pub fn new() -> Self {
        let caller = msg::source();
        let oracle_state = RefCell::new(OracleState::new(caller));

        Self {
            oracle_state
        }
    }

    // Method working with "&self", having no other parameters are treated as exposed
    // service constructors, and are called each time when an incoming request message 
    // needs be dispatched to a selected service
    // It has "message routing", This will change the way a service will be called 
    // (if omitted, the method name will be used, in this case OracleSvc).
    #[route("OracleService")]
    pub fn oracle_svc(&self) -> OracleService {
        OracleService::new(
            self.oracle_state.borrow_mut()
        )
    }
}