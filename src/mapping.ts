import { Pool, User } from '../generated/schema';
import {
  PoolCreated,
} from '../generated/PoolFactory/PoolFactory';
import {
  Pool as PoolContract,
  Pool__poolVarsResult,
  Pool__poolConstantsResult,
} from '../generated/templates/Pool/Pool';
import {
  BigInt
} from "@graphprotocol/graph-ts";
export function handlePoolCreated(
  event: PoolCreated
): void {
  let pool = Pool.load(event.params.pool.toHexString())
  if (pool == null){
    pool = new Pool(event.params.pool.toHexString());
    pool.details = new BigInt(0);
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
  pool.borrower = event.params.borrower.toHexString();
  let borrower = User.load(pool.borrower);
  if(borrower == null){
    borrower  = new User(pool.borrower);
  }
  // pool.details = poolVars.value4
  pool.details = new BigInt(1);
  borrower.save()
  pool.save()
}
