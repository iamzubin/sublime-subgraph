import { addVerifier, removeVerifier, createMasterAddress, removeMasterAddress, addLinkedAddress, removeLinkedAddress, updateActivationDelay } from "./helper";
import {
    AddressLinked,
    AddressUnlinked,
    UserRegistered,
    UserUnregistered,
    VerifierAdded,
    VerifierRemoved,
    Verification as VerificationContract
} from "../../generated/Verification/Verification";

export function handleAddressLinked(event: AddressLinked): void {
    let linkedAddress = event.params.linkedAddress;
    let masterAddress = event.params.masterAddress;
    addLinkedAddress(masterAddress,linkedAddress);
}

export function handleAddressUnlinked(event: AddressUnlinked): void {
    let unLinkedAddress = event.params.linkedAddress;
    let masterAddress = event.params.masterAddress;
    removeLinkedAddress(masterAddress,unLinkedAddress);
}

export function handleUserRegistered(event: UserRegistered): void {
    let RegisteredUser = event.params.masterAddress;
    let verifier = event.params.verifier;
    let link = event.params.isMasterLinked;
    createMasterAddress(RegisteredUser,verifier, link);
}

export function handleUserUnregistered(event: UserUnregistered): void {
    let unRegisteredUser = event.params.masterAddress;
    let verifier = event.params.verifier;
    let unregisteredBy = event.params.unregisteredBy;
    removeMasterAddress(unRegisteredUser,verifier);
}

export function handleVerifierAdded(event: VerifierAdded): void {
    let verifier = event.params.verifier;
    addVerifier(verifier);
}

export function handleVerifierRemoved(event: VerifierRemoved): void {
    let verifier = event.params.verifier;
    removeVerifier(verifier);
}

// export function handleAddressLinkingRequested(event: AddressLinkingRequested): void {
//     let linkedAddress = event.params.linkedAddress;
//     let masterAddress = event.params.masterAddress;
//     updateLinkedAddresses(masterAddress,linkedAddress,0);

// }

// export function handleAddressLinkingRequestCancelled(event: AddressLinkingRequestCancelled): void {
//     let linkedAddress = event.params.linkedAddress;
//     let masterAddress = event.params.masterAddress;
//     updateLinkedAddresses(masterAddress,linkedAddress,3);
// }

// export function handleActivationDelayUpdated(event: ActivationDelayUpdated): void {
//     let _delay = event.params.activationDelay;
//     updateActivationDelay(_delay);
// }
