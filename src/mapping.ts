import {
  Bytes, store, DataSourceContext, Address,
} from "@graphprotocol/graph-ts";
import {
  Pool, LendingDetails, User, TwitterDetails,
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
  OpenBorrowPoolClosed,
  OpenBorrowPoolTerminated,
  OpenBorrowPoolCancelled,
  CollateralAdded,
  CollateralWithdrawn,
  liquiditySupplied,
  liquiditywithdrawn,
  CollateralCalled,
  AmountBorrowed,
  lenderVoted,
  MarginCallCollateralAdded,
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
  pool.poolOwner = event.params.borrower.toHexString();

  let poolContract = PoolContract.bind(
    Address.fromString(id),
  );

  // let poolDetails = poolContract.getPoolDetails(
  //   event.params.poolHash
  // );

  // pool.borrowTokenType = poolDetails.value1;
  // pool.collateralTokenType = poolDetails.value2;
  // pool.borrowRate = poolDetails.value3;
  // pool.collateralRatio = poolDetails.value4;
  // pool.colleteralDeposited = BIGINT_ZERO;
  // pool.isPrivate = false;
  // pool.loanStatus = getLoanStatus(
  //   poolDetails.value5 as Bytes
  // );
  // pool.extensionRequested = poolFactoryContract
  //   .getPoolDetails2(event.params.poolHash);

  pool.save();

  updateUserPools(
    event.params.borrower,
    event.params.pool.toHexString(),
    "created",
    "borrow-pool"
  );
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

  pool.colleteralDeposited = pool.collectedAmount
    .plus(event.params.amount);

  pool.save();
}

export function handleCollateralWithdrawn(
  event: CollateralWithdrawn
): void {
  let pool = Pool.load(
    event.transaction.to.toHexString()
  );

  pool.colleteralDeposited = pool.collectedAmount
    .minus(event.params.amount);

  pool.save();
}

// export function handleLockedCollateral(
//   event: LockedCollateral
// ): void {
//   let pool = Pool.load(
//     event.params.poolId.toHexString()
//   );

//   pool.vaultShares = pool.vaultShares
//     .plus(event.params.lpTokensReceived);

//   pool.save();
// }

// export function handleUnlockedCollateral(
//   event: UnlockedCollateral
// ): void {
//   let pool = Pool.load(
//     event.params.poolId.toHexString()
//   );

//   pool.vaultShares = pool.vaultShares
//     .minus(event.params.collateralReceived);

//   pool.save();
// }

// export function handleEntityAdded(
//   event: EntityAdded
// ): void {
//   let userId = event.params.entity.toHexString();
//   let twitterDetails = TwitterDetails.load(userId);

//   if (twitterDetails == null) {
//     twitterDetails.id = userId;
//     twitterDetails.twitterId = event.params.offChainDetails;
//     twitterDetails.twitterSignMessage = event.params
//       .offChainDetails.toHexString();
//     twitterDetails.timeRegistered = event.block.timestamp;
//     twitterDetails.save();
//   }

//   let user = User.load(userId);
//   user.twitterDetails = twitterDetails.id;
//   user.save();
// }

export function handleLiquiditySupplied(
  event: liquiditySupplied
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
  pool.collectedAmount = pool.collectedAmount
    .plus(event.params.amountSupplied);

  pool.save();
}

export function handleLiquiditywithdrawn(
  event: liquiditywithdrawn
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
  pool.collectedAmount = pool.collectedAmount
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
