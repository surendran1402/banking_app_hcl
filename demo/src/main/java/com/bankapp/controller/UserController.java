package com.bankapp.controller;

import com.bankapp.config.JwtUtil;
import com.bankapp.dto.*;
import com.bankapp.model.Account;
import com.bankapp.model.Transaction;
import com.bankapp.model.User;
import com.bankapp.service.TransactionService;
import com.bankapp.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
@PreAuthorize("hasRole('USER')")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private JwtUtil jwtUtil;

    private User getCurrentUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization token missing");
        }
        String token = authHeader.substring(7);
        Long userId = jwtUtil.extractUserId(token);
        return userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/account")
    public ResponseEntity<ApiResponse> createAccount(HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            Account account = userService.createAccount(user);
            AccountResponse accountResponse = userService.convertToAccountResponse(account);

            ApiResponse response = new ApiResponse();
            response.setSuccess(true);
            response.setMessage("Account created successfully");
            response.setData(accountResponse);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse();
            response.setSuccess(false);
            response.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/account")
    public ResponseEntity<ApiResponse> getAccount(HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            Account account = userService.getAccountByUser(user)
                    .orElseThrow(() -> new RuntimeException("Account not found. Please create an account first."));

            AccountResponse accountResponse = userService.convertToAccountResponse(account);

            ApiResponse response = new ApiResponse();
            response.setSuccess(true);
            response.setMessage("Account retrieved successfully");
            response.setData(accountResponse);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse();
            response.setSuccess(false);
            response.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PostMapping("/deposit")
    public ResponseEntity<ApiResponse> depositMoney(@RequestBody DepositRequest depositRequest, HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            Account userAccount = userService.getAccountByUser(user)
                    .orElseThrow(() -> new RuntimeException("Account not found. Please create an account first."));

            transactionService.depositMoney(
                    userAccount.getAccountNumber(),
                    depositRequest.getAmount(),
                    user
            );

            // Refresh account to get updated balance
            Account updatedAccount = userService.getAccountByUser(user)
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            AccountResponse accountResponse = userService.convertToAccountResponse(updatedAccount);

            ApiResponse response = new ApiResponse();
            response.setSuccess(true);
            response.setMessage("Deposit completed successfully");
            response.setData(accountResponse);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse();
            response.setSuccess(false);
            response.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/transfer")
    public ResponseEntity<ApiResponse> transferMoney(@RequestBody TransferRequest transferRequest, HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            Account userAccount = userService.getAccountByUser(user)
                    .orElseThrow(() -> new RuntimeException("Account not found. Please create an account first."));

            Transaction transaction = transactionService.transferMoney(
                    userAccount.getAccountNumber(),
                    transferRequest.getToAccount(),
                    transferRequest.getAmount(),
                    user
            );

            TransactionResponse transactionResponse = new TransactionResponse();
            transactionResponse.setId(transaction.getId());
            transactionResponse.setFromAccount(transaction.getFromAccount());
            transactionResponse.setToAccount(transaction.getToAccount());
            transactionResponse.setAmount(transaction.getAmount());
            transactionResponse.setTimestamp(transaction.getTimestamp());
            transactionResponse.setStatus(transaction.getStatus());
            // Don't expose fraud information to regular users
            transactionResponse.setIsFraud(null);
            transactionResponse.setFraudReason(null);

            ApiResponse response = new ApiResponse();
            response.setSuccess(true);
            response.setMessage("Transfer completed successfully");
            response.setData(transactionResponse);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse();
            response.setSuccess(false);
            response.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse> getTransactions(HttpServletRequest request) {
        try {
            User user = getCurrentUser(request);
            List<TransactionResponse> transactions = transactionService.getUserTransactions(user);

            // Remove fraud information for regular users
            transactions = transactions.stream().map(t -> {
                t.setIsFraud(null);
                t.setFraudReason(null);
                return t;
            }).collect(Collectors.toList());

            ApiResponse response = new ApiResponse();
            response.setSuccess(true);
            response.setMessage("Transactions retrieved successfully");
            response.setData(transactions);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse();
            response.setSuccess(false);
            response.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
