package com.bankapp.repository;

import com.bankapp.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByFromAccountOrToAccount(String fromAccount, String toAccount);
    List<Transaction> findByIsFraudTrue();
    List<Transaction> findByFromAccountAndTimestampAfter(String fromAccount, LocalDateTime timestamp);
}


