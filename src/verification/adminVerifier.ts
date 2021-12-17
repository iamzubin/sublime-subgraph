import { updateMetadata } from "./helper";
import {
    UserRegistered,
    UserUnregistered,
    adminVerifier as adminVerifierContract
} from "../../generated/adminVerifier/adminVerifier";

export function handleUserRegisteredByAdmin(event: UserRegistered): void {
    let user = event.params.user;
    let metadata = event.params.metadata;

    let adminVerifierInstance = adminVerifierContract.bind(event.address);
    let verifier = adminVerifierInstance.owner();

    updateMetadata(user, verifier, metadata, false);

}

export function handleUserUnregisteredByAdmin(event: UserUnregistered): void {
    let user = event.params.user;

    let adminVerifierInstance = adminVerifierContract.bind(event.address);
    let verifier = adminVerifierInstance.owner();

    updateMetadata(user, verifier, "NULL", true);
}