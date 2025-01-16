use core::traits::Into;
use payman::interface::payman::{IPayman, Invoice, User};
use snforge_std::{
    CheatTarget, ContractClass, ContractClassTrait, EventAssertions, EventSpy, declare, spy_events,
    start_prank, stop_prank, test_address,
};
use starknet::{ContractAddress, contract_address_const};

fn setup() -> (ContractAddress, ContractClass) {
    // Deploy contract
    let contract = declare('PaymanContract');
    let contract_address = contract.deploy(@ArrayTrait::new()).unwrap();
    (contract_address, contract)
}

#[test]
fn test_register_username() {
    let (contract_address, _) = setup();
    let user = test_address();

    // Start pranking as test user
    start_prank(CheatTarget::One(contract_address), user);

    // Dispatch register username
    let dispatcher = IPayman::dispatcher(contract_address);
    let username: felt252 = 'alice';
    let result = dispatcher.registerUsername(username);

    // Assert user details
    assert(result.username == username, 'Wrong username');
    assert(result.walletAddress == user, 'Wrong wallet address');
    assert(result.userId == 0, 'Wrong user ID');

    stop_prank(CheatTarget::One(contract_address));
}

#[test]
#[should_panic(expected: ('User already registered',))]
fn test_register_username_already_registered() {
    let (contract_address, _) = setup();
    let user = test_address();

    start_prank(CheatTarget::One(contract_address), user);

    let dispatcher = IPayman::dispatcher(contract_address);

    // Register first time
    dispatcher.registerUsername('alice');

    // Try to register again - should fail
    dispatcher.registerUsername('bob');

    stop_prank(CheatTarget::One(contract_address));
}

#[test]
#[should_panic(expected: ('Username already taken',))]
fn test_register_username_already_taken() {
    let (contract_address, _) = setup();
    let user1 = test_address();
    let user2 = contract_address_const::<2>();
    let dispatcher = IPayman::dispatcher(contract_address);

    // Register first user
    start_prank(CheatTarget::One(contract_address), user1);
    dispatcher.registerUsername('alice');
    stop_prank(CheatTarget::One(contract_address));

    // Try to register second user with same username
    start_prank(CheatTarget::One(contract_address), user2);
    dispatcher.registerUsername('alice');
    stop_prank(CheatTarget::One(contract_address));
}

#[test]
fn test_create_invoice() {
    let (contract_address, _) = setup();
    let user = test_address();

    start_prank(CheatTarget::One(contract_address), user);

    let dispatcher = IPayman::dispatcher(contract_address);

    // Register user first
    dispatcher.registerUsername('alice');

    // Create invoice
    let description: felt252 = 'Test invoice';
    let amount: u256 = 1000;
    let invoice = dispatcher.createInvoice(description, amount);

    // Assert invoice details
    assert(invoice.invoiceId == 1, 'Wrong invoice ID');
    assert(invoice.creator == user, 'Wrong creator');
    assert(invoice.description == description, 'Wrong description');
    assert(invoice.amount == amount, 'Wrong amount');
    assert(!invoice.isPaid, 'Should not be paid');
    assert(!invoice.isCancelled, 'Should not be cancelled');

    stop_prank(CheatTarget::One(contract_address));
}

#[test]
#[should_panic(expected: ('User must be registered',))]
fn test_create_invoice_unregistered_user() {
    let (contract_address, _) = setup();
    let user = test_address();

    start_prank(CheatTarget::One(contract_address), user);

    let dispatcher = IPayman::dispatcher(contract_address);

    // Try to create invoice without registering
    dispatcher.createInvoice('Test invoice', 1000);

    stop_prank(CheatTarget::One(contract_address));
}

#[test]
fn test_pay_invoice() {
    let (contract_address, _) = setup();
    let creator = test_address();
    let payer = contract_address_const::<2>();
    let dispatcher = IPayman::dispatcher(contract_address);

    // Register and create invoice as creator
    start_prank(CheatTarget::One(contract_address), creator);
    dispatcher.registerUsername('alice');
    let invoice = dispatcher.createInvoice('Test invoice', 1000);
    stop_prank(CheatTarget::One(contract_address));

    // Pay invoice as payer
    start_prank(CheatTarget::One(contract_address), payer);
    let paid_invoice = dispatcher.payInvoice(invoice.invoiceId, 1000);

    // Assert payment details
    assert(paid_invoice.isPaid, 'Should be paid');
    assert(paid_invoice.payer == payer, 'Wrong payer');
    assert(paid_invoice.transactionUrl != 0, 'Missing transaction URL');

    stop_prank(CheatTarget::One(contract_address));
}

#[test]
#[should_panic(expected: ('Invoice already paid',))]
fn test_pay_invoice_already_paid() {
    let (contract_address, _) = setup();
    let creator = test_address();
    let payer = contract_address_const::<2>();
    let dispatcher = IPayman::dispatcher(contract_address);

    // Setup and pay invoice first time
    start_prank(CheatTarget::One(contract_address), creator);
    dispatcher.registerUsername('alice');
    let invoice = dispatcher.createInvoice('Test invoice', 1000);
    stop_prank(CheatTarget::One(contract_address));

    start_prank(CheatTarget::One(contract_address), payer);
    dispatcher.payInvoice(invoice.invoiceId, 1000);

    // Try to pay again
    dispatcher.payInvoice(invoice.invoiceId, 1000);

    stop_prank(CheatTarget::One(contract_address));
}

