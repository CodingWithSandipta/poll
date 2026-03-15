#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_vote() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(PollContract, ());
    let client = PollContractClient::new(&env, &contract_id);
    
    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);
    let user3 = Address::generate(&env);

    // Initial votes should be 0, 0
    assert_eq!(client.get_votes(), (0, 0));

    // User 1 votes Yes
    client.vote(&user1, &true);
    assert_eq!(client.get_votes(), (1, 0));

    // User 2 votes No
    client.vote(&user2, &false);
    assert_eq!(client.get_votes(), (1, 1));

    // User 3 votes Yes
    client.vote(&user3, &true);
    assert_eq!(client.get_votes(), (2, 1));
}

#[test]
#[should_panic(expected = "already voted")]
fn test_double_vote() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(PollContract, ());
    let client = PollContractClient::new(&env, &contract_id);
    let user1 = Address::generate(&env);

    client.vote(&user1, &true);
    client.vote(&user1, &false); // Should panic
}
