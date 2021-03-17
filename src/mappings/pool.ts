import {
    Pool, LendingDetails,
} from '../../generated/schema';
import {
    LOAN_STATUS_CLOSED,
    LOAN_STATUS_TERMINATED,
    LOAN_STATUS_CANCELLED,
} from "../utils/constants";
import {
    updateUserPools,
} from "../utils/helpers";
import {
    OpenBorrowPoolClosed,
    OpenBorrowPoolTerminated,
    OpenBorrowPoolCancelled,
    CollateralAdded,
    CollateralWithdrawn,
    LiquiditySupplied,
    LiquidityWithdrawn,
    CollateralCalled,
    AmountBorrowed,
    MarginCallCollateralAdded,
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

export function handleOpneBorrowPoolCanceled(
    event: OpenBorrowPoolCancelled
): void {
    let pool = Pool.load(
        event.transaction.to.toHexString()
    );

    pool.loanStatus = LOAN_STATUS_CANCELLED;
    pool.save();
}

export function handleCollateralAdded(
    event: CollateralAdded
): void {
    let pool = Pool.load(
        event.transaction.to.toHexString()
    );

    pool.colleteralAmount = pool.colleteralAmount
        .plus(event.params.amount);

    pool.save();
}

export function handleCollateralWithdrawn(
    event: CollateralWithdrawn
): void {
    let pool = Pool.load(
        event.transaction.to.toHexString()
    );

    pool.colleteralAmount = pool.colleteralAmount
        .minus(event.params.amount);

    pool.save();
}

export function handleLiquiditySupplied(
    event: LiquiditySupplied
): void {
    let poolAddress = event.transaction.to.toHexString();
    let lendingDetailId = poolAddress +
        event.params.lenderAddress.toHexString();

    let lendingDetail = LendingDetails.load(
        lendingDetailId
    );

    if (lendingDetail == null) {
        lendingDetail = new LendingDetails(lendingDetailId);
    }

    lendingDetail.pool = poolAddress;
    lendingDetail.collateralCalled = false;
    lendingDetail.amountSupplied = lendingDetail
        .amountSupplied.plus(event.params.amountSupplied);

    lendingDetail.save();

    updateUserPools(
        event.params.lenderAddress,
        poolAddress,
        "supplied",
        "lending-pool"
    );

    let pool = Pool.load(poolAddress);
    pool.lentAmount = pool.lentAmount
        .plus(event.params.amountSupplied);

    pool.save();
}

export function handleLiquidityWithdrawn(
    event: LiquidityWithdrawn
): void {
    let poolAddress = event.transaction.to.toHexString();

    let lendingDetailId = poolAddress +
        event.params.lenderAddress.toHexString();

    let lendingDetail = LendingDetails.load(lendingDetailId);

    lendingDetail.amountWithdrawn = lendingDetail.amountWithdrawn
        .plus(event.params.amount);

    if (
        lendingDetail.amountWithdrawn ==
        lendingDetail.amountSupplied
    ) {
        store.remove('LendingDetail', lendingDetailId);
    } else {
        lendingDetail.save();
    }

    let pool = Pool.load(poolAddress);
    pool.lentAmount = pool.lentAmount
        .minus(event.params.amount);

    pool.save();
}

export function handleCollateralCalled(
    event: CollateralCalled
): void {
    let poolAddress = event.transaction.to.toHexString();

    let lendingDetailId = poolAddress +
        event.params.lenderAddress.toHexString();

    let lendingDetail = LendingDetails.load(lendingDetailId);
    lendingDetail.collateralCalled = true;
    lendingDetail.save();

    let pool = Pool.load(poolAddress);
    pool.collateralCalls = pool.collateralCalls
        .plus(lendingDetail.amountSupplied);

    pool.save();
}

export function handleAmountBorrowed(
    event: AmountBorrowed
): void {
    let poolAddress = event.transaction.to.toHexString();

    let pool = Pool.load(poolAddress);
    pool.borrowedAmount = pool.borrowedAmount
        .plus(event.params.amount);

    pool.save();
}
