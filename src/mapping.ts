import {
  Bytes, store,
} from "@graphprotocol/graph-ts";
import {
  Pool, LendingDetail,
} from '../generated/schema';
import {
  BIGINT_ZERO,
  POOL_FACTORY_ADDRSS,
  LOAN_STATUS_CLOSED,
  LOAN_STATUS_TERMINATED,
  LOAN_STATUS_CANCELLED,
} from "./utils/constants";
import {
  getLoanStatus,
  updateUserPools,
} from "./utils/helpers";
import {
  liquiditySupplied,
  liquiditywithdrawn,
  collateralRequested,
} from '../generated/Lender/Lender';
import {
  PoolCreated,
  openBorrowPoolClosed,
  openBorrowPoolTerminated,
  opneBorrowPoolCanceled,
  extraCollateralDeposited,
  withdrawnExtraCollateral,
  LockedCollateral,
  UnlockedCollateral,
  PoolFactory as PoolFactoryContract,
} from '../generated/PoolFactory/PoolFactory';

let poolFactoryContract = PoolFactoryContract.bind(
  POOL_FACTORY_ADDRSS,
);

export function handlePoolCreated(
  event: PoolCreated
): void {
  let id = event.params.poolHash.toHexString();
  let pool = Pool.load(id);
  if (pool == null) {
    pool = new Pool(id);
  }
  pool.poolId = event.params.poolHash;
  pool.poolOwner = event.params.poolCreator.toHexString();

  let poolDetails = poolFactoryContract.getPoolDetails(
    event.params.poolHash
  );

  pool.borrowTokenType = poolDetails.value1;
  pool.collateralTokenType = poolDetails.value2;
  pool.borrowRate = poolDetails.value3;
  pool.collateralRatio = poolDetails.value4;
  pool.colleteralDeposited = BIGINT_ZERO;
  pool.isPrivate = false;
  pool.loanStatus = getLoanStatus(
    poolDetails.value5 as Bytes
  );
  pool.extensionRequested = poolFactoryContract
    .getPoolDetails2(event.params.poolHash);

  pool.save();

  updateUserPools(
    event.params.poolCreator,
    event.params.poolHash.toHexString(),
    "created",
    "borrow-pool"
  );
}

export function handleOpenBorrowPoolClosed(
  event: openBorrowPoolClosed
): void {
  let pool = Pool.load(
    event.params.PoolHash.toHexString()
  );

  pool.loanStatus = LOAN_STATUS_CLOSED;
  pool.save();
}

export function handleOpenBorrowPoolTerminated(
  event: openBorrowPoolTerminated
): void {
  let pool = Pool.load(
    event.params.PoolHash.toHexString()
  );

  pool.loanStatus = LOAN_STATUS_TERMINATED;
  pool.save();
}

export function handleOpneBorrowPoolCanceled(
  event: opneBorrowPoolCanceled
): void {
  let pool = Pool.load(
    event.params.PoolHash.toHexString()
  );

  pool.loanStatus = LOAN_STATUS_CANCELLED;
  pool.save();
}

export function handleExtraCollateralDeposited(
  event: extraCollateralDeposited
): void {
  let pool = Pool.load(
    event.params.PoolHash.toHexString()
  );

  pool.colleteralDeposited = pool.collectedAmount
    .plus(event.params.ExtraCollateralAmount);

  pool.save();
}

export function handleWithdrawnExtraCollateral(
  event: withdrawnExtraCollateral
): void {
  let pool = Pool.load(
    event.params.poolHash.toHexString()
  );

  pool.colleteralDeposited = pool.collectedAmount
    .minus(event.params.WithDrawCollateralAmount);

  pool.save();
}

export function handleLockedCollateral(
  event: LockedCollateral
): void {
  let pool = Pool.load(
    event.params.poolId.toHexString()
  );

  pool.vaultShares = pool.vaultShares
    .plus(event.params.lpTokensReceived);

  pool.save();
}

export function handleUnlockedCollateral(
  event: UnlockedCollateral
): void {
  let pool = Pool.load(
    event.params.poolId.toHexString()
  );

  pool.vaultShares = pool.vaultShares
    .minus(event.params.collateralReceived);

  pool.save();
}

export function handleLiquiditySupplied(
  event: liquiditySupplied
): void {
  let lendingDetailId = event.params.poolId.toHexString() +
    event.params.lenderAddress.toHexString();

  let lendingDetail = LendingDetail.load(
    lendingDetailId
  );

  if (lendingDetail == null) {
    lendingDetail = new LendingDetail(lendingDetailId);
  }

  lendingDetail.pool = event.params.poolId.toHexString();
  lendingDetail.collateralCalled = false;
  lendingDetail.amountSupplied = lendingDetail
    .amountSupplied.plus(event.params.amountSupplied);

  lendingDetail.save();

  updateUserPools(
    event.params.lenderAddress,
    event.params.poolId.toHexString(),
    "supplied",
    "lending-pool"
  );

  let pool = Pool.load(event.params.poolId.toHexString());
  pool.collectedAmount = pool.collectedAmount
    .plus(event.params.amountSupplied);

  pool.save();
}

export function handleLiquiditywithdrawn(
  event: liquiditywithdrawn
): void {
  let lendingDetailId = event.params.poolId.toHexString() +
    event.params.lenderAddress.toHexString();

  let lendingDetail = LendingDetail.load(lendingDetailId);

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

  let pool = Pool.load(event.params.poolId.toHexString());
  pool.collectedAmount = pool.collectedAmount
    .minus(event.params.amount);

  pool.save();
}

export function handleCollateralRequested(
  event: collateralRequested
): void {
  let lendingDetailId = event.params.poolID.toHexString() +
    event.params.lenderAddress.toHexString();

  let lendingDetail = LendingDetail.load(lendingDetailId);
  lendingDetail.collateralCalled = true;
  lendingDetail.save();

  let pool = Pool.load(event.params.poolID.toHexString());
  pool.collateralCalls = pool.collateralCalls
    .plus(lendingDetail.amountSupplied);

  pool.save();
}
