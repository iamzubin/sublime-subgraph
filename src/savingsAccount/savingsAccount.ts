import { Address } from "@graphprotocol/graph-ts";
import { 
    Approved, 
    CreditLineAllowanceRefreshed, 
    CreditLineUpdated, 
    Deposited, 
    StrategyRegistryUpdated, 
    StrategySwitched,
    Transfer,
    Withdrawn,
    WithdrawnAll,
} from "../../generated/SavingsAccount/SavingsAccount";
import { addBalanceToUser, decreaseBalance, getBalance, getUserBalance, increaseBalance } from "./helpers";

export function handleDeposit(event: Deposited): void {
    increaseBalance(event.params.user, event.params.token, event.params.strategy, event.params.sharesReceived);
}

export function handleApproval(event: Approved): void {
    
}

export function handleCreditLineAllowanceRefreshed(event: CreditLineAllowanceRefreshed): void {

}

export function handleCreditLineUpdate(event: CreditLineUpdated): void {

}

export function handleStrategyRegistryUpdate(event: StrategyRegistryUpdated): void {

}

export function handleStrategySwitched(event: StrategySwitched): void {
    increaseBalance(event.params.user, event.params.token, event.params.currentStrategy, event.params.sharesDecreasedInCurrentStrategy);
    decreaseBalance(event.params.user, event.params.token, event.params.newStrategy, event.params.sharesIncreasedInNewStrategy);
}

export function handleTransfer(event: Transfer): void {
    increaseBalance(event.params.from, event.params.token, event.params.strategy, event.params.amount);
    decreaseBalance(event.params.to, event.params.token, event.params.strategy, event.params.amount);
}

export function handleWithdraw(event: Withdrawn): void {
    decreaseBalance(event.params.from, event.params.token, event.params.strategy, event.params.sharesWithdrawn);
}

export function handleWithdrawAll(event: WithdrawnAll): void {
    let userBalance = getUserBalance(event.params.user, event.params.token);
    let strategyBalances = userBalance.strategyBalance;

    for(let i=0; i < strategyBalances.length; i++) {
        let strategy = Address.fromHexString(strategyBalances[i]) as Address;
        let balance = getBalance(event.params.user, event.params.token, strategy);
        decreaseBalance(event.params.user, event.params.token, strategy, balance.shares);
    }
}