package com.bankapp.service;

import com.bankapp.model.Transaction;
import com.bankapp.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FraudDetectionService {

    @Autowired
    private TransactionRepository transactionRepository;

    private static final Double FRAUD_THRESHOLD_AMOUNT = 50000.0;
    private static final int FRAUD_THRESHOLD_COUNT = 3;
    private static final int FRAUD_TIME_WINDOW_MINUTES = 1;

    public void detectFraud(Transaction transaction) {
        boolean isFraud = false;
        StringBuilder fraudReasons = new StringBuilder();

        // Rule 1: Transaction amount > 50000
        if (transaction.getAmount() > FRAUD_THRESHOLD_AMOUNT) {
            isFraud = true;
            fraudReasons.append("Transaction amount (").append(transaction.getAmount())
                    .append(") exceeds threshold of ").append(FRAUD_THRESHOLD_AMOUNT).append(". ");
        }

        // Rule 2: More than 3 transactions within 1 minute
        LocalDateTime oneMinuteAgo = transaction.getTimestamp().minusMinutes(FRAUD_TIME_WINDOW_MINUTES);
        List<Transaction> recentTransactions = transactionRepository
                .findByFromAccountAndTimestampAfter(transaction.getFromAccount(), oneMinuteAgo);

        if (recentTransactions.size() >= FRAUD_THRESHOLD_COUNT) {
            isFraud = true;
            fraudReasons.append("More than ").append(FRAUD_THRESHOLD_COUNT)
                    .append(" transactions detected within ").append(FRAUD_TIME_WINDOW_MINUTES)
                    .append(" minute(s) from the same account. ");
        }

        if (isFraud) {
            transaction.setIsFraud(true);
            transaction.setFraudReason(fraudReasons.toString().trim());
        } else {
            transaction.setIsFraud(false);
            transaction.setFraudReason(null);
        }
    }
}


