package com.auditsystem.www.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.auditsystem.www.model.Assignment;
import com.auditsystem.www.model.Auditor;
import com.auditsystem.www.repository.AssignmentRepository;
import com.auditsystem.www.repository.AuditorRepository;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping({"/auditor"})
@CrossOrigin(origins = {"http://localhost:3000"})
public class AuditorController {

   @Autowired
   private AuditorRepository auditorRepository;

   @Autowired
   private JavaMailSender mailSender;
   
   @Autowired
   private AssignmentRepository assignmentRepository;

   @PostMapping({"/register"})
   public ResponseEntity<String> registerUser(@RequestBody Auditor auditor) {
      try {
         if (this.auditorRepository.findByEmail(auditor.getEmail()) != null) {
            return ResponseEntity.status(409).body("Auditor already registered");
         } else {
            String otp = String.valueOf((new Random()).nextInt(900000) + 100000);
            auditor.setOtp(otp);
            auditor.setOtpCreatedAt(LocalDateTime.now());
            auditor.setVerified(false);
            this.auditorRepository.save(auditor);
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(auditor.getEmail());
            message.setSubject("Email Verification - OTP");
            message.setText("Your OTP for registration is: " + otp);
            this.mailSender.send(message);
            return ResponseEntity.ok("Auditor registered successfully. OTP sent to email.");
         }
      } catch (Exception var4) {
         var4.printStackTrace();
         return ResponseEntity.status(500).body("Error during registration");
      }
   }

   @PostMapping({"/verify-otp"})
   public ResponseEntity<String> verifyOtp(@RequestParam String email, @RequestParam String otp) {
      Auditor auditor = this.auditorRepository.findByEmail(email);
      if (auditor == null) {
         return ResponseEntity.status(404).body("User not found");
      } else if (!otp.equals(auditor.getOtp())) {
         return ResponseEntity.status(400).body("Invalid OTP");
      } else if (auditor.getOtpCreatedAt() != null && auditor.getOtpCreatedAt().plusMinutes(10L).isBefore(LocalDateTime.now())) {
         return ResponseEntity.status(400).body("OTP expired");
      } else {
         System.out.println("Updating is_verified for email: " + email);
         this.auditorRepository.updateIsVerifiedByEmail(email);
         System.out.println("Update complete");
         return ResponseEntity.ok("OTP verified successfully!");
      }
   }

   @PostMapping({"/login"})
   public ResponseEntity<String> login(@RequestBody Map<String, String> credentials) {
      String email = credentials.get("email");
      String password = credentials.get("password");
      Auditor auditor = this.auditorRepository.findByEmail(email);
      if (auditor == null) {
         return ResponseEntity.status(404).body("User not found");
      } else if (!auditor.isVerified()) {
         return ResponseEntity.status(403).body("Email not verified");
      } else {
         return !auditor.getPassword().equals(password)
            ? ResponseEntity.status(401).body("Invalid email or password")
            : ResponseEntity.ok("Login successful");
      }
   }

