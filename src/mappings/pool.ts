import { Address } from "@graphprotocol/graph-ts";
import { REPAYMENTS_ACCOUNT_ADDRESS } from "../utils/constants"  
import { Pool,   
         WalletAddress,
         PoolConstants, 
         PoolVars,
         RepaymentConstants, 
         RepaymentVars, 
         PoolToken,
         PoolLender, 
         PoolLenderStatus } from '../../generated/schema';
import { LOAN_STATUS_CLOSED,
         LOAN_STATUS_TERMINATED,
         LOAN_STATUS_CANCELLED,
         LOAN_STATUS_ACTIVE,
         LOAN_STATUS_DEFAULTED } from "../utils/constants";
import { createUser } from "../utils/helpers";
import { OpenBorrowPoolClosed,
         OpenBorrowPoolTerminated,
         OpenBorrowPoolCancelled,
         CollateralAdded,
         CollateralWithdrawn,
         LiquiditySupplied,
         LiquidityWithdrawn,
         AmountBorrowed,
         MarginCallCollateralAdded,
         LoanDefaulted,
         Pool as PoolContract } from '../../generated/templates/Pool/Pool';

import { PoolFactory as PoolFactoryContract } from '../../generated/PoolFactory/PoolFactory';

import { Repayments as RepaymentsContract } from '../../generated/Repayments/Repayments';

import { PoolCreated 
        } from "../../generated/PoolFactory/PoolFactory";

import { Approval,
         Transfer,
         PoolToken as PoolTokenContract } from '../../generated/templates/PoolToken/PoolToken';

import { Repayments,
         InterestRepaid,
         PartialExtensionRepaymentMade } from "../../generated/Repayments/Repayments"

import { store } from "@graphprotocol/graph-ts";

import { BigInt } from "@graphprotocol/graph-ts";

import { ethereum } from '@graphprotocol/graph-ts'


// since pools can only be created by verified addresses, this means that a 
// WalletAddress and corresponding UserProfile already exists