#[test]
fn test_cancel_invoice() {
    let (contract_address, _) = setup();
    let creator = test_address();
    let dispatcher = IPayman::dispatcher(contract_address);

    // Register and create invoice
    start_prank(CheatTarget::One(contract_address), creator);
    dispatcher.registerUsername('alice');
    let invoice = dispatcher.createInvoice('Test invoice', 1000);

    // Cancel invoice
    let cancelled_invoice = dispatcher.cancelInvoice(invoice.invoiceId);

    // Assert cancellation
    assert(cancelled_invoice.isCancelled, 'Should be cancelled');

    stop_prank(CheatTarget::One(contract_address));
}

#[test]
#[should_panic(expected: ('Not invoice owner',))]
fn test_cancel_invoice_not_owner() {
    let (contract_address, _) = setup();
    let creator = test_address();
    let other_user = contract_address_const::<2>();
    let dispatcher = IPayman::dispatcher(contract_address);

    // Create invoice as creator
    start_prank(CheatTarget::One(contract_address), creator);
    dispatcher.registerUsername('alice');
    let invoice = dispatcher.createInvoice('Test invoice', 1000);
    stop_prank(CheatTarget::One(contract_address));

    // Try to cancel as other user
    start_prank(CheatTarget::One(contract_address), other_user);
    dispatcher.cancelInvoice(invoice.invoiceId);
    stop_prank(CheatTarget::One(contract_address));
}

#[test]
#[should_panic(expected: ('Invoice already paid',))]
fn test_cancel_paid_invoice() {
    let (contract_address, _) = setup();
    let creator = test_address();
    let payer = contract_address_const::<2>();
    let dispatcher = IPayman::dispatcher(contract_address);

    // Create and pay invoice
    start_prank(CheatTarget::One(contract_address), creator);
    dispatcher.registerUsername('alice');
    let invoice = dispatcher.createInvoice('Test invoice', 1000);
    stop_prank(CheatTarget::One(contract_address));

    start_prank(CheatTarget::One(contract_address), payer);
    dispatcher.payInvoice(invoice.invoiceId, 1000);
    stop_prank(CheatTarget::One(contract_address));

    // Try to cancel paid invoice
    start_prank(CheatTarget::One(contract_address), creator);
    dispatcher.cancelInvoice(invoice.invoiceId);
    stop_prank(CheatTarget::One(contract_address));
}
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_pay_invoice() {
        let (contract_address, _) = setup();
        let creator = test_address();
        let payer = contract_address_const::<2>();
        let dispatcher = IPayman::dispatcher(contract_address);

        // Create invoice as creator
        start_prank(CheatTarget::One(contract_address), creator);
        dispatcher.registerUsername('alice');
        let invoice = dispatcher.createInvoice('Test invoice', 1000);
        stop_prank(CheatTarget::One(contract_address));

        // Pay invoice as payer
        start_prank(CheatTarget::One(contract_address), payer);
        dispatcher.registerUsername('bob');
        let paid_invoice = dispatcher.payInvoice(invoice.invoiceId);
        stop_prank(CheatTarget::One(contract_address));

        // Assert payment details
        assert(paid_invoice.isPaid, 'Should be paid');
        assert(paid_invoice.payer == payer, 'Wrong payer');
        assert(paid_invoice.transactionUrl != 0, 'Missing transaction URL');
    }

    #[test]
    #[should_panic(expected: ('Invoice does not exist',))]
    fn test_pay_nonexistent_invoice() {
        let (contract_address, _) = setup();
        let payer = test_address();
        let dispatcher = IPayman::dispatcher(contract_address);

        start_prank(CheatTarget::One(contract_address), payer);
        dispatcher.registerUsername('bob');
        dispatcher.payInvoice(999);
        stop_prank(CheatTarget::One(contract_address));
    }

    #[test]
    #[should_panic(expected: ('Invoice already cancelled',))]
    fn test_pay_cancelled_invoice() {
        let (contract_address, _) = setup();
        let creator = test_address();
        let payer = contract_address_const::<2>();
        let dispatcher = IPayman::dispatcher(contract_address);

        // Create and cancel invoice
        start_prank(CheatTarget::One(contract_address), creator);
        dispatcher.registerUsername('alice');
        let invoice = dispatcher.createInvoice('Test invoice', 1000);
        dispatcher.cancelInvoice(invoice.invoiceId);
        stop_prank(CheatTarget::One(contract_address));

        // Try to pay cancelled invoice
        start_prank(CheatTarget::One(contract_address), payer);
        dispatcher.registerUsername('bob');
        dispatcher.payInvoice(invoice.invoiceId);
        stop_prank(CheatTarget::One(contract_address));
    }

    #[test]
    #[should_panic(expected: ('Invoice already paid',))]
    fn test_pay_already_paid_invoice() {
        let (contract_address, _) = setup();
        let creator = test_address();
        let payer1 = contract_address_const::<2>();
        let payer2 = contract_address_const::<3>();
        let dispatcher = IPayman::dispatcher(contract_address);

        // Create invoice
        start_prank(CheatTarget::One(contract_address), creator);
        dispatcher.registerUsername('alice');
        let invoice = dispatcher.createInvoice('Test invoice', 1000);
        stop_prank(CheatTarget::One(contract_address));

        // First payment
        start_prank(CheatTarget::One(contract_address), payer1);
        dispatcher.registerUsername('bob');
        dispatcher.payInvoice(invoice.invoiceId);
        stop_prank(CheatTarget::One(contract_address));

        // Try second payment
        start_prank(CheatTarget::One(contract_address), payer2);
        dispatcher.registerUsername('charlie');
        dispatcher.payInvoice(invoice.invoiceId);
        stop_prank(CheatTarget::One(contract_address));
    }
}

