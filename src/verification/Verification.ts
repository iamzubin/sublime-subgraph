import { updateVerifiers, updateMasterAddresses, updateLinkedAddresses, updateActivationDelay } from "./helper";
import {
    AddressLinked,
    AddressUnlinked,
    UserRegistered,
    UserUnregistered,
    VerifierAdded,
    VerifierRemoved,
    Verification as VerificationContract
} from "../../generated/Verification/Verification";

//0x0676bce87118f6bc18678afe9041333fabb7310b64b2b84e1eb505e82fb21d53522d72598fedc7d6d0d235a08ca96e481d214e4e766fa6ed6c37e8984bb70f171c

export function handleAddressLinked(event: AddressLinked): void {
    let linkedAddress = event.params.linkedAddress;
    let masterAddress = event.params.masterAddress;
    updateLinkedAddresses(masterAddress,linkedAddress, 0);
}

export function handleAddressUnlinked(event: AddressUnlinked): void {
    let unLinkedAddress = event.params.linkedAddress;
    let masterAddress = event.params.masterAddress;
    updateLinkedAddresses(masterAddress,unLinkedAddress, 4);
}

export function handleUserRegistered(event: UserRegistered): void {
    let RegisteredUser = event.params.masterAddress;
    let verifier = event.params.verifier;
    let link = event.params.isMasterLinked;
    updateMasterAddresses(RegisteredUser,verifier, link, false);
}

export function handleUserUnregistered(event: UserUnregistered): void {
    let unRegisteredUser = event.params.masterAddress;
    let verifier = event.params.verifier;
    let unregisteredBy = event.params.unregisteredBy;
    updateMasterAddresses(unRegisteredUser,verifier, true, true);
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
