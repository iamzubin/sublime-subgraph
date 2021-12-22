import { updateMetadata } from "./helper";
import {
    UserRegistered,
    UserUnregistered,
    adminVerifier as adminVerifierContract
} from "../../generated/adminVerifier/adminVerifier";

export function handleUserRegisteredByAdmin(event: UserRegistered): void {
    let user = event.params.user;
    let metadata = event.params.metadata;
    let verifier = event.address;

    updateMetadata(user, verifier, metadata);

}

// export function handleUserUnregisteredByAdmin(event: UserUnregistered): void {
//     let user = event.params.user;
//     let verifier = event.address;
// }