import { Address, store, BigInt, Bytes } from "@graphprotocol/graph-ts";

import { UserMetadataPerVerifier, UserProfile, verifier, walletAddr, VerificationGlobalParam } from "../../generated/schema";
import { Verification } from "../../generated/Verification/Verification";

export function addVerifier(Verifier: Address): void {
  let _verifierAddress = Verifier.toHexString();
  let _verifier = verifier.load(_verifierAddress);

  if (_verifier == null) {
    _verifier = new verifier(_verifierAddress);
  }

  _verifier.save();
}

export function removeVerifier(Verifier: Address): void {
  let _verifierAddress = Verifier.toHexString();
  let _verifier = verifier.load(_verifierAddress);

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

export function createMasterAddress(masterAddress: Address, Verifier: Address, link: boolean): void {
  let _masterAddress = masterAddress.toHexString();
  let _verifierAddress = Verifier.toHexString();

  let _userProfile = UserProfile.load(_masterAddress);
  let _walletAddress = walletAddr.load(_masterAddress);
  let _verifier = verifier.load(_verifierAddress); // Assuming verifier exists

  if (_userProfile == null) {
    _userProfile = new UserProfile(_masterAddress);
  }

  let _userID = _verifier.id + "_" + _userProfile.id;
  let _userMetadata = UserMetadataPerVerifier.load(_userID);
  if (_userMetadata == null) {
    _userMetadata = new UserMetadataPerVerifier(_userID);
  }

  _userMetadata.userID = _userProfile.id;
  _userMetadata.verifier = "Twitter";
  _userMetadata.verifiedBy = _verifier.id;

  if (link == true) {
    if (_walletAddress == null) {
      _walletAddress = new walletAddr(_masterAddress);
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

export function removeMasterAddress(masterAddress: Address, Verifier: Address): void {
  let _masterAddress = masterAddress.toHexString();
  let _verifierAddress = Verifier.toHexString();

  let _userProfile = UserProfile.load(_masterAddress);
  let _walletAddress = walletAddr.load(_masterAddress);
  let _verifier = verifier.load(_verifierAddress); // Assuming verifier exists

  if (_verifier != null) {
    let _userID = _verifier.id + "_" + _userProfile.id;
    let _userMetadata = UserMetadataPerVerifier.load(_userID);
    if (_userMetadata != null) {
      store.remove("UserMetadataPerVerifier", _userMetadata.id);
    }
  }
  store.remove("UserProfile", _userProfile.id);
  store.remove("walletAddr", _walletAddress.id);
}

export function addLinkedAddress(masterAddress: Address, linkedAddress: Address): void {
  let _masterAddress = masterAddress.toHexString();
  let _linkedAddress = linkedAddress.toHexString();

  // Assuming user profile exists for given master address
  let _userProfile = UserProfile.load(_masterAddress);
  let _walletAddress = walletAddr.load(_linkedAddress);

  if (_walletAddress == null) {
    _walletAddress = new walletAddr(_linkedAddress);
  }

  if (_userProfile == null) {
    _userProfile = new UserProfile(_masterAddress);
    _userProfile.masterAddress = _masterAddress;
  }
  _walletAddress.user = _userProfile.id;

  _walletAddress.linkStatus = "LINKED";

  _userProfile.save();
  _walletAddress.save();
}

export function removeLinkedAddress(masterAddress: Address, linkedAddress: Address): void {
  let _masterAddress = masterAddress.toHexString();
  let _linkedAddress = linkedAddress.toHexString();

  // Assuming user profile exists for given master address
  let _userProfile = UserProfile.load(_masterAddress);
  let _walletAddress = walletAddr.load(_linkedAddress);

  let _walletList = _userProfile.walletAddresses;
  let index = _walletList.indexOf(_walletAddress.id);
  _walletList.splice(index, 1);
  _userProfile.walletAddresses = _walletList;
  _userProfile.save();
  store.remove("walletAddr", _walletAddress.id);
}

export function updateActivationDelay(value: BigInt): void {
  let _globalParams = VerificationGlobalParam.load("1");

  if (_globalParams == null) {
    _globalParams = new VerificationGlobalParam("1");
  }

  _globalParams.activationDelay = value;

  _globalParams.save();
}

export function updateMetadata(user: Address, verifier: Address, metadata: String): void {
  let _userAddress = user.toHexString();
  let _verifier = verifier.toHexString();
  let _userID = _verifier + "_" + _userAddress;
  let _userMetadata = UserMetadataPerVerifier.load(_userID);

  _userMetadata.metadata = metadata.toString();

  _userMetadata.save();
}
export function removeMetadata(user: Address, verifier: Address): void {
  let _userAddress = user.toHexString();
  let _verifier = verifier.toHexString();
  let _userID = _verifier + "_" + _userAddress;
  let _userMetadata = UserMetadataPerVerifier.load(_userID);
  _userMetadata.metadata = null
  _userMetadata.save();
}