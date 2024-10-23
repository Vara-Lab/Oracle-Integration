use sails_rs::prelude::*;

// State Struct for Oracle service
pub struct OracleState {
    pub owner: ActorId,
    pub provider: Option<ActorId>,
    pub actual_random_number: u64,
    pub actual_random_word: String,
    pub callers: Vec<ActorId>,
}

// Methods and related functions for oracle state
impl OracleState {
    // Constructor related function, creates a new instance 
    // of the OracleState struct
    pub fn new(owner: ActorId) -> Self {
        Self {
            owner,
            provider: None,
            actual_random_number: 0,
            actual_random_word: "".to_string(),
            callers: Vec::new()
        }
    }
}
