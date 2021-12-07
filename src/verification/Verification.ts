import { updateVerifiers, updateMasterAddresses, updateLinkedAddresses } from "./helper";
import {
    AddressLinked,
    AddressUnlinked,
    OwnershipTransferred,
    UserRegistered,
    UserUnregistered,
    VerifierAdded,
    VerifierRemoved,
    Verification as VerificationContract
} from "../../generated/Verification/Verification";

export function handleAddressLinked(event: AddressLinked): void {
    let linkedAddress = event.params.linkedAddress;
    let masterAddress = event.params.masterAddress;
    updateLinkedAddresses(masterAddress,linkedAddress, false);
}

export function handleAddressUnlinked(event: AddressUnlinked): void {
    let unLinkedAddress = event.params.linkedAddress;
    let masterAddress = event.params.masterAddress;
    updateLinkedAddresses(masterAddress,unLinkedAddress, true);
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
    let Owner = event.params.newOwner;
    let previousOwner = event.params.previousOwner;
}

export function handleUserRegistered(event: UserRegistered): void {
    let RegisteredUser = event.params.masterAddress;
    let verifier = event.params.verifier;
    updateMasterAddresses(RegisteredUser,verifier, false);
}

export function handleUserUnregistered(event: UserUnregistered): void {
    let unRegisteredUser = event.params.masterAddress;
    let verifier = event.params.verifier;
    updateMasterAddresses(unRegisteredUser,verifier,true);
}

export function handleVerifierAdded(event: VerifierAdded): void {
    let verifier = event.params.verifier;
    updateVerifiers(verifier,false);
}

export function handleVerifierRemoved(event: VerifierRemoved): void {
    let verifier = event.params.verifier;
    updateVerifiers(verifier,true);
}
