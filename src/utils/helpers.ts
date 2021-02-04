import { Bytes } from "@graphprotocol/graph-ts";
import {
    LOAN_STATUS_ACTIVE,
    LOAN_STATUS_CLOSED,
    LOAN_STATUS_DEFAULTED,
    LOAN_STATUS_CANCELLED,
    LOAN_STATUS_INACTIVE,
    LOAN_STATUS_TERMINATED,
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
