package com.auditsystem.www.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.auditsystem.www.model.Assignment;
import com.auditsystem.www.model.AssignmentDTO;
import com.auditsystem.www.model.Auditor;
import com.auditsystem.www.model.User;
import com.auditsystem.www.repository.AssignmentRepository;
import com.auditsystem.www.repository.AuditorRepository;
import com.auditsystem.www.repository.FileUploadRepository;
import com.auditsystem.www.repository.UserRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AssignmentController {

    @Autowired
    private AssignmentRepository assignmentRepo;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AuditorRepository auditorRepository;
    
    @Autowired
    private FileUploadRepository fileUploadRepository;
    

    @PostMapping("/assign-document")
    public ResponseEntity<String> assignDocument(
            @RequestParam("auditorEmail") String auditorEmail,
            @RequestParam("userEmail") String userEmail,
            @RequestParam("auditorName") String auditorName,
            @RequestParam("userName") String userName,
            @RequestParam("fileName") String fileName,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            System.out.println("📥 Received file assign request");
            System.out.println("Auditor: " + auditorName + " (" + auditorEmail + ")");
            System.out.println("User: " + userName + " (" + userEmail + ")");
            System.out.println("File Name: " + fileName);

            if (file.isEmpty()) {
                System.out.println("⚠️ File is empty");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty");
            }

            // ✅ Save assignment directly with file data
            Assignment assignment = new Assignment();
            assignment.setAuditorEmail(auditorEmail);
            assignment.setUserEmail(userEmail);
            assignment.setAuditorName(auditorName);
            assignment.setUserName(userName);
            assignment.setFileName(fileName);
            assignment.setFileData(file.getBytes());  // ✅ Save file content
            assignment.setStatus("Assigned");
            assignment.setAssignedAt(LocalDateTime.now());


            assignmentRepo.save(assignment);
            System.out.println("✅ Assignment saved successfully");

            return ResponseEntity.ok("File assigned successfully");

        } catch (Exception e) {
            System.out.println("❌ Exception occurred:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File assign failed");
        }
    }


 // ✅ Get all assigned documents including completed ones
    @GetMapping("/assigned-documents")
    public ResponseEntity<List<Map<String, Object>>> getAllAssignedDocuments() {
        List<Assignment> assignments = assignmentRepo.findAll();
        System.out.println("🟡 Total Assignments: " + assignments.size());

        List<Map<String, Object>> response = new ArrayList<>();

        for (Assignment assignment : assignments) {
            Map<String, Object> data = new HashMap<>();

            // Ensure values are not null before accessing
            data.put("fileName", assignment.getFileName());
            data.put("auditorName", assignment.getAuditorName());
            data.put("userName", assignment.getUserName());
            data.put("auditorEmail", assignment.getAuditorEmail());
            data.put("userEmail", assignment.getUserEmail());
            data.put("status", assignment.getStatus());
            data.put("score", assignment.getScore());  // may be null

            response.add(data);
        }

        System.out.println("✅ Final Response Size: " + response.size());
        return ResponseEntity.ok(response);
    }



    // ✅ Get all documents assigned to one auditor (case-insensitive)
    @GetMapping("/assignments/{auditorEmail}")
    public List<Assignment> getAssignments(@PathVariable String auditorEmail) {
        System.out.println("📂 Fetching assignments for auditor: " + auditorEmail);
        List<Assignment> assignments = assignmentRepo.findByAuditorEmailIgnoreCase(auditorEmail);
        System.out.println("✅ Total assignments found: " + assignments.size());
        return assignments;
    }

    @PutMapping("/assignments/{id}/complete")
    public ResponseEntity<String> markAsCompleted(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> requestBody) {

        Optional<Assignment> optional = assignmentRepo.findById(id);
        if (optional.isPresent()) {
            Integer score = requestBody.get("score");

            if (score == null || score < 0 || score > 100) {
                return ResponseEntity.badRequest().body("Score must be between 0 and 100");
            }

            Assignment assignment = optional.get();
            assignment.setStatus("Completed");
            assignment.setScore(score);
            assignmentRepo.save(assignment);

            return ResponseEntity.ok("Status updated to Completed with score");
        } else {
            return ResponseEntity.status(404).body("Assignment not found");
        }
    }
    
    @GetMapping("/assignments/user")
    public ResponseEntity<List<AssignmentDTO>> getUserAssignments(@RequestParam String email) {
        List<Assignment> assignments = assignmentRepo.findByUserEmail(email);
        List<AssignmentDTO> assignmentDTOs = new ArrayList<>();

        for (Assignment assignment : assignments) {
            // ✅ Get user name
            User user = userRepository.findByEmail(assignment.getUserEmail());
            String username = user != null ? user.getName() : "Unknown User";

            // ✅ Get auditor name
            String auditorName = null;
            if (assignment.getAuditorEmail() != null) {
                Auditor auditor = auditorRepository.findByEmail(assignment.getAuditorEmail());
                auditorName = auditor != null ? auditor.getName() : "Unknown Auditor";
            }

            AssignmentDTO dto = new AssignmentDTO(assignment, username, auditorName);
            assignmentDTOs.add(dto);
        }

        return ResponseEntity.ok(assignmentDTOs);
    }


}
