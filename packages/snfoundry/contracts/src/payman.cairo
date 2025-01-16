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
        userInvoices: Map::<ContractAddress, Array<Invoice>>,
        invoicesDetails: Map::<u256, Invoice>
    }

    #[abi(embed_v0)]
    impl Payman of IPayman<ContractState> {
        fn registerUsername(
            ref self: ContractState,
            username: felt252
        ) -> User {
            let caller = get_caller_address();
        
            // Check if user already exists - using userId instead of username
            let existing_user = self.users.read(caller);
            assert(existing_user.userId == 0, 'User already registered');
            
            // Check if username is already taken
            let username_taken = self.registerUsernames.read(username);
            assert(!username_taken, 'Username already taken');
            
            // Create new user with userId starting from 1
            let user = User {
                userId: self.userCount.read() + 1, // Start from 1 instead of 0
                walletAddress: caller,
                username: username
            };
            
            // Update storage
            self.users.write(caller, user);
            self.registerUsernames.write(username, true);
            self.userCount.write(self.userCount.read() + 1);
            
            user
        }
        
        fn createInvoice(
            ref self: ContractState,
            description: felt252,
            amount: u256
        ) -> Invoice {
            let caller = get_caller_address();
            
            // Check if user is registered
            let user = self.users.read(caller);
            assert(user.userId != 0, 'User must be registered');
            
            // Check amount is greater than 0
            assert(amount > 0, 'Amount must be greater than 0');
            
            // Increment invoice count first
            let new_invoice_id = self.invoiceCount.read() + 1;
            self.invoiceCount.write(new_invoice_id);
            
            // Create new invoice
            let invoice = Invoice {
                invoiceId: new_invoice_id,
                creator: caller,
                username: user.username,
                description: description,
                amount: amount,
                isPaid: false,
                isCancelled: false,
                payer: contract_address_const::<0>(),
                transactionUrl: felt252::default() // Initialize with default felt252 value
            };
            
            // Update storage
            let mut user_invoices = self.userInvoices.read(caller);
            user_invoices.append(invoice);
            self.userInvoices.write(caller, user_invoices);
            
            self.invoicesDetails.write(invoice.invoiceId, invoice);
            
            invoice
        }

        fn payInvoice(
            ref self: ContractState,
            invoiceId: u256,
            amount: u256
        ) -> Invoice {
            // Get invoice details
            let mut invoice = self.invoicesDetails.read(invoiceId);
            
            // Validate invoice exists
            assert(invoice.invoiceId != 0, 'Invoice does not exist');
            
            // Validate invoice status
            assert(!invoice.isCancelled, 'Invoice already cancelled');
            assert(!invoice.isPaid, 'Invoice already paid');
            
            // Validate payment amount
            assert(amount == invoice.amount, 'Incorrect payment amount');
            
            let caller = get_caller_address();

            // Verify caller has sufficient balance
            let caller_balance = starknet::get_eth_balance(caller);
            assert(caller_balance >= invoice.amount, 'Insufficient balance');

            // Transfer payment from caller to invoice creator
            let transfer_result = starknet::send_eth_payment(invoice.creator, invoice.amount);
            assert(transfer_result.is_ok(), 'Payment transfer failed');

            // Only update invoice state after successful payment
            let tx_info = get_tx_info().unbox();
            invoice.isPaid = true;
            invoice.payer = caller;
            invoice.transactionUrl = tx_info.transaction_hash.into();
            
            // Update storage
            self.invoicesDetails.write(invoiceId, invoice);
            
            invoice
        }

        fn cancelInvoice(
            ref self: ContractState,
            invoiceId: u256
        ) -> bool {
            // Get invoice details
            let mut invoice = self.invoicesDetails.read(invoiceId);
            
            // Validate invoice exists
            assert(invoice.invoiceId != 0, 'Invoice does not exist');
            
            // Validate invoice not already paid
            assert(!invoice.isPaid, 'Invoice already paid');
            
            // Validate invoice not already cancelled
            assert(!invoice.isCancelled, 'Invoice already cancelled');
            
            let caller = get_caller_address();
            
            // Validate caller is invoice creator
            assert(caller == invoice.creator, 'Not invoice owner');
            
            // Update invoice status
            invoice.isCancelled = true;
            
            // Update storage
            self.invoicesDetails.write(invoiceId, invoice);
            
            true // Return success boolean
        }
}
