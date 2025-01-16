use starknet::ContractAddress;

// Data structure layout for the system

#[derive(Drop, Copy, Serde, starknet::Store)]
pub struct Invoice {
    pub invoiceId: u256,
    pub creator: ContractAddress,
    pub username: felt252,
    pub description: felt252,
    pub amount: u256,
    pub isPaid: bool,
    pub isCancelled: bool,
    pub payer: ContractAddress,
    pub transactionUrl: felt252,
}


#[derive(Drop, Copy, Serde, starknet::Store, PartialEq)]
pub struct User {
    pub userId: u256,
    pub walletAddress: ContractAddress,
    pub username: felt252,
}

#[starknet::interface]
pub trait IPayman<TContractState> {
   // Core functions
   fn registerUsername(ref self: TContractState, username: felt252) -> User;
   fn createInvoice(ref self: TContractState, description: felt252, amount: u256) -> Invoice;
   fn cancelInvoice(ref self: TContractState, invoiceId: u256) -> Invoice;
   fn payInvoice(ref self: TContractState, invoiceId: u256) -> Invoice;

   // View functions
   fn getInvoiceForUser(self: @TContractState, userAddress: ContractAddress) -> Array<Invoice>;
   fn getUser(self: @TContractState, userAddress: ContractAddress) -> User;
   fn getInvoice(self: @TContractState, invoiceId: u256) -> Invoice;
}
