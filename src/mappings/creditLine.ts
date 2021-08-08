import { CreditLine, 
         UserCreditLines,
         CreditLineLiquidationEvent,
         CreditLineBorrowingEvent,
         CreditLineRepaymentEvent } from '../../generated/schema';
         
import { CreditLineRequestedToBorrower,
         CreditLineRequestedToLender,
         CreditLineLiquidated,
         BorrowedFromCreditLine,
         CreditLineAccepted,
         CreditLineReset,
         PartialCreditLineRepaid,
         CompleteCreditLineRepaid,
         CreditLineClosed,
         DefaultStrategyUpdated,
         PriceOracleUpdated,
         SavingsAccountUpdated.
         StrategyRegistryUpdated,
         ProtocolFeeFractionUpdated,
         ProtocolFeeCollectorUpdated,
         CreditLine as creditLineContract } from '../../generated/CreditLine/CreditLine';
import { BIGINT_ZERO, CREDIT_LINE_ADDRESS } from "../utils/constants";
import { getCreditLineStatus } from "../utils/helpers";

import {createUnverifiedUserProfile} from '../utils/helpers'

let creditLinesContract = creditLineContract.bind(
    CREDIT_LINE_ADDRESS
);

// 
export function handleCreditLineRequestedToLender(event: CreditLineRequestedToLender): void {

    let creditLineHash = event.params.creditLineHash.toHexString(); // hash is same as the credit line ID
    let lenderAddress = event.params.lender;
    let borrowerAddress = event.params.borrower;
    
    let creditLine = CreditLine.load(creditLineHash)
  
    if (creditLine == null) {
        creditLine = new CreditLine(creditLineHash); // create a new CreditLine

        let creditLineInfo  = creditLinesContract.try_creditLineInfo(event.params.creditLineHash).value;
        let creditLineUsage = creditLinesContract.try_creditLineUsage(event.params.creditLineHash).value;

        // get the UserProfile of borrower and lender
        let lender = UserProfile.load(lenderAddress)
        if (lender == null) {
            createUnverifiedUserProfile(lenderAddress, 'Lender') // Placeholder storing lender's name
            lender = UserProfile.load(lenderAddress)
        }

        let borrower = UserProfile.load(borrowerAddress)
        if (borrower == null) {
            createUnverifiedUserProfile(borrowerAddress, 'Borrower') // Placeholder storing borrower's name
            borrower = UserProfile.load(borrowerAddress)
        }

        creditLine.lender = lender;
        creditLine.borrower = borrower;
        creditLine.lenderAddress = lenderAddress;
        creditLine.borrowerAddress = borrowerAddress;

        creditLine.requestedBy = borrower; // since function is creditLineRequestedToLender()

        creditLine.status = creditLineInfo.value9;

        creditLine.borrowLimit = creditLineInfo.value3;
        creditLine.liquidationThreshold = creditLineInfo.value5;
        creditLine.borrowRate = creditLineInfo.value6;
        creditLine.idealCollateralRatio = creditLineInfo.value4;
        creditLine.borrowAsset = creditLineInfo.value7;
        creditLine.collateralAsset = creditLineInfo.value8;
        creditLine.autoLiquidate = creditLineInfo.value10;
        
        creditLine.activeCollateral = creditLineUsage.value4;
        creditLine.totalInterestRepaid = creditLineUsage.value1;
        creditLine.interestAccruedTillPrincipalUpdate = creditLineUsage.value3;
        creditLine.lastPrincipalUpdateTime = creditLineUsage.value2;

        creditLine.borrowingHistory = []
        creditLine.repaymentHistory = []

        //TODO - abi missing, develop-fixed branch not compiling
        creditLine.oracleAddress = 
        creditLine.protocolFee
        
        creditLine.save();
    }
}

export function handleCreditLineAccepted(event: CreditLineAccepted): void {
    let creditLineHash = event.params.creditLineHash.toHexString();
    let creditLine = CreditLine.load(creditLineHash)
    if (creditLine != null) {
        creditLine.creditLineStatus = getCreditLineStatus(1);
        creditLine.save();
    } 
}

export function handleCreditLineRequestedToBorrower(event: CreditLineRequestedToBorrower): void {
    let creditLineHash = event.params.creditLineHash.toHexString();
    let lender = event.params.lender;
    let borrower = event.params.borrower;
    
    let creditLine = CreditLine.load(creditLineHash)
  
    if (creditLine == null) {
        creditLine = new CreditLine(creditLineHash);
        creditLine.CreditLineHash = event.params.creditLineHash;
        let creditLineInfo  = creditLinesContract.creditLineInfo( event.params.creditLineHash);
        creditLine.lender = lender;
        creditLine.Borrower = borrower;
        creditLine.BorrowLimit = creditLineInfo.value3;
        creditLine.idealCollateralRatio = creditLineInfo.value4;
        creditLine.liquidationThreshold = creditLineInfo.value5;
        creditLine.borrowRate = creditLineInfo.value6;
        creditLine.BorrowAsset=  creditLineInfo.value7;
        creditLine.collateralAsset=  creditLineInfo.value8;
        creditLine.creditLineStatus = getCreditLineStatus(0);
        creditLine.autoLiquidation = creditLineInfo.value10;
        creditLine.requestByLender = creditLineInfo.value11;
        creditLine.principal = BIGINT_ZERO;
        creditLine.totalInterestRepaid = BIGINT_ZERO;
        creditLine.lastPrincipalUpdateTime = BIGINT_ZERO;
        //creditLine.interestAccruedTillPrincipalUpdate = BIGINT_ZERO;
        creditLine.collateralAmount = BIGINT_ZERO;
        creditLine.save();
    }
}


export function handleCreditLineClosed(event: CreditLineClosed): void {
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


export function handleBorrowedFromCreditLine(event: BorrowedFromCreditLine): void {
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

export function handlePartialCreditLineRepaid(event: PartialCreditLineRepaid): void {
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


export function handleCreditLineReset(event: CreditLineReset): void {
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

export function handleCreditLineLiquidated(event: CreditLineLiquidated): void {

}