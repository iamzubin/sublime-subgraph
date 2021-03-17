import {
  Address,
  DataSourceContext,
} from "@graphprotocol/graph-ts";
import { Pool } from '../generated/schema';
import { BIGINT_ZERO } from "./utils/constants";
import {
  getLoanStatus,
  updateUserPools,
} from "./utils/helpers";
import {
  Pool as PoolContract,
} from '../generated/templates/Pool/Pool';
import {
  PoolCreated,
} from '../generated/PoolFactory/PoolFactory';
import { Pool as NewPool } from '../generated/templates';
let context = new DataSourceContext();

export function handlePoolCreated(
  event: PoolCreated
): void {
  NewPool.createWithContext(
    event.params.pool, context
  );

  let id = event.params.pool.toHexString();
  let pool = Pool.load(id);
  if (pool == null) {
    pool = new Pool(id);
  }
  pool.poolId = event.params.pool;
  pool.borrower = event.params.borrower.toHexString();
  pool.isPrivate = false;

  let poolContract = PoolContract.bind(
    Address.fromString(id),
  );

  let poolVars = poolContract.poolVars();
  let poolContstants = poolContract.poolConstants();

  pool.borrowAsset = poolContstants.value5;
  pool.collateralAsset = poolContstants.value10;
  pool.borrowRate = poolContstants.value7;
  // pool.lendingRate = poolContstants.
  // pool.loanDuration = 
  pool.collateralRatio = poolContstants.value6;
  pool.loanStartTime = poolContstants.value3;
  pool.nextRepayTime = poolVars.value7;
  pool.loanStatus = getLoanStatus(poolVars.value3);
  pool.lentAmount = BIGINT_ZERO;
  pool.borrowedAmount = BIGINT_ZERO;
  pool.colleteralAmount = poolVars.value1;
  pool.amountRepaid = BIGINT_ZERO;
  pool.collateralCalls = BIGINT_ZERO;

  pool.save();

  updateUserPools(
    event.params.borrower,
    event.params.pool.toHexString(),
    "created",
    "borrow-pool"
  );
}
