package com.bankapp.repository;

import com.bankapp.model.Account;
import com.bankapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByAccountNumber(String accountNumber);
    Optional<Account> findByUser(User user);
    boolean existsByAccountNumber(String accountNumber);
}


