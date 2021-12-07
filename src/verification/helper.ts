import { Address, store, BigInt } from "@graphprotocol/graph-ts";

import { UserProfile, verifier, walletAddress } from "../../generated/schema";

export function updateVerifiers(Verifier: Address, Remove: boolean): void{
    let _verifierAddress = Verifier.toHexString();
    let _verifier = verifier.load(_verifierAddress);

    if(Remove == true) {
        store.remove("verifier", _verifier.id);
        // TODO: Check what happens to user verified by this verifier
    }
    else {
        if(_verifier == null) {
            _verifier = new verifier(_verifierAddress);
        }
        _verifier.save();
    }
}

export function updateMasterAddresses(masterAddress: Address, Verifier: Address, Unregister: boolean): void {
    let _masterAddress = masterAddress.toHexString();
    let _verifierAddress = Verifier.toHexString();
    let _userProfile = UserProfile.load(_masterAddress);
    let _walletAddress = walletAddress.load(_masterAddress);
    let _verifier = verifier.load(_verifierAddress); // Assuming verifier exists

    if(Unregister == true) {
        store.remove("UserProfile", _userProfile.id);
        store.remove("walletAddress", _walletAddress.id);
    }
    else {
        if(_userProfile == null) {
            _userProfile = new UserProfile(_masterAddress);
        }
    
        if(_walletAddress == null) {
            _walletAddress = new walletAddress(_masterAddress);
        }
        
        _userProfile.twitterUsername = _masterAddress; // dummy values
        _userProfile.displayName = _masterAddress; //dummy values
        _userProfile.verified = !Unregister;
        _userProfile.verifiedBy = _verifier.id;
    
        let _walletList = _userProfile.walletAddresses;
        _walletList.push(_masterAddress);
        _userProfile.walletAddresses = _walletList;

        let _userList = _verifier.usersVerified;
        _userList.push(_userProfile.id);
        _verifier.usersVerified = _userList;
    
        _walletAddress.user = _userProfile.id;
        
        _userProfile.save();
        _walletAddress.save();
    }
}

export function updateLinkedAddresses(masterAddress: Address, linkedAddress: Address, Unlink: boolean): void {
    let _masterAddress = masterAddress.toHexString();
    let _linkedAddress = linkedAddress.toHexString();

    // Assuming user profile exists for given master address
    let _userProfile = UserProfile.load(_masterAddress);
    let _walletAddress = walletAddress.load(_linkedAddress);

    if(Unlink == true) {
        store.remove("walletAddress",_walletAddress.id);
        // TODO: remove the wallet address in the array of the user
    }
    else {
        if(_walletAddress == null) {
            _walletAddress = new walletAddress(_linkedAddress);
        }
    
        _walletAddress.user = _userProfile.id;
        let walletList = _userProfile.walletAddresses;
        walletList.push(_linkedAddress);
        _userProfile.walletAddresses = walletList;
    
        _userProfile.save();
        _walletAddress.save();
    }
}