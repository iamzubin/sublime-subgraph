import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export let BIGINT_ZERO = BigInt.fromI32(0);
export let BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);

export const STATUS_VERIFIED = "VERIFIED";
export const STATUS_UNVERIFIED = "UNVERIFIED";

export const LOAN_STATUS_ACTIVE = "ACTIVE";
export const LOAN_STATUS_CLOSED = "CLOSED";
export const LOAN_STATUS_CANCELLED = "CANCELLED";
export const LOAN_STATUS_DEFAULTED = "DEFAULTED";
export const LOAN_STATUS_TERMINATED = "TERMINATED";
export const LOAN_STATUS_COLLECTION = "COLLECTION";
