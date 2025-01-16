use starknet::ContractAddress;

// Data structure layout for the system

#[derive(Drop, Copy, Serde, starknet::Store)]
pub struct Invoice {
    pub invoiceId: u256,
    pub creator: ContractAddress,
    pub username: string,
    pub description: string,
    pub amount: u256,
    pub isPaid: bool,
    pub isCancelled: bool,
    pub payer: ContractAddress,
    pub transactionUrl: string
}


#[derive(Drop, Copy, Serde, starknet::Store, PartialEq)]
pub struct User {
    pub userId: uint256, 
    pub walletAddress: ContractAddress,
    pub username: string
}

#[starknet::interface]
pub trait IPayman<TContractState> {
    fn registerUsername(
        ref self: TContractState,
        username: string
    ) -> User;


    fn createInvoice(
        ref self: TContractState,
        description: string,
        amount: u256
    ) -> Invoice;

    fn cancelInvoice(
        ref self: TContractState,
        invoiceId: uint256
    ) -> bool;

    fn payInvoice(
        ref self: TContractState,
        invoiceId: u256
    ) -> bool;



    fn getInvoiceForUser(self: @TContractState, user: ContractAddress) -> Array<Invoice>;

    fn getUser(self: @TContractState, userAddress: ContractAddress) -> User;

    fn getInvoice(self: @TContractState, invoiceAddress: ContractAddress) -> Invoice;

}
