import { Pool } from '../generated/schema';
import {
  PoolCreated,
} from '../generated/PoolFactory/PoolFactory';
export function handlePoolCreated(
  event: PoolCreated
): void {
  let pool = Pool.load(event.params.pool.toHexString())
  if (pool == null){
    pool = new Pool(event.params.pool.toHexString());
  }
  pool.borrower = event.params.borrower.toHexString();
  pool.save()
}
