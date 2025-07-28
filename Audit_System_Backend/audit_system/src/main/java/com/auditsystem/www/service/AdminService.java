 package com.auditsystem.www.service;

import com.auditsystem.www.model.Admin;
import com.auditsystem.www.repository.AdminRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
   @Autowired
   private AdminRepository adminRepo;

   @Transactional
   public String verifyOtp(String email, String otp) {
      Admin admin = this.adminRepo.findByEmail(email);
      if (admin == null) {
         return "Admin not found!";
      } else if (admin.getOtp() != null && admin.getOtpCreatedAt() != null) {
         if (LocalDateTime.now().isAfter(admin.getOtpCreatedAt().plusMinutes(10L))) {
            return "OTP expired!";
         } else if (!otp.equals(admin.getOtp())) {
            return "Invalid OTP!";
         } else {
            admin.setVerified(true);
            admin.setOtp((String)null);
            admin.setOtpCreatedAt((LocalDateTime)null);
            this.adminRepo.save(admin);
            return "OTP verified successfully!";
         }
      } else {
         return "OTP not generated!";
      }
   }

   public String generateAndSaveOtp(Admin admin) {
      String otp = String.format("%06d", (new Random()).nextInt(999999));
      admin.setOtp(otp);
      admin.setOtpCreatedAt(LocalDateTime.now());
      admin.setVerified(false);
      this.adminRepo.save(admin);
      return otp;
   }
}