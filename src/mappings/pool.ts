import {
    Pool, LendingDetails,LendingDetailscopy
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
import { store } from "@graphprotocol/graph-ts";

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

    // lendingDetail.amountSupplied = lendingDetail
    //     .amountSupplied.plus(event.params.amountSupplied);

    lendingDetail.save();

    createUser(event.params.lenderAddress);

    let pool = Pool.load(poolAddress);
    pool.lentAmount = pool.lentAmount
        .plus(event.params.amountSupplied);

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