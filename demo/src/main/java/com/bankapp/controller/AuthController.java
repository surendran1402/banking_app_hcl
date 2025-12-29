package com.bankapp.controller;

import com.bankapp.config.JwtUtil;
import com.bankapp.dto.ApiResponse;
import com.bankapp.dto.LoginRequest;
import com.bankapp.dto.LoginResponse;
import com.bankapp.dto.RegisterRequest;
import com.bankapp.model.User;
import com.bankapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request) {
        try {
            User user = userService.registerUser(
                    request.getName(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getRole()
            );

            ApiResponse response = new ApiResponse();
            response.setSuccess(true);
            response.setMessage("User registered successfully");
            response.setData(user);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse();
            response.setSuccess(false);
            response.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Invalid email or password"));

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new RuntimeException("Invalid email or password");
            }

            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());

            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setToken(token);
            loginResponse.setEmail(user.getEmail());
            loginResponse.setRole(user.getRole().name());
            loginResponse.setUserId(user.getId());

            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            ApiResponse response = new ApiResponse();
            response.setSuccess(false);
            response.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}


