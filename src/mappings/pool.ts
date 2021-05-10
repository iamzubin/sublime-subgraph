import {
    Address,
  } from "@graphprotocol/graph-ts";
import {
    REPAYMENTS_ACCOUNT_ADDRESS
} from "../utils/constants"  
import {
    Pool, LendingDetails, LendingDetailscopy
} from '../../generated/schema';
import {
    LOAN_STATUS_CLOSED,
    LOAN_STATUS_TERMINATED,
    LOAN_STATUS_CANCELLED,
    LOAN_STATUS_ACTIVE,
    LOAN_STATUS_DEFAULTED
} from "../utils/constants";
import {
    createUser,
} from "../utils/helpers";
import {
    OpenBorrowPoolClosed,
    OpenBorrowPoolTerminated,
    OpenBorrowPoolCancelled,
    CollateralAdded,
    CollateralWithdrawn,
    LiquiditySupplied,
    LiquidityWithdrawn,
    AmountBorrowed,
    MarginCallCollateralAdded,
    LoanDefaulted,
    Pool as PoolContract,
} from '../../generated/templates/Pool/Pool';

import {
    Approval,
    Transfer,
    PoolToken
} from '../../generated/templates/PoolToken/PoolToken';

import {
    Repayments,
    InterestRepaid,
    PartialExtensionRepaymentMade
} from "../../generated/Repayments/Repayments"

import { store } from "@graphprotocol/graph-ts";

import {
    BigInt
  } from "@graphprotocol/graph-ts";

export function handleInterestRepaid(
    event: InterestRepaid
): void {
    let poolAddress = event.params.poolID.toHexString()
    let pool = Pool.load(poolAddress)
    if(pool == null){
        pool = new Pool(poolAddress)
    }
    let repaymentsContract = Repayments.bind(REPAYMENTS_ACCOUNT_ADDRESS)
    pool.amountRepaid = repaymentsContract.try_getTotalRepaidAmount(event.params.poolID).value
    let poolInstance = PoolContract.bind(Address.fromString(poolAddress))
    let resultNextDueTime = poolInstance.try_getNextDueTime()
    let nextDueTime: BigInt;
    if (!resultNextDueTime.reverted) {
        nextDueTime = resultNextDueTime.value;
    }
    pool.nextDueTime = nextDueTime;
    pool.save()
}

export function handlePartialExtensionRepaymentMade(
    event: PartialExtensionRepaymentMade
): void {
    let poolAddress = event.params.poolID.toHexString()
    let pool = Pool.load(poolAddress)
    if(pool == null){
        pool = new Pool(poolAddress)
    }
    let repaymentsContract = Repayments.bind(REPAYMENTS_ACCOUNT_ADDRESS)
    pool.amountRepaid = repaymentsContract.try_getTotalRepaidAmount(event.params.poolID).value
    let poolInstance = PoolContract.bind(Address.fromString(poolAddress))
    let resultNextDueTime = poolInstance.try_getNextDueTime()
    let nextDueTime: BigInt;
    if (!resultNextDueTime.reverted) {
        nextDueTime = resultNextDueTime.value;
    }
    pool.nextDueTime = nextDueTime;
    pool.save()
}

export function handleTransfer(
    event: Transfer
): void {
    // let poolAddress = event.transaction.to.toHexString()
    // let pool = Pool.load(poolAddress);
    // let poolTokenInstance = PoolToken.bind(
    //     Address.fromString(pool.tokenImpl)
    // );
    // let transferFrom = poolAddress +
    //     event.params.from.toHexString();
    // let lendingDetailFrom = LendingDetailscopy.load(transferFrom)
    // let transferTo = poolAddress +
    //     event.params.to.toHexString();
    // let lendingDetailTo = LendingDetailscopy.load(transferTo)
    // if(lendingDetailTo == null){
    //     lendingDetailTo = new LendingDetailscopy(transferTo)
    //     lendingDetailTo.pool = poolAddress;
    //     // lendingDetail.collateralCalled = false;
    //     lendingDetailTo.lender = event.params.to.toHexString();
    // }
    // // lendingDetailTo.AmountLend = poolTokenInstance.try_balanceOf(event.params.to).value
    // // lendingDetailFrom.AmountLend = poolTokenInstance.try_balanceOf(event.params.from).value
    // lendingDetailFrom.save()
    // lendingDetailTo.save()
}

export function handleOpenBorrowPoolClosed(
    event: OpenBorrowPoolClosed
): void {
    let pool = Pool.load(
        event.transaction.to.toHexString()
    );

    pool.loanStatus = LOAN_STATUS_CLOSED;
    pool.save();
}

export function handleOpenBorrowPoolTerminated(
    event: OpenBorrowPoolTerminated
): void {
    let pool = Pool.load(
        event.transaction.to.toHexString()
    );

    pool.loanStatus = LOAN_STATUS_TERMINATED;
    pool.save();
}

export function handleOpenBorrowPoolCanceled(
    event: OpenBorrowPoolCancelled
): void {
    let pool = Pool.load(
        event.transaction.to.toHexString()
    );

    pool.loanStatus = LOAN_STATUS_CANCELLED;
    pool.save();
}

