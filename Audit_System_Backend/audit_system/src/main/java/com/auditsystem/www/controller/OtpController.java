package com.auditsystem.www.controller;

import java.util.Map;
import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api"})
@CrossOrigin(
   origins = {"http://localhost:3000"}
)
public class OtpController {
   @Autowired
   private JavaMailSender mailSender;

   @PostMapping({"/send-otp"})
   public ResponseEntity<Map<String, String>> sendOtp(@RequestBody Map<String, String> request) {
      String email = (String)request.get("email");
      String otp = String.valueOf((new Random()).nextInt(900000) + 100000);

      try {
         SimpleMailMessage message = new SimpleMailMessage();
         message.setTo(email);
         message.setSubject("Your OTP Code");
         message.setText("Your OTP is: " + otp);
         this.mailSender.send(message);
         return ResponseEntity.ok(Map.of("message", "OTP sent successfully", "otp", otp));
      } catch (Exception var5) {
         var5.printStackTrace();
         return ResponseEntity.status(500).body(Map.of("message", "Failed to send OTP"));
      }
   }
}