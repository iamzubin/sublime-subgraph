import { BigDecimal, BigInt,Address } from "@graphprotocol/graph-ts";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export let BIGINT_ZERO = BigInt.fromI32(0);
export let BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);

export const STATUS_VERIFIED = "VERIFIED";
export const STATUS_UNVERIFIED = "UNVERIFIED";

export const LOAN_STATUS_ACTIVE = "Active";
export const LOAN_STATUS_CLOSED = "Closed";
export const LOAN_STATUS_CANCELLED = "Cancelled";
export const LOAN_STATUS_DEFAULTED = "Defaulted";
export const LOAN_STATUS_TERMINATED = "Terminated";
export const LOAN_STATUS_COLLECTION = "Collecting";
export let CREDIT_LINE_ADDRESS = Address.fromString("0xa454683Aed13A3D117408c61477b40677E227C6e");
export let SAVINGS_ACCOUNT_ADDRESS = Address.fromString("0xBbD4558d69df4F0F411AeF2353aB622107C946Fa");
export let POOLFACTORY_ADDRESS = Address.fromString("0xEE10EBA99C5F55DbbEAFc73b4c65a4DB3F2674B7")
export let REPAYMENTS_ACCOUNT_ADDRESS = Address.fromString("0xBdBA345aDaAd8B06F8A2b6CBA5be4766212EC150")