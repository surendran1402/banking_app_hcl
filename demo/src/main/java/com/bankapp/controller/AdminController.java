package com.bankapp.controller;

import com.bankapp.dto.*;
import com.bankapp.model.Transaction;
import com.bankapp.model.User;
import com.bankapp.service.TransactionService;
import com.bankapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse> getAllUsers() {
        try {
            List<User> users = userService.findAllUsers();
            List<UserResponse> userResponses = users.stream()
                    .map(user -> {
                        UserResponse response = new UserResponse();
                        response.setId(user.getId());
                        response.setName(user.getName());
                        response.setEmail(user.getEmail());
                        response.setRole(user.getRole().name());
                        return response;
                    })
                    .collect(Collectors.toList());

            ApiResponse response = new ApiResponse();
            response.setSuccess(true);
            response.setMessage("Users retrieved successfully");
            response.setData(userResponses);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse();
            response.setSuccess(false);
            response.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse> getAllTransactions() {
        try {
            List<TransactionResponse> transactions = transactionService.getAllTransactions();

            ApiResponse response = new ApiResponse();
            response.setSuccess(true);
            response.setMessage("All transactions retrieved successfully");
            response.setData(transactions);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse();
            response.setSuccess(false);
            response.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/fraud-transactions")
    public ResponseEntity<ApiResponse> getFraudTransactions() {
        try {
            List<TransactionResponse> fraudTransactions = transactionService.getFraudTransactions();

            ApiResponse response = new ApiResponse();
            response.setSuccess(true);
            response.setMessage("Fraud transactions retrieved successfully");
            response.setData(fraudTransactions);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse();
            response.setSuccess(false);
            response.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/transaction/{id}/decision")
    public ResponseEntity<ApiResponse> makeFraudDecision(
            @PathVariable Long id,
            @RequestBody FraudDecisionRequest decisionRequest) {
        try {
            Transaction transaction = transactionService.updateFraudDecision(
                    id,
                    decisionRequest.getDecision(),
                    decisionRequest.getReason()
            );

            TransactionResponse transactionResponse = new TransactionResponse();
            transactionResponse.setId(transaction.getId());
            transactionResponse.setFromAccount(transaction.getFromAccount());
            transactionResponse.setToAccount(transaction.getToAccount());
            transactionResponse.setAmount(transaction.getAmount());
            transactionResponse.setTimestamp(transaction.getTimestamp());
            transactionResponse.setStatus(transaction.getStatus());
            transactionResponse.setIsFraud(transaction.getIsFraud());
            transactionResponse.setFraudReason(transaction.getFraudReason());

            ApiResponse response = new ApiResponse();
            response.setSuccess(true);
            response.setMessage("Fraud decision updated successfully");
            response.setData(transactionResponse);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse();
            response.setSuccess(false);
            response.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}


