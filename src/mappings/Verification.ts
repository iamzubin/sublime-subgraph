/*
import { UserProfile, WalletAddress, Identity } from '../../generated/schema';

import { UserRegistered, 
         UserDetailsUpdated, // SavingsAccount as savingsAccountContract 
         UserUnregistered } from '../../generated/verification/Verification';

import { BIGINT_ZERO,SAVINGS_ACCOUNT_ADDRESS} from "../utils/constants";
import { createUser,setTwitterDetails } from "../utils/helpers"
  
import { STATUS_UNVERIFIED, STATUS_VERIFIED } from '../utils/constants';


// Verification is the same as creating a new profile.
// There can be two kinds of registration, one for new users (users linking new addresses to new identities)
// or existing users integrating more identities to their existing profiles.
// handleUserRegistered() only handles new users, there exists no pre-existing UserProfile for them
export function handleUserRegistered(event: UserRegistered): void {

    let userID = event.params.user.toHexString() //user's primary wallet address

    let walletAddress = WalletAddress.load(userID)

    if (walletAddress == null) {
        // if walletAddress is null, this is a new wallet address
        walletAddress = new WalletAddress(userID)
    }

    let user = UserProfile.load(userID)

    if (user == null) {
        user = new UserProfile(userID)
    }

    walletAddress.owner = user.id //setting wallet owner as user profile

    // updating list of wallet addresses
    let walletAddressList = user.walletAddresses
    walletAddressList.push(walletAddress.id)
    user.walletAddresses = walletAddressList

    // updating identity integration
    let verificationMethod = 'twitter' // currently hardcoded, later will be a variable

    let identity = Identity.load(user.id.toString() + '_' + verificationMethod)

    if (identity == null) {
        identity = new Identity(user.id.toString() + '_' + verificationMethod)
        identity.verificationMethod = verificationMethod
        identity.userName = event.params.offChainDetails
        identity.userID = event.params.offChainDetails // currently the same as userName, to update once verification in smart contract is updated
        identity.owner = user.id
    }

    let identityList = user.identityIntegrations
    identityList.push(identity.id)
    user.identityIntegrations = identityList

    user.displayName = event.params.offChainDetails

    user.verified = true

    //user.status = STATUS_VERIFIED;
    user.save();
    walletAddress.save();
    identity.save();
}

export function handleUserDetailsUpdated(event: UserDetailsUpdated): void {

}

export function handleUserUnregistered(event: UserUnregistered): void {

}


    //setTwitterDetails(event.params.user, event.params.offChainDetails)

    // let depositId = D + event.params.asset.toHexString() + event.params.strategy.toHexString();
    // let savingDeposit = SavingsDeposit.load(depositId);

    // if (savingDeposit == null) {
    //     savingDeposit = new SavingsDeposit(depositId);
    //     savingDeposit.asset = event.params.asset;
    //     savingDeposit.strategy = event.params.strategy;
    //     savingDeposit.amount = BIGINT_ZERO;
    //     savingDeposit.liquidityShare = BIGINT_ZERO;
    //     savingDeposit.savingAccount = userID;
    // }
    // savingDeposit.liquidityShare = savingAccountContract.userLockedBalance(event.params.user, event.params.asset, event.params.strategy);
    
    // savingDeposit.amount = savingDeposit.amount.plus(
    //     event.params.amount
    // );
    */