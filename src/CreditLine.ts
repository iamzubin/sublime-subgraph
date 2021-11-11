import { BigInt } from "@graphprotocol/graph-ts";

import { CreditLine as CreditLineSchema, CreditLineConstant, CreditLineVariable, CreditLineGlobalParam } from "../generated/schema";

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
  CreditLine as CreditLineContract,
} from "../generated/CreditLine/CreditLine";

import { getCreditLineStatus } from "./helper";

import { CREDIT_LINE_ADDRESS } from "./contractAddresses";

let creditLineInstance = CreditLineContract.bind(CREDIT_LINE_ADDRESS);

export function handleBorrowedFromCreditLine(event: BorrowedFromCreditLine): void {}

export function handleCompleteCreditLineRepaid(event: CompleteCreditLineRepaid): void {}

export function handleCreditLineAccepted(event: CreditLineAccepted): void {
  let creditLineId = event.params.id.toString();
  updateCreditLineVariable(creditLineId, 2);
}

export function handleCreditLineClosed(event: CreditLineClosed): void {}

export function handleCreditLineLiquidated(event: CreditLineLiquidated): void {}

export function handleCreditLineRequested(event: CreditLineRequested): void {
  let creditLineId = event.params.id.toString();
  let creditLine = CreditLineSchema.load(creditLineId);
  if (creditLine) {
  } else {
    creditLine = new CreditLineSchema(creditLineId);
    updateCreditLineConstant(creditLineId);
    updateCreditLineVariable(creditLineId, 1);
    creditLine.creditLineConstant = creditLineId;
    creditLine.creditLineVar = creditLineId;
    creditLine.save();
  }
}

export function handleCreditLineReset(event: CreditLineReset): void {}

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

export function handlePartialCreditLineRepaid(event: PartialCreditLineRepaid): void {}

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
  let creditLine = CreditLineConstant.load(creditLineId);
  let creditLineNum = BigInt.fromString(creditLineId);
  if (!creditLine) {
    creditLine = new CreditLineConstant(creditLineId);
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
  let creditLine = CreditLineVariable.load(creditLineId);
  let creditLineNum = BigInt.fromString(creditLineId);
  if (!creditLine) {
    creditLine = new CreditLineVariable(creditLineId);
  }
  let _tempVariables = creditLineInstance.creditLineVariables(creditLineNum);
  creditLine.status = getCreditLineStatus(creditLineStatusCode);
  creditLine.principal = _tempVariables.value1;
  creditLine.totalInterestRepaid = _tempVariables.value2;
  creditLine.lastPrincipalUpdateTime = _tempVariables.value3;
  creditLine.interestAccruedTillLastPrincipalUpdate = _tempVariables.value4;
  creditLine.collateralAmount = _tempVariables.value5;
  creditLine.save();
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
