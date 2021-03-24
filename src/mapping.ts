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
  }
  poolFactory.pools.push(event.params.pool);
  poolFactory.borrowers.push(event.params.borrower);
  poolFactory.save()
}
