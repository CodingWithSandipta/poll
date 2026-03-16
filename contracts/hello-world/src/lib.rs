#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    YesCount,
    NoCount,
    Voted(Address),
}

#[contract]
pub struct PollContract;

#[contractimpl]
impl PollContract {
    /// Vote in the poll.
    /// `vote_yes` indicates if the vote is Yes (true) or No (false).
    pub fn vote(env: Env, voter: Address, vote_yes: bool) {
        voter.require_auth();

        let voted_key = DataKey::Voted(voter.clone());
        let has_voted: bool = env.storage().persistent().get(&voted_key).unwrap_or(false);
        
        if has_voted {
            panic!("already voted");
        }
        
        // Mark voter as having voted
        env.storage().persistent().set(&voted_key, &true);

        // Update vote tallies
        if vote_yes {
            let yes_count: u32 = env.storage().persistent().get(&DataKey::YesCount).unwrap_or(0);
            env.storage().persistent().set(&DataKey::YesCount, &(yes_count + 1));
        } else {
            let no_count: u32 = env.storage().persistent().get(&DataKey::NoCount).unwrap_or(0);
            env.storage().persistent().set(&DataKey::NoCount, &(no_count + 1));
        }
    }

    /// Retrieve the current vote tallies for (Yes, No)
    pub fn get_votes(env: Env) -> (u32, u32) {
        let yes_count: u32 = env.storage().persistent().get(&DataKey::YesCount).unwrap_or(0);
        let no_count: u32 = env.storage().persistent().get(&DataKey::NoCount).unwrap_or(0);
        (yes_count, no_count)
    }

    /// Check if a specific address has already voted
    pub fn has_voted(env: Env, voter: Address) -> bool {
        let voted_key = DataKey::Voted(voter);
        env.storage().persistent().get(&voted_key).unwrap_or(false)
    }
}

mod test;
