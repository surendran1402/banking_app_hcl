package com.bankapp.dto;

import com.bankapp.model.TransactionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private Long id;
    private String fromAccount;
    private String toAccount;
    private Double amount;
    private LocalDateTime timestamp;
    private TransactionStatus status;
    private Boolean isFraud;
    private String fraudReason; // Only visible to ADMIN
}


