package com.auditsystem.www.service;

import com.auditsystem.www.model.User;
import com.auditsystem.www.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
   @Autowired
   private UserRepository userRepo;

   public String registerUser(User user) {
      String otp = String.format("%06d", (new Random()).nextInt(999999));
      user.setOtp(otp);
      user.setOtpCreatedAt(LocalDateTime.now());
      user.setVerified(false);
      this.userRepo.save(user);
      return "User registered. OTP generated.";
   }

   @Transactional
   public String verifyOtp(String email, String otp) {
      User user = this.userRepo.findByEmail(email);
      if (user == null) {
         return "User not found!";
      } else if (user.getOtp() != null && user.getOtpCreatedAt() != null) {
         if (LocalDateTime.now().isAfter(user.getOtpCreatedAt().plusMinutes(10L))) {
            return "OTP expired!";
         } else if (!otp.equals(user.getOtp())) {
            return "Invalid OTP!";
         } else {
            user.setVerified(true);
            user.setOtp((String)null);
            user.setOtpCreatedAt((LocalDateTime)null);
            this.userRepo.save(user);
            return "OTP verified successfully!";
         }
      } else {
         return "OTP not generated!";
      }
   }
}