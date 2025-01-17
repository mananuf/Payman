use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct User {
    pub userId: u256,
    pub walletAddress: ContractAddress,
    pub username: felt252
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct Invoice {
    pub invoiceId: u256,
    pub creator: ContractAddress,
    pub username: felt252,
    pub description: felt252,
    pub amount: u256,
    pub isPaid: bool,
    pub isCancelled: bool,
    pub payer: ContractAddress,
    pub transactionUrl: felt252
}

#[starknet::interface]
pub trait IPayman<TContractState> {
    fn registerUsername(ref self: TContractState, username: felt252) -> User;
    fn createInvoice(ref self: TContractState, description: felt252, amount: u256) -> Invoice;
    fn payInvoice(ref self: TContractState, invoiceId: u256) -> Invoice;
    fn cancelInvoice(ref self: TContractState, invoiceId: u256) -> Invoice;
}
