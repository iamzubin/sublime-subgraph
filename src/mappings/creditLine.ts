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
    OwnershipTransferred,
    PartialCreditLineRepaid    
} from '../../generated/SavingsAccount/SavingsAccount';
import { BIGINT_ZERO } from "../utils/constants";
import {getCreditLineStatus} from  "../utils/helpers.ts"



export function handleCreditLineRequestedToBorrower(
    event: CreditLineRequestedToBorrower
): void {
    let creditLineHash = event.params.creditLineHash.toHexString();
    let lender = event.params.lender.toHexString();
    let borrower = event.params.borrower.toHexString();
    
    let creditLine = CreditLines.load(creditLineHash)
  
    if (creditLine == null) {
        creditLine = new CreditLines(creditLineHash);
        creditLine.CreditLineHash = creditLineHash;
        creditLine.BorrowLimit = BIGINT_ZERO;
        creditLine.liquidationThreshold = BIGINT_ZERO;
        creditLine.borrowRate = BIGINT_ZERO;
        creditLine.AutoLiquidation = BIGINT_ZERO;
        creditLine.idealCollateralRatio = BIGINT_ZERO;
        creditLine.BorrowAsset=  BIGINT_ZERO.toHexString();
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

export function handleCreditLineClosed(
    event: CreditLineClosed
): void {
    let creditLineHash = event.params.creditLineHash.toHexString();
    let creditLine = CreditLines.load(creditLineHash)
    if (creditLine != null) {
        creditLine.creditLineStatus = getCreditLineStatus(2);
        creditLine.save();
    } 
}


