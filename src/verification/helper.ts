import { Address, store, BigInt } from "@graphprotocol/graph-ts";

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

export function updateMasterAddresses(masterAddress: Address, Verifier: Address, Unregister: boolean): void {
    let _masterAddress = masterAddress.toHexString();
    let _verifierAddress = Verifier.toHexString();

    let _userProfile = UserProfile.load(_masterAddress);
    let _walletAddress = walletAddress.load(_masterAddress);
    let _verifier = verifier.load(_verifierAddress); // Assuming verifier exists

    if(Unregister == true) {
        // If userProfile exists
        if(_userProfile != null && _walletAddress != null) {
            // If userProfile is verified
            if(_verifier != null) { 
                let _userID = _verifier.id + '_' + _userProfile.id;
                let _userMetadata = UserMetadataPerVerifier.load(_userID);
                if(_userMetadata != null) {
                    store.remove("UserMetadata", _userMetadata.id);
                }
            }
            store.remove("UserProfile", _userProfile.id);
            store.remove("walletAddress", _walletAddress.id);
        }
        else {
            return;
        }
    }
    else {
        if(_userProfile == null) {
            _userProfile = new UserProfile(_masterAddress);
        }
    
        if(_walletAddress == null) {
            _walletAddress = new walletAddress(_masterAddress);
        }

        let _userID = _verifier.id + '_' + _userProfile.id;
        let _userMetadata = UserMetadataPerVerifier.load(_userID);
        if(_userMetadata == null) {
            _userMetadata = new UserMetadataPerVerifier(_userID);
        }

        _userMetadata.userID = _userProfile.id;
        _userMetadata.verifier = "Twitter"; // Assuming only twitter as of now
        _userMetadata.verifiedBy = _verifier.id;

        _userProfile.masterAddress = _masterAddress;

        // let _metadataList = _userProfile.userMetadataPerVerifier;
        // _metadataList.push(_userMetadata.id);
        // _userProfile.userMetadataPerVerifier = _metadataList;

        // let _verifierList = _userProfile.verifiedBy;
        // _verifierList.push(_verifier.id);
        // _userProfile.verifiedBy = _verifierList;

        // let _walletList = _userProfile.walletAddresses;
        // _walletList.push(_masterAddress);
        // _userProfile.walletAddresses = _walletList;

        // let _userList = _verifier.usersVerified;
        // _userList.push(_userMetadata.id);
        // _verifier.usersVerified = _userList;
    
        _walletAddress.user = _userProfile.id;
        _walletAddress.linkStatus = "MASTER";
        
        _userProfile.save();
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
    
        _walletAddress.user = _userProfile.id;
        let walletList = _userProfile.walletAddresses;
        walletList.push(_linkedAddress);
        _userProfile.walletAddresses = walletList;
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