export function handleLoanDefaulted(
    event: LoanDefaulted
): void {
    let pool = Pool.load(
        event.transaction.to.toHexString()
    );

    pool.loanStatus = LOAN_STATUS_DEFAULTED;
    pool.save();
}

export function handleCollateralAdded(
    event: CollateralAdded
): void {
    let pool = Pool.load(
        event.transaction.to.toHexString()
    );

    pool.baseLiquidityShares = pool.baseLiquidityShares
        .plus(event.params.sharesReceived);

    pool.save();
}

export function handleCollateralWithdrawn(
    event: CollateralWithdrawn
): void {
    let pool = Pool.load(
        event.transaction.to.toHexString()
    );

    pool.baseLiquidityShares = pool.baseLiquidityShares
        .minus(event.params.amount);
    pool.save();
}


export function handleLiquiditySupplied(
    event: LiquiditySupplied
): void {
    let poolAddress = event.transaction.to.toHexString();
    let lendingDetailId = poolAddress +
        event.params.lenderAddress.toHexString();
    // let lendingDetailId = event.params.lenderAddress.toHexString();
    let lendingDetail = LendingDetailscopy.load(
        lendingDetailId
    );

    if (lendingDetail == null) {
        lendingDetail = new LendingDetailscopy(lendingDetailId);
        lendingDetail.pool = poolAddress;
        // lendingDetail.collateralCalled = false;
        lendingDetail.lender = event.params.lenderAddress.toHexString();
    }

    lendingDetail.AmountLend = lendingDetail.AmountLend.plus(event.params.amountSupplied);


    createUser(event.params.lenderAddress);

    let pool = Pool.load(poolAddress);
    pool.lentAmount = pool.lentAmount
        .plus(event.params.amountSupplied);
    // let poolTokenInstance = PoolToken.bind(
    //     Address.fromString(pool.tokenImpl)
    // );
    // lendingDetail.AmountLend = poolTokenInstance.try_balanceOf(event.params.lenderAddress).value
    lendingDetail.save();
    pool.save();

}

// export function handleLiquidityWithdrawn(
//     event: LiquidityWithdrawn
// ): void {
//     let poolAddress = event.transaction.to.toHexString();

//     let lendingDetailId = poolAddress +
//         event.params.lenderAddress.toHexString();

//     let lendingDetail = LendingDetails.load(lendingDetailId);

//     if(lendingDetail == null){
//         lendingDetail = new LendingDetails(lendingDetailId);
//     }

//     lendingDetail.amountWithdrawn = lendingDetail.amountWithdrawn
//         .plus(event.params.amount);

//     lendingDetail.save();
//     // if (
//     //     lendingDetail.amountWithdrawn ==
//     //     lendingDetail.amountSupplied
//     // ) {
//     //     store.remove('LendingDetail', lendingDetailId);
//     // } else {
//     //     lendingDetail.save();
//     // }

//     // let pool = Pool.load(poolAddress);
//     // pool.lentAmount = pool.lentAmount
//     //     .minus(event.params.amount);

//     // pool.save();
// }

// export function handleCollateralCalled(
//     event: CollateralCalled
// ): void {
//     let poolAddress = event.transaction.to.toHexString();

//     let lendingDetailId = poolAddress +
//         event.params.lenderAddress.toHexString();

//     let lendingDetail = LendingDetails.load(lendingDetailId);
//     lendingDetail.collateralCalled = true;
//     lendingDetail.save();

//     let pool = Pool.load(poolAddress);
//     pool.save();
// }

export function handleAmountBorrowed(
    event: AmountBorrowed
): void {
    let poolAddress = event.transaction.to.toHexString();

    let pool = Pool.load(poolAddress);
    // pool.borrowedAmount = pool.borrowedAmount
    //     .plus(event.params.amount);
    pool.loanStatus = LOAN_STATUS_ACTIVE;
    let poolInstance = PoolContract.bind(Address.fromString(poolAddress))
    let resultNextDueTime = poolInstance.try_getNextDueTime()
    let nextDueTime: BigInt;
    if (!resultNextDueTime.reverted) {
        nextDueTime = resultNextDueTime.value;
    }
    pool.nextDueTime = nextDueTime;
    pool.save();
}

// export function handleMarginCallCollateralAdded(
//     event: MarginCallCollateralAdded
// ): void {
//     let poolAddress = event.transaction.to.toHexString();

//     let pool = Pool.load(poolAddress);
//     // pool.borrowedAmount = pool.borrowedAmount
//     //     .plus(event.params.amount);
//     pool.extraLiquidityShares = pool.extraLiquidityShares.plus(event.params.sharesReceived)
//     let lendingDetailId = poolAddress +
//         event.params.lender.toHexString();

//     let lendingDetail = LendingDetails.load(lendingDetailId);
//     lendingDetail.exraLiquidityShares = lendingDetail.exraLiquidityShares.plus(event.params.sharesReceived)
//     lendingDetail.save()
//     pool.save();
// }