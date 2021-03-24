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
  poolFactory.pools.push(event.params.pool.toHexString());
  poolFactory.borrowers.push(event.params.borrower.toHexString());
  poolFactory.save()
}
