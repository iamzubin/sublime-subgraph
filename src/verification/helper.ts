import { Address, store, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { UserMetadataPerVerifier, UserProfile, verifier, walletAddr, VerificationGlobalParam } from "../../generated/schema";
import { Verification } from "../../generated/Verification/Verification";

export function addVerifier(verifierAddress: Address): void {
  let verifierAddr = verifierAddress.toHexString();
  let _verifier = verifier.load(verifierAddr);

  if (_verifier == null) {
    _verifier = new verifier(verifierAddr);
  }

  _verifier.status = "VALID";
  _verifier.save();
}

export function removeVerifier(verifierAddress: Address): void {
  let verifierAddr = verifierAddress.toHexString();
  let _verifier = verifier.load(verifierAddr);

  if (_verifier == null) {
    throw new Error("Verifier does not exist.");
  }

  // if(_verifier.usersVerified != null) {
  //     let _verifiedUsers = _verifier.usersVerified;
  //     for(let i = 0; i < _verifiedUsers.length; i++) {
  //         let _user = _verifiedUsers[i].toString();
  //         let _userMetadata = UserMetadataPerVerifier.load(_user);
  //         store.remove("UserMetadataPerVerifier",_userMetadata.id);
  //     }
  // }
  _verifier.status = "INVALID";
  _verifier.save();
}

export function createMasterAddress(masterAddress: Address, verifierAddress: Address, link: boolean): void {
  let masterAddr = masterAddress.toHexString();
  let verifierAddr = verifierAddress.toHexString();

  let _userProfile = UserProfile.load(masterAddr);
  let _walletAddress = walletAddr.load(masterAddr);
  let _verifier = verifier.load(verifierAddr); // Assuming verifier exists

  if (_userProfile == null) {
    _userProfile = new UserProfile(masterAddr);
  }

  let userID = _verifier.id + "_" + _userProfile.id;
  let _userMetadata = UserMetadataPerVerifier.load(userID);
  if (_userMetadata == null) {
    _userMetadata = new UserMetadataPerVerifier(userID);
  }

  _userMetadata.userID = _userProfile.id;
  _userMetadata.verifier = "Twitter";
  _userMetadata.verifiedBy = _verifier.id;

  if (link == true) {
    if (_walletAddress == null) {
      _walletAddress = new walletAddr(masterAddr);
      _walletAddress.user = _userProfile.id;
      _walletAddress.linkStatus = "MASTER";
    }
  }
  _userProfile.masterAddress = masterAddr;

  _userProfile.save();
  _userMetadata.save();
  _walletAddress.save();
}

export function removeMasterAddress(masterAddress: Address, verifierAddress: Address): void {
  let masterAddr = masterAddress.toHexString();
  let verifierAddr = verifierAddress.toHexString();

  let _userProfile = UserProfile.load(masterAddr);
  let _walletAddress = walletAddr.load(masterAddr);
  let _verifier = verifier.load(verifierAddr); // Assuming verifier exists

  if (_userProfile == null) {
    throw new Error("User profile does not exist.");
  }

  if (_walletAddress != null) {
    // wallet Address might not exist for every user profile
    store.remove("walletAddr", _walletAddress.id);
  }

  let _userID = _verifier.id + "_" + _userProfile.id;
  let _userMetadata = UserMetadataPerVerifier.load(_userID);
  if (_userMetadata != null) {
    store.remove("UserMetadataPerVerifier", _userMetadata.id);
  }

  store.remove("UserProfile", _userProfile.id);
}

export function addLinkedAddress(masterAddress: Address, linkedAddress: Address): void {
  let masterAddr = masterAddress.toHexString();
  let linkedAddr = linkedAddress.toHexString();

  // Assuming user profile exists for given master address
  let _userProfile = UserProfile.load(masterAddr);
  let _walletAddress = walletAddr.load(linkedAddr);

  if (_walletAddress == null) {
    _walletAddress = new walletAddr(linkedAddr);
  }

  if (_userProfile == null) {
    _userProfile = new UserProfile(masterAddr);
    _userProfile.masterAddress = masterAddr;
  }
  _walletAddress.user = _userProfile.id;

  _walletAddress.linkStatus = "LINKED";

  _userProfile.save();
  _walletAddress.save();
}

export function removeLinkedAddress(masterAddress: Address, linkedAddress: Address): void {
  let masterAddr = masterAddress.toHexString();
  let linkedAddr = linkedAddress.toHexString();

  // Assuming user profile exists for given master address
  let _userProfile = UserProfile.load(masterAddr);
  let _walletAddress = walletAddr.load(linkedAddr);

  if (_walletAddress == null) {
    throw new Error("Address does not exist.");
  }

  let walletList = _userProfile.walletAddresses;
  let index = walletList.indexOf(_walletAddress.id);
  walletList.splice(index, 1);
  _userProfile.walletAddresses = walletList;

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
  let userAddress = user.toHexString();
  let verifierAddr = verifier.toHexString();
  let userID = verifierAddr + "_" + userAddress;
  let _userMetadata = UserMetadataPerVerifier.load(userID);

  _userMetadata.metadata = metadata.toString();

  _userMetadata.save();
}
