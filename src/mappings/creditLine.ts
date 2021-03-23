import {
    CreditLines, CreditLineCollateralInfo,creditLineLiquidation, CreditLineStatus
} from '../../generated/schema';
import {
    BorrowedFromCreditLine,
    CreditLineAccepted,
    CreditLineClosed,
    CreditLineRequestedToBorrower,
    CreditLineRequestedToLender,
    CreditLineReset,
    PartialCreditLineRepaid ,
    CreditLine as creditLineContract
} from '../../generated/CreditLine/CreditLine';
import { BIGINT_ZERO,CREDIT_LINE_ADDRESS } from "../utils/constants";
import {getCreditLineStatus} from  "../utils/helpers.ts"

let creditLinesContract = creditLineContract.bind(
    CREDIT_LINE_ADDRESS
);

export function handleCreditLineRequestedToLender(
    event: CreditLineRequestedToLender
): void {
    let creditLineHash = event.params.creditLineHash.toHexString();
    let lender = event.params.lender.toHexString();
    let borrower = event.params.borrower.toHexString();
    
    let creditLine = CreditLines.load(creditLineHash)
  
    if (creditLine == null) {
        creditLine = new CreditLines(creditLineHash);
        creditLine.CreditLineHash = event.params.creditLineHash;
        creditLine.BorrowLimit = BIGINT_ZERO;
        creditLine.liquidationThreshold = BIGINT_ZERO;
        creditLine.borrowRate = BIGINT_ZERO;
        creditLine.AutoLiquidation = BIGINT_ZERO;
        creditLine.idealCollateralRatio = BIGINT_ZERO;
        creditLine.BorrowAsset=  event.params.creditLineHash;
        creditLine.creditLineStatus = getCreditLineStatus(0);
        creditLine.principal = BIGINT_ZERO;
        creditLine.totalInterestRepaid = BIGINT_ZERO;
        creditLine.lastPrincipalUpdateTime = BIGINT_ZERO;
        creditLine.interestAccruedTillPrincipalUpdate = BIGINT_ZERO;
        creditLine.collateralAmount = BIGINT_ZERO;
        creditLine.autoLiquidation = false;
        creditLine.requestByLender = false;

        creditLine.save();
    }
}

export function handleCreditLineAccepted(
    event: CreditLineAccepted
): void {
    let creditLineHash = event.params.creditLineHash.toHexString();
    let creditLine = CreditLines.load(creditLineHash)
    if (creditLine != null) {
        creditLine.creditLineStatus = getCreditLineStatus(1);
        creditLine.save();
    } 
}

export function handleCreditLineRequestedToBorrower(
    event: CreditLineRequestedToBorrower
): void {
    let creditLineHash = event.params.creditLineHash.toHexString();
    let lender = event.params.lender.toHexString();
    let borrower = event.params.borrower.toHexString();
    
    let creditLine = CreditLines.load(creditLineHash)
  
    if (creditLine == null) {
        creditLine = new CreditLines(creditLineHash);
        creditLine.CreditLineHash = event.params.creditLineHash;
        creditLine.BorrowLimit = BIGINT_ZERO;
        creditLine.liquidationThreshold = BIGINT_ZERO;
        creditLine.borrowRate = BIGINT_ZERO;
        creditLine.AutoLiquidation = BIGINT_ZERO;
        creditLine.idealCollateralRatio = BIGINT_ZERO;
        creditLine.BorrowAsset=  event.params.creditLineHash;
        creditLine.creditLineStatus = getCreditLineStatus(0);
        creditLine.principal = BIGINT_ZERO;
        creditLine.totalInterestRepaid = BIGINT_ZERO;
        creditLine.lastPrincipalUpdateTime = BIGINT_ZERO;
        creditLine.interestAccruedTillPrincipalUpdate = BIGINT_ZERO;
        creditLine.collateralAmount = BIGINT_ZERO;
        creditLine.autoLiquidation = false;
        creditLine.requestByLender = false;

        creditLine.save();
    }
}

export function handleCreditLineClosed(
    event: CreditLineClosed
): void {
    let creditLineHash = event.params.creditLineHash.toHexString();
    let creditLine = CreditLines.load(creditLineHash)
    if (creditLine != null) {
        creditLine.creditLineStatus = getCreditLineStatus(2);
        let CreditLineUsageVars = creditLinesContract.try_creditLineUsage( event.params.creditLineHash);
        creditLine.principal = CreditLineUsageVars.value0;
        creditLine.totalInterestRepaid = CreditLineUsageVars.value1;
        creditLine.lastPrincipalUpdateTime = CreditLineUsageVars.value2
        creditLine.interestAccruedTillPrincipalUpdate = CreditLineUsageVars.value3
        creditLine.collateralAmount = CreditLineUsageVars.value4;
        creditLine.save();
    }  
}


export function handleBorrowedFromCreditLine(
    event: BorrowedFromCreditLine
): void {
    let creditLineHash = event.params.creditLineHash.toHexString();
    let creditLine = CreditLines.load(creditLineHash)
    if (creditLine != null) {
        creditLine.creditLineStatus = getCreditLineStatus(2);
        let CreditLineUsageVars = creditLinesContract.try_creditLineUsage(event.params.creditLineHash);
        creditLine.principal = CreditLineUsageVars.value0;
        creditLine.totalInterestRepaid = CreditLineUsageVars.value1;
        creditLine.lastPrincipalUpdateTime = CreditLineUsageVars.value2
        creditLine.interestAccruedTillPrincipalUpdate = CreditLineUsageVars.value3
        creditLine.collateralAmount = CreditLineUsageVars.value4;
        creditLine.save();
    } 

}

export function handlePartialCreditLineRepaid(
    event: PartialCreditLineRepaid
): void {
    let creditLineHash = event.params.creditLineHash.toHexString();
    let creditLine = CreditLines.load(creditLineHash)
    if (creditLine != null) {
        let CreditLineUsageVars = creditLinesContract.try_creditLineUsage(event.params.creditLineHash);
        creditLine.principal = CreditLineUsageVars.value0;
        creditLine.totalInterestRepaid = CreditLineUsageVars.value1;
        creditLine.lastPrincipalUpdateTime = CreditLineUsageVars.value2
        creditLine.interestAccruedTillPrincipalUpdate = CreditLineUsageVars.value3
        creditLine.collateralAmount = CreditLineUsageVars.value4;
        creditLine.save();
    } 
}


export function handleCreditLineReset(
    event: CreditLineReset
): void {
    let creditLineHash = event.params.creditLineHash.toHexString();
    let creditLine = CreditLines.load(creditLineHash)
    if (creditLine != null) {
        let CreditLineUsageVars = creditLinesContract.try_creditLineUsage(event.params.creditLineHash);
        creditLine.principal = CreditLineUsageVars.value0;
        creditLine.totalInterestRepaid = CreditLineUsageVars.value1;
        creditLine.lastPrincipalUpdateTime = CreditLineUsageVars.value2
        creditLine.interestAccruedTillPrincipalUpdate = CreditLineUsageVars.value3
        creditLine.collateralAmount = CreditLineUsageVars.value4;
        creditLine.save();
    }
}


    
