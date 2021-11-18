import { BigInt } from "@graphprotocol/graph-ts";

import {
  CreditLine as CreditLineSchema,
  CreditLineGlobalParam,
  CreditLineTimeline,
} from "../generated/schema";

import {
  BorrowedFromCreditLine,
  CompleteCreditLineRepaid,
  CreditLineAccepted,
  CreditLineClosed,
  CreditLineLiquidated,
  CreditLineRequested,
  CreditLineReset,
  DefaultStrategyUpdated,
  LiquidationRewardFractionUpdated,
  OwnershipTransferred,
  PartialCreditLineRepaid,
  PriceOracleUpdated,
  ProtocolFeeCollectorUpdated,
  ProtocolFeeFractionUpdated,
  SavingsAccountUpdated,
  StrategyRegistryUpdated,
  CollateralDeposited,
  CollateralWithdrawn,
  CreditLine as CreditLineContract,
} from "../generated/CreditLine/CreditLine";

import { getCreditLineOperation, getCreditLineStatus } from "./helper";

import { CREDIT_LINE_ADDRESS } from "./contractAddresses";

let creditLineInstance = CreditLineContract.bind(CREDIT_LINE_ADDRESS);

export function handleBorrowedFromCreditLine(event: BorrowedFromCreditLine): void {
  let creditLineId = event.params.id.toString();
  updateCreditLineVariable(creditLineId, 2);
  updateCreditLineTimeline(
    creditLineId,
    event.transaction.hash.toHexString(),
    event.block.timestamp,
    4,
    event.params.borrowAmount,
    null,
    null
  );
}

export function handleCompleteCreditLineRepaid(event: CompleteCreditLineRepaid): void {
  let creditLineId = event.params.id.toString();
  updateCreditLineVariable(creditLineId, 2);
  updateCreditLineTimeline(
    creditLineId,
    event.transaction.hash.toHexString(),
    event.block.timestamp,
    5,
    event.params.repayAmount,
    null,
    null
  );
}

export function handleCreditLineAccepted(event: CreditLineAccepted): void {
  let creditLineId = event.params.id.toString();
  updateCreditLineVariable(creditLineId, 2);
  updateCreditLineTimeline(creditLineId, event.transaction.hash.toHexString(), event.block.timestamp, 2, null, null, null);
}

export function handleCreditLineClosed(event: CreditLineClosed): void {
  let creditLineId = event.params.id.toString();
  updateCreditLineVariable(creditLineId, 3);
  updateCreditLineTimeline(creditLineId, event.transaction.hash.toHexString(), event.block.timestamp, 7, null, null, null);
}

export function handleCreditLineLiquidated(event: CreditLineLiquidated): void {
  let creditLineId = event.params.id.toString();
  updateCreditLineVariable(creditLineId, 5);
  updateCreditLineTimeline(creditLineId, event.transaction.hash.toHexString(), event.block.timestamp, 10, null, null, null);
}

export function handleCollateralDeposited(event: CollateralDeposited): void {
  let creditLineId = event.params.id.toString();
  updateCreditLineVariable(creditLineId, 2);
  updateCreditLineTimeline(
    creditLineId,
    event.transaction.hash.toHexString(),
    event.block.timestamp,
    3,
    event.params.amount,
    event.params.strategy.toHexString(),
    null
  );
}

export function handleCollateralWithdrawn(event: CollateralWithdrawn): void {
  let creditLineId = event.params.id.toString();
  updateCreditLineVariable(creditLineId, 3);
  updateCreditLineTimeline(creditLineId, event.transaction.hash.toHexString(), event.block.timestamp, 6, event.params.amount, null, null);
}

export function handleCreditLineRequested(event: CreditLineRequested): void {
  let creditLineId = event.params.id.toString();
  let creditLine = CreditLineSchema.load(creditLineId);
  if (creditLine) {
  } else {
    updateCreditLineConstant(creditLineId);
    updateCreditLineVariable(creditLineId, 1);
    updateCreditLineTimeline(creditLineId, event.transaction.hash.toHexString(), event.block.timestamp, 1, null, null, null);
  }
}

export function handleCreditLineReset(event: CreditLineReset): void {
  let creditLineId = event.params.id.toString();
  updateCreditLineVariable(creditLineId, 2);
  updateCreditLineTimeline(creditLineId, event.transaction.hash.toHexString(), event.block.timestamp, 9, null, null, null);
}

