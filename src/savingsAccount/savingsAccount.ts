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
import { Balance } from "../../generated/schema";
import { decreaseBalance, getUserBalance, increaseBalance, updateAllowance } from "./helpers";

export function handleStrategyRegistryUpdate(event: StrategyRegistryUpdated): void {

}

export function handleCreditLineUpdate(event: CreditLineUpdated) : void {

}

export function handleDeposit(event: Deposited): void {
  increaseBalance(event.params.user, event.params.token, event.params.strategy, event.params.sharesReceived);
}

export function handleApproval(event: Approved): void {
  updateAllowance(event.params.from, event.params.to, event.params.token, event.address);
}

export function handleCreditLineAllowanceRefreshed(event: CreditLineAllowanceRefreshed): void {
  updateAllowance(event.params.from, event.params.to, event.params.token, event.address);
}

export function handleStrategySwitched(event: StrategySwitched): void {
  decreaseBalance(event.params.user, event.params.token, event.params.currentStrategy, event.params.sharesDecreasedInCurrentStrategy);
  increaseBalance(event.params.user, event.params.token, event.params.newStrategy, event.params.sharesIncreasedInNewStrategy);
}

export function handleTransfer(event: Transfer): void {
  decreaseBalance(event.params.to, event.params.token, event.params.strategy, event.params.amount);
  increaseBalance(event.params.from, event.params.token, event.params.strategy, event.params.amount);
  updateAllowance(event.params.from, event.params.to, event.params.token, event.address);
}

export function handleWithdraw(event: Withdrawn): void {
  decreaseBalance(event.params.from, event.params.token, event.params.strategy, event.params.sharesWithdrawn);
  updateAllowance(event.params.from, event.params.to, event.params.token, event.address);
}

export function handleWithdrawAll(event: WithdrawnAll): void {
  let userBalance = getUserBalance(event.params.user, event.params.token);
  let strategyBalances = userBalance.strategyBalance;

  for (let i = 0; i < strategyBalances.length; i++) {
    let balance = Balance.load(strategyBalances[i]);
    let strategy = Address.fromHexString(balance.strategy) as Address;
    decreaseBalance(event.params.user, event.params.token, strategy, balance.shares);
  }
}
