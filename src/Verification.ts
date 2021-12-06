import { BigInt } from "@graphprotocol/graph-ts";
import { Address } from "@graphprotocol/graph-ts";

import { UserProfile, walletAddress } from "../generated/schema";

import {
    AddressLinked,
    AddressUnlinked,
    OwnershipTransferred,
    UserRegistered,
    UserUnregistered,
    VerifierAdded,
    VerifierRemoved,
    Verification as VerificationContract
} from "../generated/Verification/Verification";

import { VERIFICATION_ADDRESS } from "./contractAddresses";

let VerificationInstance = VerificationContract.bind(VERIFICATION_ADDRESS);

export function handleAddressLinked(event: AddressLinked): void {
    let linkedAddress = event.params.linkedAddress.toString();
    let masterAddress = event.params.masterAddress.toString();
    updateLinkedAddresses(masterAddress,linkedAddress, false);
}

export function handleAddressUnlinked(event: AddressUnlinked): void {
    let unLinkedAddress = event.params.linkedAddress.toString();
    let masterAddress = event.params.masterAddress.toString();
    updateLinkedAddresses(masterAddress,unLinkedAddress, false);
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
    let Owner = event.params.newOwner.toString();
    let previousOwner = event.params.previousOwner.toString();
}

export function handleUserRegistered(event: UserRegistered): void {
    let RegisteredUser = event.params.masterAddress.toString();
    let verifier = event.params.verifier.toString();
    updateMasterAddresses(RegisteredUser,verifier, false);
}

export function handleUserUnregistered(event: UserUnregistered): void {
    let unRegisteredUser = event.params.masterAddress.toString();
    let verifier = event.params.verifier.toString();
    updateMasterAddresses(unRegisteredUser,verifier,true);
}

export function handleVerifierAdded(event: VerifierAdded): void {
    let verifier = event.params.verifier.toString();
}

export function handleVerifierRemoved(event: VerifierRemoved): void {
    let verifier = event.params.verifier.toString();
}

// function updateVerifiers(UserId: string, Verifier: string): void{
//     let verifierAddress = Address.fromString(Verifier);
    
//     let userProfile = UserProfile.load(UserId)
//     if(!userProfile) {
//         userProfile = new UserProfile(UserId);
//     }

//     let _verifierUpdate = VerificationInstance.verifiers(verifierAddress); 
//     userProfile.verified = _verifierUpdate;
//     userProfile.save();
// }

// masterAddress -> verifier -> bool(isVerified)
function updateMasterAddresses(masterAddress: string, Verifier: string, Unregister: boolean): void {
    let verifierAddress = Address.fromString(Verifier);
    let _masterAddress = Address.fromString(masterAddress);
    let userProfile = UserProfile.load(masterAddress);
    let walletAddressSchema = walletAddress.load(masterAddress);
    if(Unregister) {
        // Have to remove the user info and wallet for the given ids
        // userProfile.unset("id");
    }

    if(!userProfile) {
        userProfile = new UserProfile(masterAddress);
    }

    if(!walletAddressSchema) {
        walletAddressSchema = new walletAddress(masterAddress);
    }

    let _masterUpdate = VerificationInstance.masterAddresses(_masterAddress, verifierAddress); 
    userProfile.twitterUsername = masterAddress; // dummy values
    userProfile.displayName = masterAddress; //dummy values
    userProfile.verified = _masterUpdate;

    let _walletList = userProfile.walletAddresses;
    _walletList.push(masterAddress);
    userProfile.walletAddresses = _walletList;

    walletAddressSchema.user = userProfile.id;
    
    userProfile.save();
    walletAddressSchema.save();
}

function updateLinkedAddresses(masterAddress: string, linkedAddress: string, Unlink: boolean): void {
    let _masterAddress = Address.fromString(masterAddress);
    let _linkedAddress = Address.fromString(linkedAddress);

    // Assuming user profile exists for given master address
    let user = UserProfile.load(masterAddress);

    if(Unlink) {
        // remove the wallet entry and remove the array item from user profile
    }
    
    let wallet = walletAddress.load(linkedAddress);
    if(!wallet) {
        wallet = new walletAddress(linkedAddress);
    }

    wallet.user = user.id;
    let walletList = user.walletAddresses;
    walletList.push(linkedAddress);
    user.walletAddresses = walletList;

    user.save();
    wallet.save();
}
