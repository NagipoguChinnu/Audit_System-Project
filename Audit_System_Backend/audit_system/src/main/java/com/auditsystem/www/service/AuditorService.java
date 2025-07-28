package com.auditsystem.www.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.auditsystem.www.model.Auditor;
import com.auditsystem.www.repository.AuditorRepository;

import jakarta.transaction.Transactional;

@Service
public class AuditorService {

    @Autowired
    private AuditorRepository auditorRepo;

    public String registerUser(Auditor auditor) {
        // Check if auditor already exists
        if (auditorRepo.findByEmail(auditor.getEmail()) != null) {
            return "Auditor already registered.";
        }

        String otp = String.format("%06d", new Random().nextInt(900000) + 100000);
        auditor.setOtp(otp);
        auditor.setOtpCreatedAt(LocalDateTime.now());
        auditor.setVerified(false);
        auditorRepo.save(auditor);
        return "User registered. OTP generated.";
    }

    @Transactional
    public String verifyOtp(String email, String otp) {
        Auditor auditor = auditorRepo.findByEmail(email);
        if (auditor == null) {
            return "User not found!";
        }

        if (auditor.getOtp() == null || auditor.getOtpCreatedAt() == null) {
            return "OTP not generated!";
        }

        if (LocalDateTime.now().isAfter(auditor.getOtpCreatedAt().plusMinutes(10))) {
            return "OTP expired!";
        }

        if (!otp.equals(auditor.getOtp())) {
            return "Invalid OTP!";
        }

        auditor.setVerified(true);
        auditor.setOtp(null);
        auditor.setOtpCreatedAt(null);
        auditorRepo.save(auditor);
        return "OTP verified successfully!";
    }
}
