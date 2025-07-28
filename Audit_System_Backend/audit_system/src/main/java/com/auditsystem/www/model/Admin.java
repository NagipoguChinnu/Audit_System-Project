package com.auditsystem.www.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(
   name = "admin_login"
)
public class Admin {
   @Id
   @GeneratedValue(
      strategy = GenerationType.IDENTITY
   )
   private int id;
   @Column(
      name = "email"
   )
   private String email;
   @Column
   private String password;
   @Column
   private String otp;
   @Column(
      name = "otp_created_at"
   )
   private LocalDateTime otpCreatedAt;
   @Column(
      name = "is_verified"
   )
   private Boolean verified;

   public String getEmail() {
      return this.email;
   }

   public void setEmail(String email) {
      this.email = email;
   }

   public String getPassword() {
      return this.password;
   }

   public void setPassword(String password) {
      this.password = password;
   }

   public String getOtp() {
      return this.otp;
   }

   public void setOtp(String otp) {
      this.otp = otp;
   }

   public LocalDateTime getOtpCreatedAt() {
      return this.otpCreatedAt;
   }

   public void setOtpCreatedAt(LocalDateTime otpCreatedAt) {
      this.otpCreatedAt = otpCreatedAt;
   }

   public boolean isVerified() {
      return this.verified;
   }

   public void setVerified(boolean verified) {
      this.verified = verified;
   }
}