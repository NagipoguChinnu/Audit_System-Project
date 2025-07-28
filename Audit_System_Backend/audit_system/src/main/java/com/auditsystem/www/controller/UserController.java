package com.auditsystem.www.controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.auditsystem.www.model.User;
import com.auditsystem.www.repository.UserRepository;

@RestController
@RequestMapping({"/user"})
@CrossOrigin(
   origins = {"http://localhost:3000"}
)
public class UserController {
   @Autowired
   private UserRepository userRepository;
   @Autowired
   private JavaMailSender mailSender;

   @PostMapping({"/register"})
   public ResponseEntity<String> registerUser(@RequestBody User user) {
      try {
         if (this.userRepository.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.status(409).body("User already registered");
         } else {
            String otp = String.valueOf((new Random()).nextInt(900000) + 100000);
            user.setOtp(otp);
            user.setOtpCreatedAt(LocalDateTime.now());
            user.setVerified(false);
            this.userRepository.save(user);
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Email Verification - OTP");
            message.setText("Your OTP for registration is: " + otp);
            this.mailSender.send(message);
            return ResponseEntity.ok("User registered successfully. OTP sent to email.");
         }
      } catch (Exception var4) {
         var4.printStackTrace();
         return ResponseEntity.status(500).body("Error during registration");
      }
   }

   @PostMapping({"/verify-otp"})
   public ResponseEntity<String> verifyOtp(@RequestParam String email, @RequestParam String otp) {
      User user = this.userRepository.findByEmail(email);
      if (user == null) {
         return ResponseEntity.status(404).body("User not found");
      } else if (!otp.equals(user.getOtp())) {
         return ResponseEntity.status(400).body("Invalid OTP");
      } else if (user.getOtpCreatedAt() != null && user.getOtpCreatedAt().plusMinutes(10L).isBefore(LocalDateTime.now())) {
         return ResponseEntity.status(400).body("OTP expired");
      } else {
         System.out.println("Updating is_verified for email: " + email);
         this.userRepository.updateIsVerifiedByEmail(email);
         System.out.println("Update complete");
         return ResponseEntity.ok("OTP verified successfully!");
      }
   }

   @PostMapping({"/login"})
   public ResponseEntity<String> login(@RequestBody Map<String, String> credentials) {
      String email = (String)credentials.get("email");
      String password = (String)credentials.get("password");
      User user = this.userRepository.findByEmail(email);
      if (user == null) {
         return ResponseEntity.status(404).body("User not found");
      } else if (!user.isVerified()) {
         return ResponseEntity.status(403).body("Email not verified");
      } else {
         return !user.getPassword().equals(password) ? ResponseEntity.status(401).body("Invalid email or password") : ResponseEntity.ok("Login successful");
      }
   }

   @PostMapping({"/send-otp"})
   public ResponseEntity<Map<String, String>> sendOtp(@RequestBody Map<String, String> request) {
      String email = (String)request.get("email");
      String password = (String)request.get("password");
      User user = this.userRepository.findByEmail(email);
      if (user != null && user.getPassword().equals(password)) {
         String otp = String.valueOf((new Random()).nextInt(900000) + 100000);
         user.setOtp(otp);
         user.setOtpCreatedAt(LocalDateTime.now());
         this.userRepository.save(user);

         try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Login OTP Verification");
            message.setText("Your OTP is: " + otp);
            this.mailSender.send(message);
            System.out.println("Login OTP (dev): " + otp);
            return ResponseEntity.ok(Map.of("message", "OTP sent successfully", "otp", otp));
         } catch (Exception var7) {
            var7.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Failed to send OTP"));
         }
      } else {
         return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
      }
   }
   
   @GetMapping("/name")
   public ResponseEntity<String> getUserNameByEmail(@RequestParam String email) {
       Optional<User> user = userRepository.findNameByEmail(email);
       if (user.isPresent()) {
           return ResponseEntity.ok(user.get().getName());
       } else {
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
       }
   }

   @PutMapping("/update")
   public ResponseEntity<String> updateUser(@RequestBody User updatedUser) {
       try {
           User existingUser = userRepository.findByEmail(updatedUser.getEmail());

           if (existingUser == null) {
               return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
           }

           // Update allowed fields
           existingUser.setName(updatedUser.getName());
           existingUser.setMobile(updatedUser.getMobile());
           existingUser.setPassword(updatedUser.getPassword()); 

           userRepository.save(existingUser);
           return ResponseEntity.ok("User updated successfully");
       } catch (Exception e) {
           e.printStackTrace();
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update user");
       }
   }
   
   @GetMapping("/details")
   public ResponseEntity<User> getUserDetailsByEmail(@RequestParam String email) {
       User user = userRepository.findByEmail(email);
       if (user != null) {
           return ResponseEntity.ok(user);
       } else {
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
       }
   }

}