import { Bytes } from "@graphprotocol/graph-ts";
import { User } from "../../generated/schema";
import {
    LOAN_STATUS_ACTIVE,
    LOAN_STATUS_CLOSED,
    LOAN_STATUS_DEFAULTED,
    LOAN_STATUS_CANCELLED,
    LOAN_STATUS_TERMINATED,
    LOAN_STATUS_COLLECTION,
    STATUS_UNVERIFIED,
} from './constants';

export function getLoanStatus(
    value: i32
): string {
    switch (value) {
        case 0:
            return LOAN_STATUS_COLLECTION;
        case 1:
            return LOAN_STATUS_ACTIVE;
        case 2:
            return LOAN_STATUS_CLOSED;
        case 3:
            return LOAN_STATUS_CANCELLED;
        case 4:
            return LOAN_STATUS_DEFAULTED;
        case 5:
            return LOAN_STATUS_TERMINATED;
        default:
            return LOAN_STATUS_DEFAULTED;
    }
}

export function createUser(
    userAddress: Bytes,
): void {
    let userId = userAddress.toHexString()
    let user = User.load(userId);

    if (user == null) {
        user = new User(userId);
        user.address = userAddress;
        user.savingAccount = userId;
        user.status = STATUS_UNVERIFIED;
    }

    user.save();
}
