import {
    TwitterDetails, User,
} from '../../generated/schema';

import {
    UserRegistered,
    UserDetailsUpdated,
    UserUnregistered
    // SavingsAccount as savingsAccountContract
} from '../../generated/verification/Verification';

import { BIGINT_ZERO,SAVINGS_ACCOUNT_ADDRESS} from "../utils/constants";
import {
    createUser,setTwitterDetails
  } from "./../utils/helpers"
  
  import {
    STATUS_UNVERIFIED,
    STATUS_VERIFIED
} from './../utils/constants';


export function handleUserRegistered(
    event: UserRegistered
): void {
    let userId = event.params.user.toHexString();
    let user = User.load(userId);

    if (user == null) {
        user = new User(userId);
        user.id = userId;
    }

    user.status = STATUS_VERIFIED;
    setTwitterDetails(event.params.user.toHexString(),event.params.offChainDetails.toHexString())

    // let depositId = userId + event.params.asset.toHexString() + event.params.strategy.toHexString();
    // let savingDeposit = SavingsDeposit.load(depositId);

    // if (savingDeposit == null) {
    //     savingDeposit = new SavingsDeposit(depositId);
    //     savingDeposit.asset = event.params.asset;
    //     savingDeposit.strategy = event.params.strategy;
    //     savingDeposit.amount = BIGINT_ZERO;
    //     savingDeposit.liquidityShare = BIGINT_ZERO;
    //     savingDeposit.savingAccount = userId;
    // }
    // savingDeposit.liquidityShare = savingAccountContract.userLockedBalance(event.params.user, event.params.asset, event.params.strategy);
    
    // savingDeposit.amount = savingDeposit.amount.plus(
    //     event.params.amount
    // );
    user.save();
}