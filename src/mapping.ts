import {
  DataSourceContext,Bytes,Address
} from "@graphprotocol/graph-ts";
import { Pool } from '../generated/schema';
import { BIGINT_ZERO, ZERO_ADDRESS } from "./utils/constants";
import {
  getLoanStatus,
  createUser,
} from "./utils/helpers";
import {
  Pool as PoolContract,
  Pool__poolVarsResult,
  Pool__poolConstantsResult,
} from '../generated/templates/Pool/Pool';
import {
  PoolCreated,
} from '../generated/PoolFactory/PoolFactory';
import { Pool as NewPool } from '../generated/templates';
let context = new DataSourceContext();

export function handlePoolCreated(
  event: PoolCreated
): void {
  let id = event.params.pool.toHexString();
  let pool = Pool.load(id);
  if (pool == null) {
    pool = new Pool(id);
    pool = new Pool(id);
  }
  pool.poolId = event.params.pool;
  pool.borrower = event.params.borrower.toHexString();
  // pool.isPrivate = false;

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

  // pool.borrowAsset = poolConstants.value5;
  pool.borrowAsset = Address.fromString(ZERO_ADDRESS);
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
  pool.borrowAmountRequested = BIGINT_ZERO; 
  pool.minborrowAmountFraction = BIGINT_ZERO;
  pool.matchCollateralRatioEndTime = BIGINT_ZERO;
  pool.noOfRepaymentIntervals = BIGINT_ZERO;
  pool.investedTo = event.params.pool;
  pool.collateralAsset =  event.params.pool;
  pool.lendingRate = BIGINT_ZERO;
  pool.borrowRate = BIGINT_ZERO;
  pool.loanDuration = BIGINT_ZERO;
  pool.collateralRatio = BIGINT_ZERO;
  // pool.nextRepayTime = poolVars.value4;
  pool.nextRepayTime = BIGINT_ZERO;
  // pool.loanStatus = getLoanStatus(poolVars.value2);
  pool.loanStatus = getLoanStatus(0);
  pool.baseLiquidityShares = BIGINT_ZERO;
  pool.extraLiquidityShares = BIGINT_ZERO;
  pool.noOfGracePeriodsTaken = BIGINT_ZERO;
  pool.nextDuePeriod = BIGINT_ZERO;
  // pool.collateralAmount = poolVars.value1;

  pool.save();
  
  NewPool.createWithContext(
    event.params.pool, context
  );

  createUser(event.params.borrower);
}
