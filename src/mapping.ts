import { Pool, User, GlobalPoolDetail } from '../generated/schema';
import {
  PoolCreated, OwnershipTransferred, PoolFactory
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
  POOLFACTORY_ADDRESS, BIGINT_ZERO
} from "./utils/constants"
import {
  getLoanStatus, createUser
} from "./utils/helpers"


export function handlePoolCreated(
  event: PoolCreated
): void {
  let pool = Pool.load(event.params.pool.toHexString())
  if (pool == null){
    pool = new Pool(event.params.pool.toHexString());
  }
  let poolContract = PoolContract.bind(
    event.params.pool
  );
  // let resultVars = poolContract.try_poolVars();
  // // let resultConstants = poolContract.try_poolConstants();

  // let poolVars: Pool__poolVarsResult;
  // // let poolConstants: Pool__poolConstantsResult;

  // if (!resultVars.reverted) {
  //   poolVars = resultVars.value;
  // }
  // if (!resultConstants.reverted) {
  //   poolConstants = resultConstants.value;
  // }
  // let poolVars = resultVars.value;
  // let poolConstants = resultConstants.value;
  // pool.borrowAsset = poolConstants.value5;
  // pool.collateralAsset = poolConstants.value10;
  // pool.borrowRate = poolConstants.value7;
  // pool.collateralRatio = poolConstants.value6;
  // pool.loanStartTime = poolConstants.value3;

  // TODO: Change this
  pool.lendingRate = BIGINT_ZERO;
  pool.loanDuration = BIGINT_ZERO;

  // pool.lentAmount = BIGINT_ZERO;
  // pool.borrowedAmount = BIGINT_ZERO;
  pool.amountRepaid = BIGINT_ZERO;
  // pool.collateralCalls = BIGINT_ZERO;
  pool.borrowAmountRequested = BIGINT_ZERO 
  pool.minborrowAmountFraction = BIGINT_ZERO
  pool.matchCollateralRatioEndTime = BIGINT_ZERO
  pool.noOfRepaymentIntervals = BIGINT_ZERO
  pool.investedTo = event.params.pool
  pool.collateralAsset =  event.params.pool
  pool.lendingRate = BIGINT_ZERO
  pool.borrowRate = BIGINT_ZERO
  pool.loanDuration = BIGINT_ZERO
  pool.collateralRatio = BIGINT_ZERO
  // pool.nextRepayTime = poolVars.value4;
  // pool.loanStatus = getLoanStatus(poolVars.value2);
  pool.baseLiquidityShares = BIGINT_ZERO
  pool.extraLiquidityShares = BIGINT_ZERO
  pool.noOfGracePeriodsTaken = BIGINT_ZERO
  pool.nextDuePeriod = BIGINT_ZERO

  pool.borrower = event.params.borrower.toHexString();
  createUser(event.params.borrower)
  pool.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferred
): void {
  let gPoolDetails = GlobalPoolDetail.load("0")
  if (gPoolDetails == null){
    gPoolDetails = new GlobalPoolDetail("0");
  } 
  let poolFactoryContract = PoolFactory.bind(
    POOLFACTORY_ADDRESS
  );

  gPoolDetails.admin = event.params.newOwner.toHexString()
  gPoolDetails.collectionPeriod = poolFactoryContract.try_collectionPeriod().value
  gPoolDetails.matchCollateralRatioInterval = poolFactoryContract.try_matchCollateralRatioInterval().value
  gPoolDetails.marginCallDuration = poolFactoryContract.try_marginCallDuration().value
  gPoolDetails.collateralVolatilityThreshold = poolFactoryContract.try_collateralVolatilityThreshold().value
  gPoolDetails.gracePeriodPenaltyFraction = poolFactoryContract.try_gracePeriodPenaltyFraction().value
  gPoolDetails.liquidatorRewardFraction = poolFactoryContract.try_liquidatorRewardFraction().value
  gPoolDetails.votingPassRatio = poolFactoryContract.try_votingPassRatio().value
  gPoolDetails.gracePeriodFraction = poolFactoryContract.try_gracePeriodFraction().value

  gPoolDetails.save()
}
