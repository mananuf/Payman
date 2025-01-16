#[starknet::contract]
pub mod PaymanContract {
    use starknet::storage::StoragePointerReadAccess;
    use starknet::storage::StoragePointerWriteAccess;
    use starknet::storage::{Map, StorageMapWriteAccess, StorageMapReadAccess};
    use core::array::ArrayTrait;
    use starknet::{
        get_caller_address, get_contract_address, get_block_timestamp, ContractAddress, get_tx_info
    };
    use crate::interface::payman::{IPayman, User, Invoice};
    use core::poseidon::PoseidonTrait;
    use core::hash::{HashStateTrait, HashStateExTrait};


   // Helper functions can go here

    #[storage]
    struct Storage {
        userCount: u256,
        invoiceCount: u256,
        users: Map::<ContractAddress, User>,
        registerUsernames: Map::<felt252, bool>,
        userInvoices: Map::<ContractAddress, Array<Invoice>>
        invoicesDetails: Map::<u256, Invoice>
    }

    #[abi(embed_v0)]
    impl Payman of IPayman<ContractState> {
        
    }
}
