import {
    SavingAccount, SavingDeposit,
} from '../../generated/schema';
import {
    Deposited,
    StrategySwitched,
    Withdrawn,
    WithdrawnAll,
    SavingsAccount as savingsAccountContract
} from '../../generated/SavingsAccount/SavingsAccount';
import { BIGINT_ZERO,SAVINGS_ACCOUNT_ADDRESS} from "../utils/constants";


let savingAccountContract = savingsAccountContract.bind(
    SAVINGS_ACCOUNT_ADDRESS
);


export function handleDeposited(
    event: Deposited
): void {
    let userId = event.params.user.toHexString();
    let savingAccount = SavingAccount.load(userId);

    if (savingAccount == null) {
        savingAccount = new SavingAccount(userId);
        savingAccount.user = userId;
        savingAccount.save();
    }

    let depositId = userId + event.params.asset.toHexString() + event.params.strategy.toHexString();
    let savingDeposit = SavingDeposit.load(depositId);

    if (savingDeposit == null) {
        savingDeposit = new SavingDeposit(depositId);
        savingDeposit.asset = event.params.asset;
        savingDeposit.strategy = event.params.strategy;
        savingDeposit.amount = BIGINT_ZERO;
        savingDeposit.liquidityShare = BIGINT_ZERO;
        savingDeposit.savingAccount = userId;
    }
    savingDeposit.liquidityShare = savingAccountContract.try_userLockedBalance(event.params.user, event.params.strategy, event.params.token);
    
    savingDeposit.amount = savingDeposit.amount.plus(
        event.params.amount
    );

    savingDeposit.save();
}

export function handleStrategySwitched(
    event: StrategySwitched
): void {
    let depositIdFrom = event.params.user.toHexString() +
        event.params.asset.toHexString() + event.params.currentStrategy.toHexString();
    let depositIdTo = event.params.user.toHexString() +
        event.params.asset.toHexString() + event.params.newStrategy.toHexString();
                
    let savingDepositFrom = SavingDeposit.load(depositIdFrom);
    let savingDepositTo = SavingDeposit.load(depositIdTo);

    savingDepositFrom.liquidityShare = savingAccountContract.try_userLockedBalance(event.params.user, event.params.asset,event.params.currentStrategy);
    savingDepositTo.liquidityShare = savingAccountContract.try_userLockedBalance(event.params.user, event.params.asset,event.params.newStrategy);
    savingDepositFrom.save();
    savingDepositTo.save();
}


export function handleWithdrawn(
    event: Withdrawn
): void {
    let depositId = event.params.from.toHexString() +
        event.params.token.toHexString()+ event.params.strategy.toHexString();

    let savingDeposit = SavingDeposit.load(depositId);

    savingDeposit.liquidityShare = savingAccountContract.try_userLockedBalance(event.params.user, event.params.strategy);
    savingDeposit.amount = savingDeposit.amount.minus(
        event.params.amountReceived
    );

    savingDeposit.save();
}

export function handleWithdrawnAll(
    event: WithdrawnAll
): void {
    let depositId = event.params.user.toHexString() +
        event.params.asset.toHexString();

    let savingDeposit = SavingDeposit.load(depositId);

    savingDeposit.amount = BIGINT_ZERO;
    savingDeposit.save();
}
