import { PoolFactory } from '../generated/schema';
import {
  PoolCreated,
} from '../generated/PoolFactory/PoolFactory';

export function handlePoolCreated(
  event: PoolCreated
): void {
  
  let poolFactory = PoolFactory.load('0')
  if (poolFactory == null){
    poolFactory = new PoolFactory('0');
    poolFactory.pools = [];
    poolFactory.borrowers = []
  }
  let pools = poolFactory.pools
  pools.push(event.params.pool.toHexString());
  poolFactory.pools = pools
  let borrowers = poolFactory.borrowers
  borrowers.push(event.params.borrower.toHexString());
  poolFactory.borrowers = borrowers
  poolFactory.save()
}