export function handleDefaultStrategyUpdated(event: DefaultStrategyUpdated): void {
  let creditLineGlobalParam = CreditLineGlobalParam.load("1");
  if (creditLineGlobalParam) {
  } else {
    creditLineGlobalParam = new CreditLineGlobalParam("1");
  }
  creditLineGlobalParam.defaultStrategy = event.params.defaultStrategy.toHexString();
  creditLineGlobalParam.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePartialCreditLineRepaid(event: PartialCreditLineRepaid): void {
  let creditLineId = event.params.id.toString();
  updateCreditLineVariable(creditLineId, 2);
  updateCreditLineTimeline(
    creditLineId,
    event.transaction.hash.toHexString(),
    event.block.timestamp,
    5,
    event.params.repayAmount,
    null,
    null
  );
}

export function handleLiquidationRewardFractionUpdated(event: LiquidationRewardFractionUpdated): void {
  let creditLineGlobalParam = CreditLineGlobalParam.load("1");
  if (creditLineGlobalParam) {
  } else {
    creditLineGlobalParam = new CreditLineGlobalParam("1");
  }
  creditLineGlobalParam.liquidationRewardFraction = event.params.liquidatorRewardFraction;
  creditLineGlobalParam.save();
}

export function handlePriceOracleUpdated(event: PriceOracleUpdated): void {
  let creditLineGlobalParam = CreditLineGlobalParam.load("1");
  if (creditLineGlobalParam) {
  } else {
    creditLineGlobalParam = new CreditLineGlobalParam("1");
  }
  creditLineGlobalParam.priceOracle = event.params.priceOracle.toHexString();
  creditLineGlobalParam.save();
}

export function handleProtocolFeeCollectorUpdated(event: ProtocolFeeCollectorUpdated): void {
  let creditLineGlobalParam = CreditLineGlobalParam.load("1");
  if (creditLineGlobalParam) {
  } else {
    creditLineGlobalParam = new CreditLineGlobalParam("1");
  }
  creditLineGlobalParam.protocolFeeCollector = event.params.updatedProtocolFeeCollector.toHexString();
  creditLineGlobalParam.save();
}

export function handleProtocolFeeFractionUpdated(event: ProtocolFeeFractionUpdated): void {
  let creditLineGlobalParam = CreditLineGlobalParam.load("1");
  if (creditLineGlobalParam) {
  } else {
    creditLineGlobalParam = new CreditLineGlobalParam("1");
  }
  creditLineGlobalParam.protocolFeeFraction = event.params.updatedProtocolFee;
  creditLineGlobalParam.save();
}

export function handleSavingsAccountUpdated(event: SavingsAccountUpdated): void {
  let creditLineGlobalParam = CreditLineGlobalParam.load("1");
  if (creditLineGlobalParam) {
  } else {
    creditLineGlobalParam = new CreditLineGlobalParam("1");
  }
  creditLineGlobalParam.savingsAccount = event.params.savingsAccount.toHexString();
  creditLineGlobalParam.save();
}

export function handleStrategyRegistryUpdated(event: StrategyRegistryUpdated): void {
  let creditLineGlobalParam = CreditLineGlobalParam.load("1");
  if (creditLineGlobalParam) {
  } else {
    creditLineGlobalParam = new CreditLineGlobalParam("1");
  }
  creditLineGlobalParam.strategyRegistry = event.params.strategyRegistry.toHexString();
  creditLineGlobalParam.save();
}

function updateCreditLineConstant(creditLineId: string): void {
  let creditLineNum = BigInt.fromString(creditLineId);

  let creditLine = CreditLineSchema.load(creditLineId);
  if (!creditLine) {
    creditLine = new CreditLineSchema(creditLineId);
  }
  let _tempConstants = creditLineInstance.creditLineConstants(creditLineNum);
  creditLine.lender = _tempConstants.value0.toHexString();
  creditLine.borrower = _tempConstants.value1.toHexString();
  creditLine.borrowLimit = _tempConstants.value2;
  creditLine.idealCollateralRatio = _tempConstants.value3;
  creditLine.borrowRate = _tempConstants.value4;
  creditLine.borrowAsset = _tempConstants.value5.toHexString();
  creditLine.collateralAsset = _tempConstants.value6.toHexString();
  creditLine.autoLiquidation = _tempConstants.value7;
  creditLine.requestByLender = _tempConstants.value8;
  creditLine.save();
}

function updateCreditLineVariable(creditLineId: string, creditLineStatusCode: i32): void {
  let creditLineNum = BigInt.fromString(creditLineId);

  let creditLine = CreditLineSchema.load(creditLineId);
  if (!creditLine) {
    creditLine = new CreditLineSchema(creditLineId);
  }
  let _tempVariables = creditLineInstance.creditLineVariables(creditLineNum);
  creditLine.status = getCreditLineStatus(creditLineStatusCode);
  creditLine.principal = _tempVariables.value1;
  creditLine.totalInterestRepaid = _tempVariables.value2;
  creditLine.lastPrincipalUpdateTime = _tempVariables.value3;
  creditLine.interestAccruedTillLastPrincipalUpdate = _tempVariables.value4;
  creditLine.save();
}

function updateCreditLineTimeline(
  creditLineId: string,
  transactionHash: string,
  timestamp: BigInt,
  creditLineOperation: i32,
  amount: BigInt,
  strategy: string,
  liquidator: string
): void {
  let creditLineTimeline = CreditLineTimeline.load(transactionHash);
  if (creditLineTimeline) {
  } else {
    creditLineTimeline = new CreditLineTimeline(transactionHash);
    creditLineTimeline.creditLine = creditLineId;
    creditLineTimeline.timestamp = timestamp;
    creditLineTimeline.creditLineOperation = getCreditLineOperation(creditLineOperation);
    creditLineTimeline.amount = amount;
    creditLineTimeline.strategy = strategy;
    creditLineTimeline.liquidator = liquidator;
    creditLineTimeline.save();
  }
}
/* ------------------ constants -------------------*/

// address lender;
// address borrower;
// uint256 borrowLimit;
// uint256 idealCollateralRatio;
// uint256 borrowRate;
// address borrowAsset;
// address collateralAsset;
// bool autoLiquidation;
// bool requestByLender;

/* ------------------ variables -------------------*/

// CreditLineStatus status;
// uint256 principal;
// uint256 totalInterestRepaid;
// uint256 lastPrincipalUpdateTime;
// uint256 interestAccruedTillLastPrincipalUpdate;
// uint256 collateralAmount;
