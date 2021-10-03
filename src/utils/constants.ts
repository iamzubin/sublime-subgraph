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
export let CREDIT_LINE_ADDRESS = Address.fromString("0xB642a5877Eb6511D75BdD0Bb9e4d31E251f99729");
export let SAVINGS_ACCOUNT_ADDRESS = Address.fromString("0xD1Ce6B73914dd8608Bca7e98Ad9DF8Fc92Ceb5b7");
export let POOLFACTORY_ADDRESS = Address.fromString("0x49a82c3349A2830bb436F9f85265834877bCA4eb")
export let REPAYMENTS_ACCOUNT_ADDRESS = Address.fromString("0xd157C83Cd1D83d591ba05f05983099d5E20AEee6")

export const LENDER_STATUS_ACTIVE = "ACTIVE";
export const LENDER_STATUS_WITHDRAWN = "WITHDRAWN";
export const LENDER_STATUS_MARGIN_CALLED = "MARGIN_CALLED"
export const LENDER_STATUS_LIQUIDATED = "LIQUIDATED"