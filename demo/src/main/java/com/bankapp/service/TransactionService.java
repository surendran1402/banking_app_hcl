package com.bankapp.service;

import com.bankapp.dto.TransactionResponse;
import com.bankapp.model.Account;
import com.bankapp.model.Transaction;
import com.bankapp.model.TransactionStatus;
import com.bankapp.model.User;
import com.bankapp.repository.AccountRepository;
import com.bankapp.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private FraudDetectionService fraudDetectionService;

    @Transactional
    public Transaction transferMoney(String fromAccountNumber, String toAccountNumber, Double amount, User user) {
        // Validate sender account
        Account fromAccount = accountRepository.findByAccountNumber(fromAccountNumber)
                .orElseThrow(() -> new RuntimeException("Sender account not found"));

        // Verify account belongs to user
        if (!fromAccount.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: Account does not belong to user");
        }

        // Validate receiver account
        Account toAccount = accountRepository.findByAccountNumber(toAccountNumber)
                .orElseThrow(() -> new RuntimeException("Receiver account not found"));

        // Validate amount
        if (amount <= 0) {
            throw new RuntimeException("Transfer amount must be positive");
        }

        // Check sufficient balance
        if (fromAccount.getBalance() < amount) {
            Transaction failedTransaction = new Transaction();
            failedTransaction.setFromAccount(fromAccountNumber);
            failedTransaction.setToAccount(toAccountNumber);
            failedTransaction.setAmount(amount);
            failedTransaction.setStatus(TransactionStatus.FAILED);
            failedTransaction.setIsFraud(false);
            transactionRepository.save(failedTransaction);
            throw new RuntimeException("Insufficient balance");
        }

        // Perform transfer
        fromAccount.setBalance(fromAccount.getBalance() - amount);
        toAccount.setBalance(toAccount.getBalance() + amount);

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setFromAccount(fromAccountNumber);
        transaction.setToAccount(toAccountNumber);
        transaction.setAmount(amount);
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setTimestamp(LocalDateTime.now()); // Set timestamp before fraud detection

        // Run fraud detection
        fraudDetectionService.detectFraud(transaction);

        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction depositMoney(String accountNumber, Double amount, User user) {
        // Validate account
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Verify account belongs to user
        if (!account.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: Account does not belong to user");
        }

        // Validate amount
        if (amount <= 0) {
            throw new RuntimeException("Deposit amount must be positive");
        }

        // Perform deposit
        account.setBalance(account.getBalance() + amount);
        accountRepository.save(account);

        // Create transaction record (deposit - fromAccount and toAccount are same)
        Transaction transaction = new Transaction();
        transaction.setFromAccount(accountNumber);
        transaction.setToAccount(accountNumber);
        transaction.setAmount(amount);
        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setIsFraud(false); // Deposits are not considered for fraud detection
        transaction.setTimestamp(LocalDateTime.now()); // Set timestamp explicitly

        return transactionRepository.save(transaction);
    }

    public List<TransactionResponse> getUserTransactions(User user) {
        Account account = accountRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("User account not found"));

        List<Transaction> transactions = transactionRepository
                .findByFromAccountOrToAccount(account.getAccountNumber(), account.getAccountNumber());

        return transactions.stream()
                .map(this::convertToTransactionResponse)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(this::convertToTransactionResponse)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> getFraudTransactions() {
        return transactionRepository.findByIsFraudTrue().stream()
                .map(this::convertToTransactionResponse)
                .collect(Collectors.toList());
    }

    public Transaction updateFraudDecision(Long transactionId, String decision, String reason) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if ("CONFIRMED_FRAUD".equalsIgnoreCase(decision)) {
            transaction.setIsFraud(true);
            transaction.setFraudReason(reason != null ? reason : "Confirmed as fraud by admin");
        } else if ("SAFE".equalsIgnoreCase(decision)) {
            transaction.setIsFraud(false);
            transaction.setFraudReason(reason != null ? reason : "Marked as safe by admin");
        } else {
            throw new RuntimeException("Invalid decision. Use SAFE or CONFIRMED_FRAUD");
        }

        return transactionRepository.save(transaction);
    }

    private TransactionResponse convertToTransactionResponse(Transaction transaction) {
        TransactionResponse response = new TransactionResponse();
        response.setId(transaction.getId());
        response.setFromAccount(transaction.getFromAccount());
        response.setToAccount(transaction.getToAccount());
        response.setAmount(transaction.getAmount());
        response.setTimestamp(transaction.getTimestamp());
        response.setStatus(transaction.getStatus());
        response.setIsFraud(transaction.getIsFraud());
        response.setFraudReason(transaction.getFraudReason());
        return response;
    }
}
