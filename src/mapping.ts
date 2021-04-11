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
  let resultVars = poolContract.try_poolVars();
  let resultConstants = poolContract.try_poolConstants();

  let poolVars: Pool__poolVarsResult;
  let poolConstants: Pool__poolConstantsResult;

  if (!resultVars.reverted) {
    poolVars = resultVars.value;
  }
  if (!resultConstants.reverted) {
    poolConstants = resultConstants.value;
  }
  poolVars = resultVars.value;
  poolConstants = resultConstants.value;


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
  pool.baseLiquidityShares = poolVars.value0;
  pool.extraLiquidityShares = poolVars.value1;
  pool.loanStatus  = getLoanStatus(poolVars.value2)
  pool.noOfGracePeriodsTaken = poolVars.value3;
  pool.nextDuePeriod = poolVars.value4;

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