export function handlePoolCreated(event: PoolCreated): void {
    let poolAddress = event.params.pool
    let borrowerAddress = event.params.borrower
    let poolTokenAddress = event.params.poolToken
    let poolContract = PoolContract.bind(poolAddress)
    let poolFactoryContract = PoolFactoryContract.bind(event.address)

    let repaymentImplAddress = poolFactoryContract.try_repaymentImpl().value
    let repaymentsContract = RepaymentsContract.bind(repaymentImplAddress)

    let pool = new Pool(poolAddress.toHexString())
    pool.borrowerAddress = borrowerAddress

    let borrowerWalletAddress = WalletAddress.load(borrowerAddress.toHexString())
    let borrowerUserProfile = borrowerWalletAddress.owner

    pool.borrower = borrowerUserProfile


    // Setting pool constants
    let poolConstants = new PoolConstants(poolAddress.toHexString())
    let poolConstantsValues = poolContract.try_poolConstants().value
    poolConstants.borrowAmountRequested = poolConstantsValues.value1
    poolConstants.minBorrowAmount = poolConstantsValues.value2
    poolConstants.loanStartTime = poolConstantsValues.value3
    poolConstants.loanWithdrawalDeadline = poolConstantsValues.value4
    poolConstants.borrowAsset = poolConstantsValues.value5
    poolConstants.idealCollateralRatio = poolConstantsValues.value6
    poolConstants.borrowRate = poolConstantsValues.value7
    poolConstants.noOfRepaymentIntervals = poolConstantsValues.value8
    poolConstants.repaymentInterval = poolConstantsValues.value9
    poolConstants.collateralAsset = poolConstantsValues.value10
    poolConstants.poolSavingsStrategy = poolConstantsValues.value11

    poolConstants.save()

    //poolConstants.borrowAssetDecimal
    //poolConstants.collateralAssetDecimal
    //poolConstants.collateralAmount 
    //poolConstants.transferFromSavingsAccount

    let poolVars = new PoolVars(poolAddress.toHexString())
    let poolVarsValues = poolContract.try_poolVars().value
    poolVars.baseLiquidityShares = poolVarsValues.value0
    poolVars.extraLiquidityShares = poolVarsValues.value1
    poolVars.loanStatus = poolVarsValues.value2
    poolVars.penalityLiquidityAmount = poolVarsValues.value3

    poolVars.save()


    pool.repaymentEvents = []
    let poolRepaymentConstants = new RepaymentConstants(poolAddress.toHexString())
    let repaymentConstantsValues = repaymentsContract.try_repaymentConstants(poolAddress).value

    poolRepaymentConstants.pool = pool.id
    poolRepaymentConstants.numberOfTotalRepayments = repaymentConstantsValues.value0
    poolRepaymentConstants.gracePenaltyRate = repaymentConstantsValues.value1
    poolRepaymentConstants.gracePeriodFraction = repaymentConstantsValues.value2
    poolRepaymentConstants.loanDuration = repaymentConstantsValues.value3
    poolRepaymentConstants.repaymentInterval = repaymentConstantsValues.value4
    poolRepaymentConstants.borrowRate = repaymentConstantsValues.value5
    poolRepaymentConstants.loanStartTime = repaymentConstantsValues.value6
    poolRepaymentConstants.repayAsset = repaymentConstantsValues.value7
    poolRepaymentConstants.savingsAccount = repaymentConstantsValues.value8
    poolRepaymentConstants.borrowAsset = poolConstantsValues.value5

    poolRepaymentConstants.save()

    let poolRepaymentVars = new RepaymentVars(poolAddress.toHexString())
    let repaymentVarsValues = repaymentsContract.try_repaymentVars(poolAddress).value

    poolRepaymentVars.pool = pool.id
    poolRepaymentVars.totalRepaidAmount = repaymentVarsValues.value0
    poolRepaymentVars.repaymentPeriodCovered = repaymentVarsValues.value1
    poolRepaymentVars.repaidAmount = repaymentVarsValues.value2
    poolRepaymentVars.isLoanExtensionActive = repaymentVarsValues.value3
    poolRepaymentVars.loanDurationCovered = repaymentVarsValues.value4
    poolRepaymentVars.nextDuePeriod = repaymentVarsValues.value5
    poolRepaymentVars.nInstalmentsFullyPaid = repaymentVarsValues.value6
    poolRepaymentVars.loanExtensionPeriod = repaymentVarsValues.value7
    poolRepaymentVars.nextInstalmentDeadline = repaymentsContract.try_getNextInstalmentDeadline(poolAddress).value

    poolRepaymentVars.save()

    let poolToken = new PoolToken(poolTokenAddress.toHexString())
    poolToken.borrowerAddress = borrowerAddress
    poolToken.pool = pool.id

    poolToken.save()

    pool.poolLenders = []
    pool.poolConstants = poolConstants.id
    pool.poolVars = poolVars.id
    pool.repaymentConstants = poolRepaymentConstants.id
    pool.repaymentVars = poolRepaymentVars.id
    pool.poolToken = poolToken.id

    pool.save()
}

export function updatePoolConstants(event: ethereum.Event): PoolConstants {
    let poolContract = PoolContract.bind(event.address)
    let poolConstants = new PoolConstants(event.params.pool.toHexString())



    return poolConstants
}

export function handleInterestRepaid(event: InterestRepaid): void {

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

export function handleOpenBorrowPoolClosed(event: OpenBorrowPoolClosed): void {
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

export function handleCollateralAdded(event: CollateralAdded): void {

    let pool = Pool.load(event.transaction.to.toHexString());

    let poolVariablesAddr = pool.poolVariables;

    poolVariables = PoolVariables.load(poolVariablesAddr);

    poolVariables.baseLiquidityShares = pool.baseLiquidityShares.plus(event.params.sharesReceived);

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


export function handleLiquiditySupplied( event: LiquiditySupplied ): void {
    let poolAddress = event.address;

    let pool = Pool.load(poolAddress.toHexString())

    let lenderID = poolAddress.toHexString() + "-" + event.params.lenderAddress
    let poolLender = PoolLender.load(lenderID)

    if (poolLender == null) {
        poolLender = new PoolLender(lenderID)

        let poolLenders = pool.poolLenders
        poolLenders.push(poolLender.id)
        pool.poolLenders = poolLenders

        poolLender.poolLentIn = poolAddress.toHexString()
        poolLender.lenderAddress = event.params.lenderAddress
        poolLender.status = PoolLenderStatus.ACTIVE
        poolLender.amountLent = event.params.amountSupplied
        poolLender.marginCallsMade = []
        poolLender.save()

        pool.save()
    }

    else {
        let amountLent = poolLender.amountLent
        amountLent = amountLent.plus(event.params.amountSupplied)
        poolLender.amountLent = amountLent

        poolLender.save()
    }

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