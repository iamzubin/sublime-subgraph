import { Bytes } from "@graphprotocol/graph-ts";
import { User } from "../../generated/schema";
import {
    LOAN_STATUS_ACTIVE,
    LOAN_STATUS_CLOSED,
    LOAN_STATUS_DEFAULTED,
    LOAN_STATUS_CANCELLED,
    LOAN_STATUS_INACTIVE,
    LOAN_STATUS_TERMINATED,
    STATUS_UNVERIFIED,
} from './constants';

export function getLoanStatus(
    value: Bytes
): string {
    switch (value.toU32()) {
        case 0:
            return LOAN_STATUS_INACTIVE;
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

export function updateUserPools(
    userAddress: Bytes,
    poolId: string,
    action: string,
    poolType: string,
): void {
    let userId = userAddress.toHexString()
    let user = User.load(userId);

    if (user == null) {
        user = new User(userId);
        user.address = userAddress;
        user.lendingPools = [];
        user.borrowingPools = [];
        user.status = STATUS_UNVERIFIED;
    }

    if (action == "created" || action == "supplied") {
        if (poolType == "borrow-pool") {
            let borrowingPools = user.borrowingPools;
            borrowingPools.push(poolId);
            user.borrowingPools = borrowingPools;
        } else if (poolType == "lending-pool") {
            let lendingPools = user.lendingPools;
            lendingPools.push(poolId);
            user.lendingPools = lendingPools;
        }
    }

    user.save();
}
