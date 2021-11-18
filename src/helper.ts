export function getCreditLineStatus(value: i32): string {
  switch (value) {
    case 0:
      return "NOT_CREATED";
    case 1:
      return "REQUESTED";
    case 2:
      return "ACTIVE";
    case 3:
      return "CLOSED";
    case 4:
      return "CANCELLED";
    case 5:
      return "LIQUIDATED";
    default:
      return "CANCELLED";
  }
}

export function getCreditLineOperation(value: i32): string {
  switch (value) {
    case 0:
      return "NOT_CREATED";
    case 1:
      return "REQUESTED";
    case 2:
      return "ACTIVE";
    case 3:
      return "DEPOSIT_COLLATERAL";
    case 4:
      return "BORROW";
    case 5:
      return "REPAY";
    case 6:
      return "WITHDRAW_COLLATERAL";
    case 7:
      return "CLOSED";
    case 8:
      return "CANCELLED";
    case 9:
      return "RESET";
    default:
      return "LIQUIDATED";
  }
}
