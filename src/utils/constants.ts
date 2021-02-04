import { BigDecimal, BigInt, Address } from "@graphprotocol/graph-ts";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export let BIGINT_ZERO = BigInt.fromI32(0);
export let BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);

export const STATUS_REGISTERED = "REGISTERED";
export const STATUS_NOT_REGISTERED = "NOT_REGISTERED";

export const LOAN_STATUS_ACTIVE = "ACTIVE";
export const LOAN_STATUS_CLOSED = "CLOSED";
export const LOAN_STATUS_INACTIVE = "INACTIVE";
export const LOAN_STATUS_CANCELLED = "CANCELLED";
export const LOAN_STATUS_DEFAULTED = "DEFAULTED";
export const LOAN_STATUS_TERMINATED = "TERMINATED";

export let POOL_FACTORY_ADDRSS = Address.fromString("0x5124324e4f185C55dff566A71d8666fEf0297cd7");
