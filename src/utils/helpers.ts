import { Bytes } from "@graphprotocol/graph-ts";
import { User, TwitterDetail } from "../../generated/schema";
import {
    LOAN_STATUS_ACTIVE,
    LOAN_STATUS_CLOSED,
    LOAN_STATUS_DEFAULTED,
    LOAN_STATUS_CANCELLED,
    LOAN_STATUS_TERMINATED,
    LOAN_STATUS_COLLECTION,
    STATUS_UNVERIFIED,
} from './constants';

export function getCreditLineStatus(
    value: i32
): string {
    switch (value) {
        case 0:
            return "NOT_CREATED"
        case 1:
            return "REQUESTED";
        case 1:
            return "ACTIVE";
        case 2:
            return "CLOSED";
        case 3:
            return "CANCELLED";
        case 4:
            return "LIQUIDATED"
        default:
            return "CANCELLED";
    }
}

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
        user.status = STATUS_UNVERIFIED;
    }

    user.save();
}

export function createUnverifiedUserProfile(walletAddress: Bytes, displayName: String): void {
    let user = UserProfile(walletAddress)
    user.verified = false;
    
    //assumes wallet address does not exist either
    let walletAddress = WalletAddress(walletAddress)
    walletAddress.owner = user

    // updating list of wallet addresses
    let walletAddressList = user.walletAddresses
    walletAddressList.push(walletAddress)
    user.walletAddresses = walletAddressList

    user.displayName = displayName

    user.save()
    walletAddress.save()
}


export function setTwitterDetails(
    userAddress: Bytes, details: Bytes
): void {
    let userId = userAddress.toHexString()
    let user = TwitterDetail.load(userId);
    if (user == null) {
        user = new TwitterDetail(userId);
        user.twitterId = details;
    }
    user.save();
    let rUser = User.load(userId)
    rUser.twitterDetails = user.id
    rUser.save()
}