   @PostMapping({"/send-otp"})
   public ResponseEntity<Map<String, String>> sendOtp(@RequestBody Map<String, String> request) {
      String email = request.get("email");
      String password = request.get("password");
      Auditor auditor = this.auditorRepository.findByEmail(email);
      if (auditor != null && auditor.getPassword().equals(password)) {
         String otp = String.valueOf((new Random()).nextInt(900000) + 100000);
         auditor.setOtp(otp);
         auditor.setOtpCreatedAt(LocalDateTime.now());
         this.auditorRepository.save(auditor);

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

   // ✅ NEW: Fetch Auditor by email
   @GetMapping("/get")
   public ResponseEntity<?> getAuditorByEmail(@RequestParam String email) {
      try {
         Auditor auditor = auditorRepository.findByEmail(email);
         if (auditor == null) {
            return ResponseEntity.status(404).body("Auditor not found");
         }
         return ResponseEntity.ok(auditor);
      } catch (Exception e) {
         e.printStackTrace();
         return ResponseEntity.status(500).body("Error fetching auditor details");
      }
   }

   // ✅ NEW: Fetch all auditors
   @GetMapping("/all")
   public ResponseEntity<?> getAllAuditors() {
      try {
         List<Auditor> auditors = auditorRepository.findAll();
         return ResponseEntity.ok(auditors);
      } catch (Exception e) {
         e.printStackTrace();
         return ResponseEntity.status(500).body("Error fetching auditors");
      }
   }
   
   @GetMapping("/document/{id}")
   public ResponseEntity<byte[]> getAssignedDocument(@PathVariable Long id) {
       Optional<Assignment> assignmentOpt = assignmentRepository.findById(id);
       if (assignmentOpt.isPresent()) {
           Assignment assignment = assignmentOpt.get();
           return ResponseEntity.ok()
                   .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + assignment.getFileName() + "\"")
                   .body(assignment.getFileData());
       } else {
           return ResponseEntity.notFound().build();
       }
   }

   @PostMapping("/assign")
   public ResponseEntity<String> assignDocument(
       @RequestParam("auditorEmail") String auditorEmail,
       @RequestParam("userEmail") String userEmail,
       @RequestParam("fileName") String fileName,
       @RequestParam("file") MultipartFile file,
       @RequestParam("score") Integer score) {

       try {
           byte[] fileData = file.getBytes();

           Assignment assignment = new Assignment();
           assignment.setAuditorEmail(auditorEmail);
           assignment.setUserEmail(userEmail);
           assignment.setFileName(fileName);
           assignment.setFileData(fileData); // Your entity must support this
           assignment.setScore(score);

           assignmentRepository.save(assignment);

           return ResponseEntity.ok("Document assigned successfully!");
       } catch (IOException e) {
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                   .body("Error processing file: " + e.getMessage());
       }
   }
   
   @GetMapping("/view-by-id/{id}")
   public void viewFileById(@PathVariable Long id, HttpServletResponse response) throws IOException {
       Optional<Assignment> optionalAssignment = assignmentRepository.findById(id);

       if (optionalAssignment.isEmpty()) {
           response.setStatus(HttpServletResponse.SC_NOT_FOUND);
           return;
       }

       Assignment assignment = optionalAssignment.get();
       byte[] fileData = assignment.getFileData();
       String fileName = assignment.getFileName().toLowerCase();

       // Set correct content type
       String contentType;
       if (fileName.endsWith(".pdf")) {
           contentType = "application/pdf";
       } else if (fileName.endsWith(".png")) {
           contentType = "image/png";
       } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
           contentType = "image/jpeg";
       } else if (fileName.endsWith(".txt")) {
           contentType = "text/plain";
       } else {
           contentType = "application/octet-stream";
       }

       response.setContentType(contentType);
       response.setHeader("Content-Disposition", "inline; filename=\"" + assignment.getFileName() + "\"");
       response.setContentLength(fileData.length);

       try (ServletOutputStream outputStream = response.getOutputStream()) {
           outputStream.write(fileData);
           outputStream.flush();
       }
   }

   @PutMapping("/assignments/{assignmentId}/complete")
   public ResponseEntity<String> markAsComplete(@PathVariable Long assignmentId) {
       Optional<Assignment> assignmentOpt = assignmentRepository.findById(assignmentId);
       if (assignmentOpt.isPresent()) {
           Assignment assignment = assignmentOpt.get();
           assignment.setStatus("Completed"); // 👈 Set new status
           assignmentRepository.save(assignment); // 👈 Persist change
           return ResponseEntity.ok("Marked as completed");
       } else {
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Assignment not found");
       }
   }
   
   @GetMapping("/name")
   public ResponseEntity<String> getAuditorName(@RequestParam String email) {
       Auditor auditor = auditorRepository.findByEmail(email);
       if (auditor != null) {
           return ResponseEntity.ok(auditor.getName());
       } else {
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Name not found");
       }
   }

   @PutMapping("/update")
   public ResponseEntity<String> updateAuditor(@RequestBody Auditor updatedAuditor) {
       Auditor auditor = auditorRepository.findByEmail(updatedAuditor.getEmail());
       if (auditor == null) {
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Auditor not found");
       }

       auditor.setName(updatedAuditor.getName());
       auditor.setMobile(updatedAuditor.getMobile());
       auditor.setPassword(updatedAuditor.getPassword());

       auditorRepository.save(auditor);
       return ResponseEntity.ok("Auditor updated successfully");
   }

}
