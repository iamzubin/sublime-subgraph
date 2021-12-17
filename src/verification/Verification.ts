import { updateVerifiers, updateMasterAddresses, updateLinkedAddresses, updateActivationDelay } from "./helper";
import {
    AddressLinked,
    AddressUnlinked,
    OwnershipTransferred,
    UserRegistered,
    UserUnregistered,
    VerifierAdded,
    VerifierRemoved,
    AddressLinkingRequested,
    AddressLinkingRequestCancelled,
    ActivationDelayUpdated,
    Verification as VerificationContract
} from "../../generated/Verification/Verification";

export function handleAddressLinked(event: AddressLinked): void {
    let linkedAddress = event.params.linkedAddress;
    let masterAddress = event.params.masterAddress;
    updateLinkedAddresses(masterAddress,linkedAddress, 1);
}

export function handleAddressUnlinked(event: AddressUnlinked): void {
    let unLinkedAddress = event.params.linkedAddress;
    let masterAddress = event.params.masterAddress;
    updateLinkedAddresses(masterAddress,unLinkedAddress, 4);
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
