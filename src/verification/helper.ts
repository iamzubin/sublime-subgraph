import { Address, store, BigInt, Bytes } from "@graphprotocol/graph-ts";

import { UserMetadataPerVerifier, UserProfile, verifier, walletAddress } from "../../generated/schema";

let Activation_Delay: BigInt;

export function updateVerifiers(Verifier: Address, Remove: boolean): void{
    let _verifierAddress = Verifier.toHexString();
    let _verifier = verifier.load(_verifierAddress);

    if(Remove == true) {
        if(_verifier == null) {
            return;
        }
        // if(_verifier.usersVerified != null) {
        //     let _verifiedUsers = _verifier.usersVerified;
        //     for(let i = 0; i < _verifiedUsers.length; i++) {
        //         let _user = _verifiedUsers[i].toString();
        //         let _userMetadata = UserMetadataPerVerifier.load(_user);
        //         store.remove("UserMetadataPerVerifier",_userMetadata.id);
        //     }
        // }
        store.remove("verifier", _verifier.id);
    }
    else {
        if(_verifier == null) {
            _verifier = new verifier(_verifierAddress);
        }
        _verifier.save();
    }
}

export function updateMasterAddresses(masterAddress: Address, Verifier: Address, link: boolean, Unregister: boolean): void {
    let _masterAddress = masterAddress.toHexString();
    let _verifierAddress = Verifier.toHexString();

    let _userProfile = UserProfile.load(_masterAddress);
    let _walletAddress = walletAddress.load(_masterAddress);
    let _verifier = verifier.load(_verifierAddress); // Assuming verifier exists

    if(Unregister == true) {
        if(_userProfile == null) {
            return
        }
        if(_verifier != null) {
            let _userID = _verifier.id + '_' + _userProfile.id;
            let _userMetadata = UserMetadataPerVerifier.load(_userID);
            if(_userMetadata != null) {
            store.remove("UserMetadataPerVerifier", _userMetadata.id);
            }
        }
        store.remove("UserProfile", _userProfile.id);
        store.remove("walletAddress", _walletAddress.id);
    }
    else {
        if(_userProfile == null) {
            _userProfile = new UserProfile(_masterAddress);
        }

        let _userID = _verifier.id + '_' + _userProfile.id;
        let _userMetadata = UserMetadataPerVerifier.load(_userID);
        if(_userMetadata == null) {
            _userMetadata = new UserMetadataPerVerifier(_userID);
        }

        _userMetadata.userID = _userProfile.id;
        _userMetadata.verifier = "Twitter";
        _userMetadata.verifiedBy = _verifier.id;

        if(link == true) {
            if(_walletAddress == null) {
                _walletAddress = new walletAddress(_masterAddress);
                _walletAddress.user = _userProfile.id;
                _walletAddress.linkStatus = "MASTER";
            }
        }
        _userProfile.masterAddress = _masterAddress;
    
        _userProfile.save();
        _verifier.save();
        _userMetadata.save();
        _walletAddress.save();
    }
}

export function updateLinkedAddresses(masterAddress: Address, linkedAddress: Address, linkStatusCode: i32): void {
    let _masterAddress = masterAddress.toHexString();
    let _linkedAddress = linkedAddress.toHexString();

    // Assuming user profile exists for given master address
    let _userProfile = UserProfile.load(_masterAddress);
    let _walletAddress = walletAddress.load(_linkedAddress);

    let linkStatus = getAddressLinkStatus(linkStatusCode);

    if(linkStatus == "UNLINK") {
        if(_userProfile != null && _walletAddress != null) {
            let _walletList = _userProfile.walletAddresses;
            let index = _walletList.indexOf(_walletAddress.id);
            _walletList.splice(index, 1);
            _userProfile.walletAddresses = _walletList;
            _userProfile.save();
            store.remove("walletAddress",_walletAddress.id);
        }
        else {
            return;
        }
    }
    else if(linkStatus == "LINK") {
        if(_walletAddress == null) {
            _walletAddress = new walletAddress(_linkedAddress);
        }
    
        if(_userProfile == null) {
            _userProfile = new UserProfile(_masterAddress);
            _userProfile.masterAddress = _masterAddress;
        }
        _walletAddress.user = _userProfile.id;

        _walletAddress.linkStatus = "LINKED";
    
        _userProfile.save();
        _walletAddress.save();
    }
    // else if(linkStatus == "REQUEST") {
    //     if(_walletAddress == null) {
    //         _walletAddress = new walletAddress(_linkedAddress);
    //     }
    //     _walletAddress.linkStatus = "REQUESTED";
    //     _walletAddress.activationDelay = Activation_Delay;
    
    //     _walletAddress.save();
    // }
    // else if(linkStatus == "CANCEL") {
    //     if(_walletAddress == null) {
    //         _walletAddress = new walletAddress(_linkedAddress);
    //     }
    //     _walletAddress.linkStatus = "CANCELLED";
    //     _walletAddress.activationDelay = Activation_Delay;
    
    //     _walletAddress.save();
    // }
}

export function getAddressLinkStatus(value: i32): string {
    switch (value) {
      case 0:
        return "LINK";
      case 1:
        return "MASTER";
      default:
        return "UNLINK";
    }
}

export function updateActivationDelay(value: BigInt): void {
    Activation_Delay = value;
}

export function updateMetadata(user: Address, verifier: Address, metadata: String, Unregister: boolean): void {
    let _userAddress = user.toHexString();
    let _verifier = verifier.toHexString();
    let _userProfile = UserProfile.load(_userAddress);

    if(Unregister == true){
        if(_userProfile == null) {
            return;
        }
        else {
            store.remove("UserProfile", _userProfile.id);
        }
    }
    else {
        let _userID = _verifier + '_' + _userProfile.id;
        let _userMetadata = UserMetadataPerVerifier.load(_userID);

        if(_userMetadata == null) {
            _userMetadata = new UserMetadataPerVerifier(_userID);
            _userMetadata.verifier = "Twitter";
            _userMetadata.userID = _userProfile.id;
            _userMetadata.verifiedBy = _verifier;
        }
        _userMetadata.metadata = metadata.toString();

        _userMetadata.save();
        _userProfile.save();
    }
}
