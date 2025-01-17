use core::array::ArrayTrait;
use snforge_std::{declare, ContractClassTrait};
use crate::interface::payman::{IPaymanDispatcher, IPaymanDispatcherTrait};

fn deploy_payman() -> IPaymanDispatcher {
    let contract = declare('PaymanContract').unwrap();
    let mut calldata = ArrayTrait::new();
    let contract_address = contract.deploy(@calldata).unwrap();
    IPaymanDispatcher { contract_address }
} 