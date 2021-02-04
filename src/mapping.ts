import {
  Bytes, BigInt, store,
} from "@graphprotocol/graph-ts";
import {
  Pool, User, LendingDetail,
} from '../generated/schema';
import {
  POOL_FACTORY_ADDRSS,
  LOAN_STATUS_CLOSED,
  LOAN_STATUS_TERMINATED,
  LOAN_STATUS_CANCELLED,
} from "./utils/constants";
import {
  PoolCreated,
  openBorrowPoolClosed,
  openBorrowPoolTerminated,
  opneBorrowPoolCanceled,
  PoolFactory as PoolFactoryContract,
} from '../generated/PoolFactory/PoolFactory';
import { getLoanStatus } from "./utils/helpers";

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
  pool.poolOwner = event.params.poolCreator;

  let poolDetails = poolFactoryContract.getPoolDetails(
    event.params.poolHash
  );

  pool.borrowTokenType = poolDetails.value1;
  pool.collateralTokenType = poolDetails.value2;
  pool.interestRate = poolDetails.value3;
  pool.collateralRatio = poolDetails.value4;
  pool.loanStatus = getLoanStatus(
    poolDetails.value6 as Bytes
  );
  pool.isExtensionRequested = poolFactoryContract
    .getPoolDetails2(event.params.poolHash);

  pool.save();
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
