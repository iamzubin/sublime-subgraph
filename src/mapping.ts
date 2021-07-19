import {
  DataSourceContext,
} from "@graphprotocol/graph-ts";
import { Pool, User, GlobalPoolDetail } from '../generated/schema';
import {
  PoolCreated, OwnershipTransferred, PoolFactory, CollectionPeriodUpdated
} from '../generated/PoolFactory/PoolFactory';
import {
  Pool as PoolContract,
  Pool__poolVarsResult,
  Pool__poolConstantsResult,
} from '../generated/templates/Pool/Pool';
import {
  BigInt
} from "@graphprotocol/graph-ts";
import {
  BIGINT_ZERO
} from "./utils/constants"
import {
  getLoanStatus, createUser
} from "./utils/helpers"
// import { Pool as poolTemplate} from '../generated/templates/Pool/Pool'


import { Pool as NewPool, PoolToken} from '../generated/templates';
let context = new DataSourceContext();


export function handlePoolCreated(
  event: PoolCreated
): void {
  NewPool.createWithContext(
    event.params.pool, context
  );
  PoolToken.createWithContext(
    event.params.poolToken, context
  );

  let poolContract = PoolContract.bind(
    event.params.pool
  );
  
  let poolConstants: Pool__poolConstantsResult = poolContract.poolConstants();
  let nextDueTime: BigInt;
  
  nextDueTime = BIGINT_ZERO;

  let pool = new Pool(event.params.pool.toHexString());
  // Pool constants set
  pool.borrower = event.params.borrower.toHexString();
  pool.borrowAmountRequested = poolConstants.value1;
  pool.minborrowAmount = poolConstants.value2;
  //minborrowAmount missing
  pool.loanStartTime = poolConstants.value3;
  pool.loanWithdrawalDeadline =  poolConstants.value4;
  pool.borrowAsset = poolConstants.value5;
  pool.idealCollateralRatio = poolConstants.value6;
  pool.borrowRate = poolConstants.value7;
  pool.noOfRepaymentIntervals = poolConstants.value8
  pool.repaymentInterval = poolConstants.value9;  
  pool.collateralAsset = poolConstants.value10;
  pool.poolSavingsStrategy = poolConstants.value11;
  
  
  // pool variables set
  pool.baseLiquidityShares = BIGINT_ZERO;
  pool.extraLiquidityShares = BIGINT_ZERO;
  pool.loanStatus  = getLoanStatus(0)
  pool.noOfGracePeriodsTaken = BIGINT_ZERO;
  pool.nextDuePeriod = BIGINT_ZERO;

  pool.published = event.block.timestamp;
  pool.lentAmount = new BigInt(0);
  pool.tokenImpl = event.params.poolToken.toHexString()
  pool.nextDueTime = nextDueTime;
  // createUser(event.params.borrower)

  pool.save()


  // TODO: Change this
  // pool.lendingRate = BIGINT_ZERO;
  // pool.loanDuration = BIGINT_ZERO;

  // // pool.lentAmount = BIGINT_ZERO;
  // // pool.borrowedAmount = BIGINT_ZERO;
  // pool.amountRepaid = BIGINT_ZERO;
  // // pool.collateralCalls = BIGINT_ZERO;
  // pool.borrowAmountRequested = BIGINT_ZERO 
  // pool.minborrowAmountFraction = BIGINT_ZERO
  // pool.matchCollateralRatioEndTime = BIGINT_ZERO
  
  // pool.investedTo = event.params.pool
  // pool.collateralAsset =  event.params.pool
  // pool.lendingRate = BIGINT_ZERO
  // pool.borrowRate = BIGINT_ZERO
  // pool.loanDuration = BIGINT_ZERO
  // pool.collateralRatio = BIGINT_ZERO
  // // pool.nextRepayTime = poolVars.value4;
  // // pool.loanStatus = getLoanStatus(poolVars.value2);
  // pool.baseLiquidityShares = BIGINT_ZERO
  // pool.extraLiquidityShares = BIGINT_ZERO
  // pool.noOfGracePeriodsTaken = BIGINT_ZERO
  // pool.nextDuePeriod = BIGINT_ZERO
}

export function handleOwnershipTransferred(
  event: OwnershipTransferred
): void {
  let gPoolDetails = GlobalPoolDetail.load("0")
  if (gPoolDetails == null){
    gPoolDetails = new GlobalPoolDetail("0");
  } 
  let poolFactoryContract = PoolFactory.bind(
    event.address
  );

  gPoolDetails.admin = event.params.newOwner.toHexString()
  gPoolDetails.collectionPeriod = poolFactoryContract.collectionPeriod()
  gPoolDetails.matchCollateralRatioInterval = poolFactoryContract.matchCollateralRatioInterval()
  gPoolDetails.marginCallDuration = poolFactoryContract.marginCallDuration()
  gPoolDetails.collateralVolatilityThreshold = poolFactoryContract.collateralVolatilityThreshold()
  gPoolDetails.gracePeriodPenaltyFraction = poolFactoryContract.gracePeriodPenaltyFraction()
  gPoolDetails.liquidatorRewardFraction = poolFactoryContract.liquidatorRewardFraction()
  gPoolDetails.votingPassRatio = poolFactoryContract.votingPassRatio()

  gPoolDetails.save()
}

export function handleCollectionPeriodUpdated(
  event: CollectionPeriodUpdated
): void {
  let gPoolDetails = GlobalPoolDetail.load("0");
  gPoolDetails.collectionPeriod = event.params.updatedCollectionPeriod;
  gPoolDetails.save();
}