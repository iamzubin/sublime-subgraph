import {
    SavingAccount, SavingDeposit,
} from '../../generated/schema';
import {
    Deposited,
    StrategySwitched,
    Withdrawn,
    WithdrawnAll,
} from '../../generated/SavingsAccount/SavingsAccount';
import { BIGINT_ZERO } from "../utils/constants";

export function handleDeposited(
    event: Deposited
): void {
    let userId = event.params.user.toHexString();
    let savingAccount = SavingAccount.load(userId);

    if (savingAccount == null) {
        savingAccount.user = userId;
        savingAccount.save();
    }

    let depositId = userId + event.params.asset.toHexString();
    let savingDeposit = SavingDeposit.load(depositId);

    if (savingDeposit == null) {
        savingDeposit.asset = event.params.asset;
        savingDeposit.strategy = event.params.strategy;
        savingDeposit.amount = BIGINT_ZERO
    }

    savingDeposit.amount = savingDeposit.amount.plus(
        event.params.amount
    );

    savingDeposit.save();
}

export function handleStrategySwitched(
    event: StrategySwitched
): void {
    let depositId = event.params.user.toHexString() +
        event.params.asset.toHexString();

    let savingDeposit = SavingDeposit.load(depositId);

    savingDeposit.strategy = event.params.newStrategy;

    savingDeposit.save();
}


export function handleWithdrawn(
    event: Withdrawn
): void {
    let depositId = event.params.user.toHexString() +
        event.params.token.toHexString();

    let savingDeposit = SavingDeposit.load(depositId);

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
