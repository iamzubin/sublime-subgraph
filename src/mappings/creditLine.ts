import { CreditLine, 
         CreditLineCollateralInfo, 
         creditLineLiquidation } from '../../generated/schema';
import { BorrowedFromCreditLine,
         CreditLineAccepted,
         CreditLineClosed,
         CreditLineRequestedToBorrower,
         CreditLineRequestedToLender,
         CreditLineReset,
         PartialCreditLineRepaid,
         CreditLine as creditLineContract } from '../../generated/CreditLine/CreditLine';
import { BIGINT_ZERO, CREDIT_LINE_ADDRESS } from "../utils/constants";
import { getCreditLineStatus } from "../utils/helpers";

let creditLinesContract = creditLineContract.bind(
    CREDIT_LINE_ADDRESS
);

export function handleCreditLineRequestedToLender(
    event: CreditLineRequestedToLender
): void {
    let creditLineHash = event.params.creditLineHash.toHexString();
    let lender = event.params.lender;
    let borrower = event.params.borrower;
    
    let creditLine = CreditLine.load(creditLineHash)
  
    if (creditLine == null) {
        creditLine = new CreditLine(creditLineHash);
        creditLine.CreditLineHash = event.params.creditLineHash;
        let CreditLineVars  = creditLinesContract.try_creditLineInfo(event.params.creditLineHash).value;
        creditLine.lender = lender;
        creditLine.Borrower = borrower;
        creditLine.BorrowLimit = CreditLineVars.value3;
        creditLine.idealCollateralRatio = CreditLineVars.value4;
        creditLine.liquidationThreshold = CreditLineVars.value5;
        creditLine.borrowRate = CreditLineVars.value6;
        creditLine.BorrowAsset=  CreditLineVars.value7;
        creditLine.collateralAsset=  CreditLineVars.value8;
        creditLine.creditLineStatus = getCreditLineStatus(1);
        creditLine.autoLiquidation = CreditLineVars.value10;
        creditLine.requestByLender = CreditLineVars.value11;
        creditLine.principal = BIGINT_ZERO;
        creditLine.totalInterestRepaid = BIGINT_ZERO;
        creditLine.lastPrincipalUpdateTime = BIGINT_ZERO;
        //creditLine.interestAccruedTillPrincipalUpdate = BIGINT_ZERO;
        creditLine.collateralAmount = BIGINT_ZERO;
        creditLine.save();
    }
}

export function handleCreditLineAccepted(
    event: CreditLineAccepted
): void {
    let creditLineHash = event.params.creditLineHash.toHexString();
    let creditLine = CreditLine.load(creditLineHash)
    if (creditLine != null) {
        creditLine.creditLineStatus = getCreditLineStatus(1);
        creditLine.save();
    } 
}

export function handleCreditLineRequestedToBorrower(
    event: CreditLineRequestedToBorrower
): void {
    let creditLineHash = event.params.creditLineHash.toHexString();
    let lender = event.params.lender;
    let borrower = event.params.borrower;
    
    let creditLine = CreditLine.load(creditLineHash)
  
    if (creditLine == null) {
        creditLine = new CreditLine(creditLineHash);
        creditLine.CreditLineHash = event.params.creditLineHash;
        let CreditLineVars  = creditLinesContract.creditLineInfo( event.params.creditLineHash);
        creditLine.lender = lender;
        creditLine.Borrower = borrower;
        creditLine.BorrowLimit = CreditLineVars.value3;
        creditLine.idealCollateralRatio = CreditLineVars.value4;
        creditLine.liquidationThreshold = CreditLineVars.value5;
        creditLine.borrowRate = CreditLineVars.value6;
        creditLine.BorrowAsset=  CreditLineVars.value7;
        creditLine.collateralAsset=  CreditLineVars.value8;
        creditLine.creditLineStatus = getCreditLineStatus(0);
        creditLine.autoLiquidation = CreditLineVars.value10;
        creditLine.requestByLender = CreditLineVars.value11;
        creditLine.principal = BIGINT_ZERO;
        creditLine.totalInterestRepaid = BIGINT_ZERO;
        creditLine.lastPrincipalUpdateTime = BIGINT_ZERO;
        //creditLine.interestAccruedTillPrincipalUpdate = BIGINT_ZERO;
        creditLine.collateralAmount = BIGINT_ZERO;
        creditLine.save();
    }
}


export function handleCreditLineClosed(
    event: CreditLineClosed
): void {
    let creditLineHash = event.params.creditLineHash.toHexString();
    let creditLine = CreditLine.load(creditLineHash)
    if (creditLine != null) {
        creditLine.creditLineStatus = getCreditLineStatus(2);
        let CreditLineUsageVars = creditLinesContract.creditLineUsage( event.params.creditLineHash);
        creditLine.principal = CreditLineUsageVars.value0;
        creditLine.totalInterestRepaid = CreditLineUsageVars.value1;
        creditLine.lastPrincipalUpdateTime = CreditLineUsageVars.value2
        //creditLine.interestAccruedTillPrincipalUpdate = CreditLineUsageVars.value3
        creditLine.collateralAmount = CreditLineUsageVars.value4;
        creditLine.save();
    }  
}


export function handleBorrowedFromCreditLine(
    event: BorrowedFromCreditLine
): void {
    let creditLineHash = event.params.creditLineHash.toHexString();
    let creditLine = CreditLine.load(creditLineHash)
    if (creditLine != null) {
        creditLine.creditLineStatus = getCreditLineStatus(2);
        let CreditLineUsageVars = creditLinesContract.creditLineUsage(event.params.creditLineHash);
        creditLine.principal = CreditLineUsageVars.value0;
        creditLine.totalInterestRepaid = CreditLineUsageVars.value1;
        creditLine.lastPrincipalUpdateTime = CreditLineUsageVars.value2
        //creditLine.interestAccruedTillPrincipalUpdate = CreditLineUsageVars.value3
        creditLine.collateralAmount = CreditLineUsageVars.value4;
        creditLine.save();
    } 

}

export function handlePartialCreditLineRepaid(
    event: PartialCreditLineRepaid
): void {
    let creditLineHash = event.params.creditLineHash.toHexString();
    let creditLine = CreditLine.load(creditLineHash)
    if (creditLine != null) {
        let CreditLineUsageVars = creditLinesContract.creditLineUsage(event.params.creditLineHash);
        creditLine.principal = CreditLineUsageVars.value0;
        creditLine.totalInterestRepaid = CreditLineUsageVars.value1;
        creditLine.lastPrincipalUpdateTime = CreditLineUsageVars.value2
        //creditLine.interestAccruedTillPrincipalUpdate = CreditLineUsageVars.value3
        creditLine.collateralAmount = CreditLineUsageVars.value4;
        creditLine.save();
    } 
}


export function handleCreditLineReset(
    event: CreditLineReset
): void {
    let creditLineHash = event.params.creditLineHash.toHexString();
    let creditLine = CreditLine.load(creditLineHash)
    if (creditLine != null) {
        let CreditLineUsageVars = creditLinesContract.creditLineUsage(event.params.creditLineHash);
        creditLine.principal = CreditLineUsageVars.value0;
        creditLine.totalInterestRepaid = CreditLineUsageVars.value1;
        creditLine.lastPrincipalUpdateTime = CreditLineUsageVars.value2
        //creditLine.interestAccruedTillPrincipalUpdate = CreditLineUsageVars.value3
        creditLine.collateralAmount = CreditLineUsageVars.value4;
        creditLine.save();
    }
}