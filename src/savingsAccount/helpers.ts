import { Address, store } from "@graphprotocol/graph-ts";
import { BigInt } from "@graphprotocol/graph-ts";
import { Balance, Strategy, UserBalance } from "../../generated/schema";
import { BIGINT_ZERO } from "../constants/constants";


// export function getSavingsAccount(user: Address): SavingsAccount {
//     let savingsAccount = SavingsAccount.load(user.toHexString());
//     if(savingsAccount == null) {
//         savingsAccount = new SavingsAccount(user.toHexString());
//         savingsAccount.address = user.toHexString();
//         savingsAccount.balances = [];
//         savingsAccount.allowances = [];
//         // TODO: this can be removed ?
//         savingsAccount.save();
//     }
//     return savingsAccount;
// }

function getUserBalanceId(user: Address, token: Address): string {
    let userBalanceId = user.toHexString() + token.toHexString();
    return userBalanceId;
}

export function getUserBalance(user: Address, token: Address): UserBalance {
    let userBalanceId = getUserBalanceId(user, token);
    let userBalance = UserBalance.load(userBalanceId);
    if(userBalance == null) {
        userBalance = new UserBalance(userBalanceId);
        userBalance.token = token.toHexString();
        userBalance.user = user.toHexString();
        userBalance.strategyBalance = [];
        // TODO: this can be removed ?
        userBalance.save();
    }
    return userBalance;
}

function getBalanceId(user: Address, token: Address, strategy: Address): string {
    let balanceId = user.toHexString() + token.toHexString() + strategy.toHexString();
    return balanceId;
}

export function getBalance(user: Address, token: Address, strategy: Address): Balance {
    let balanceId = getBalanceId(user, token, strategy);
    let balance = Balance.load(balanceId);
    if(balance == null) {
        balance = new Balance(balanceId);
        balance.token = token.toHexString();
        balance.user = user.toHexString();
        balance.strategy = strategy.toHexString();
        balance.shares = BIGINT_ZERO;
        // TODO: this can be removed ?
        balance.save();
        addBalanceToUser(user, token, strategy);
    }
    return balance;
}

export function increaseBalance(user: Address, token: Address, strategy: Address, amount: BigInt): void {
    let balance = getBalance(user, token, strategy);
    balance.shares = balance.shares.plus(amount);
    balance.save();
}

export function decreaseBalance(user: Address, token: Address, strategy: Address, amount: BigInt): void {
    let balance = getBalance(user, token, strategy);
    balance.shares = balance.shares.minus(amount);
    balance.save();

    if(balance.shares == BIGINT_ZERO) {
        store.remove("Balance", balance.id);
        removeBalanceFromUser(user, token, strategy);
    }
}

export function addBalanceToUser(user: Address, token: Address, strategy: Address): void {
    let userBalance = getUserBalance(user, token);
    let strategyBalances = userBalance.strategyBalance
    let balanceId = getBalanceId(user, token, strategy);
    if(strategyBalances.includes(balanceId)) {
        return;
    }
    strategyBalances.push(balanceId);
    userBalance.strategyBalance = strategyBalances;
    userBalance.save();
}

export function removeBalanceFromUser(user: Address, token: Address, strategy: Address): void {
    let userBalance = getUserBalance(user, token);
    let strategyBalances = userBalance.strategyBalance
    let balanceId = getBalanceId(user, token, strategy);
    let index = strategyBalances.indexOf(balanceId);
    if(index == -1) {
        return;
    }
    strategyBalances.splice(index, 1);
    userBalance.strategyBalance = strategyBalances;
    userBalance.save();

    if(userBalance.strategyBalance.length == 0) {
        store.remove("UserBalance", userBalance.id);
    }
}