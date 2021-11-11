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
