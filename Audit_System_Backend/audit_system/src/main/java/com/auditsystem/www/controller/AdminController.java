package com.auditsystem.www.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.auditsystem.www.model.Admin;
import com.auditsystem.www.model.Assignment;
import com.auditsystem.www.model.Auditor;
import com.auditsystem.www.model.FileUpload;
import com.auditsystem.www.model.User;
import com.auditsystem.www.repository.AdminRepository;
import com.auditsystem.www.repository.AssignmentRepository;
import com.auditsystem.www.repository.AuditorRepository;
import com.auditsystem.www.repository.FileUploadRepository;
import com.auditsystem.www.repository.UserRepository;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileUploadRepository fileUploadRepository;
    
    @Autowired
    private AuditorRepository auditorRepository;

    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    private AssignmentRepository assignmentRepo;

    // ✅ 1. SEND OTP
    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email").trim();
        String password = request.get("password").trim();

        Admin admin = adminRepository.findByEmail(email);
        if (admin != null && admin.getPassword().trim().equals(password)) {
            String otp = String.valueOf(new Random().nextInt(900000) + 100000);
            admin.setOtp(otp);
            admin.setOtpCreatedAt(LocalDateTime.now());
            adminRepository.save(admin);

            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(email);
                message.setSubject("Admin OTP Verification");
                message.setText("Your OTP is: " + otp + "\nIt is valid for 10 minutes only.");
                mailSender.send(message);

                return ResponseEntity.ok(Map.of("message", "OTP sent successfully", "otp", otp));
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body(Map.of("message", "Failed to send OTP"));
            }
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }
    }

    // ✅ 2. LOGIN
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        Admin admin = adminRepository.findByEmail(email);

        if (admin != null && admin.getPassword().equals(password)) {
            if (!admin.isVerified()) {
                return ResponseEntity.status(403).body("Please verify OTP before logging in");
            } else {
                return ResponseEntity.ok("Login successful");
            }
        } else {
            return ResponseEntity.status(401).body("Invalid email or password login");
        }
    }

    // ✅ 3. VERIFY OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        Admin admin = adminRepository.findByEmail(email);
        if (admin == null) {
            return ResponseEntity.status(404).body("User not found");
        } else if (!otp.equals(admin.getOtp())) {
            return ResponseEntity.status(400).body("Invalid OTP");
        } else if (admin.getOtpCreatedAt().plusMinutes(10).isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(400).body("OTP expired");
        } else {
            admin.setVerified(true);
            admin.setOtp(null);
            admin.setOtpCreatedAt(null);
            adminRepository.save(admin);
            adminRepository.updateIsVerifiedByEmail(email);
            return ResponseEntity.ok("OTP verified");
        }
    }

    // ✅ 4. GET USERS + FILES FOR ADMIN DASHBOARD
    @GetMapping("/users-with-files")
    public ResponseEntity<List<Map<String, Object>>> getAllUsersWithFiles() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> response = new ArrayList<>();

        for (User user : users) {
            Map<String, Object> userData = new HashMap<>();
            userData.put("userId", user.getId());
            userData.put("username", user.getName());
            userData.put("email", user.getEmail());
            userData.put("mobile", user.getMobile());

            List<FileUpload> files = fileUploadRepository.findByUser(user);
            List<Map<String, Object>> fileDataList = new ArrayList<>();

            for (FileUpload file : files) {
                Map<String, Object> fileData = new HashMap<>();
                fileData.put("fileName", file.getFileName());
                fileData.put("fileType", file.getFileType());
                fileData.put("uploadedAt", file.getUploadedAt());
                fileData.put("id", file.getId());
                fileDataList.add(fileData);
            }

            // 🔁 Updated key to "files" to match frontend
            userData.put("files", fileDataList);
            response.add(userData);
        }

        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/delete-user")
    @Transactional
    public ResponseEntity<String> deleteUserByEmail(@RequestParam String email) {
        System.out.println("Deleting user: " + email); // Debug log

        try {
            User user = userRepository.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(404).body("User not found");
            }

            fileUploadRepository.deleteByUser(user);
            userRepository.delete(user);

            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error deleting user");
        }
    }
    
    @DeleteMapping("/delete-auditor")
    @Transactional
    public ResponseEntity<String> deleteAuditor(@RequestParam String email) {
        Auditor auditor = auditorRepository.findByEmail(email);
        if (auditor == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Auditor not found");
        }

        auditorRepository.deleteByEmail(email);
        return ResponseEntity.ok("Auditor deleted successfully");
    }

    @GetMapping("/assignments")
    public List<Assignment> getAllAssignments() {
        return assignmentRepo.findAll();
    }


}
