package com.auditsystem.www.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.auditsystem.www.model.FileUpload;
import com.auditsystem.www.model.User;
import com.auditsystem.www.repository.FileUploadRepository;
import com.auditsystem.www.repository.UserRepository;
import com.auditsystem.www.service.FileUploadService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class FileUploadController {

    @Autowired
    private FileUploadService fileUploadService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileUploadRepository fileUploadRepository;

    // ✅ Upload a file for a specific user by email
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("email") String email) {

        try {
            String result = fileUploadService.uploadFile(file, email);

            if ("User not found".equals(result)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
            }

            return ResponseEntity.ok(result);

        } catch (DataIntegrityViolationException ex) {
            Throwable cause = ex.getCause();
            if (cause instanceof ConstraintViolationException) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("File already exists");
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed: " + ex.getMessage());
        } catch (Exception e) {
            // ❌ Generic server error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Upload failed: " + e.getMessage());
        }
    }

    @GetMapping("/files")
    public ResponseEntity<List<Map<String, Object>>> getFilesByEmail(@RequestParam String email) {
        User user = userRepository.findByEmail(email);
        List<FileUpload> files = fileUploadRepository.findByUser(user);

        List<Map<String, Object>> response = new ArrayList<>();

        for (FileUpload file : files) {
            Map<String, Object> fileData = new HashMap<>();
            fileData.put("fileName", file.getFileName());
            fileData.put("fileType", file.getFileType());
            fileData.put("uploadedAt", file.getUploadedAt());
            fileData.put("status", file.getStatus()); // Pending/Assigned/Completed
            fileData.put("score", file.getScore());   // Could be null
            fileData.put("auditorName", file.getAuditorName() != null ? file.getAuditorName() : "Not Assigned");

            response.add(fileData);
        }

        return ResponseEntity.ok(response);
    }


    // ✅ Inline file view (PDF or images directly in browser)
    @GetMapping("/files/view/{fileName}")
    public ResponseEntity<Resource> viewFile(@PathVariable String fileName) {
        FileUpload fileUpload = fileUploadRepository.findByFileName(fileName);
        if (fileUpload == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        ByteArrayResource resource = new ByteArrayResource(fileUpload.getDocument());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(fileUpload.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileUpload.getFileName() + "\"")
                .body(resource);
    }

    // ✅ Download file for a user using email and filename
    @GetMapping("/files/download")
    public ResponseEntity<Resource> downloadFile(
            @RequestParam String email,
            @RequestParam String filename) {

        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Optional<FileUpload> fileRecordOpt = fileUploadRepository.findByUserAndFileName(user, filename);
        if (fileRecordOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        FileUpload fileRecord = fileRecordOpt.get();
        byte[] data = fileRecord.getDocument();

        ByteArrayResource resource = new ByteArrayResource(data);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(data.length)
                .body(resource);
    }
    
    @GetMapping("/get-uploaded-file/{id}")
    public ResponseEntity<byte[]> getUploadedFile(@PathVariable int id) {
        Optional<FileUpload> fileUploadOpt = fileUploadRepository.findById(id);
        if (fileUploadOpt.isPresent()) {
            FileUpload file = fileUploadOpt.get();
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + file.getFileName())
                    .body(file.getDocument());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    
    @GetMapping("/uploaded-files/user")
    public List<FileUpload> getFilesByUser(@RequestParam String email) {
        return fileUploadRepository.findByUserEmail(email);
    }
    
    @DeleteMapping("/delete-file/{fileName}")
    public ResponseEntity<String> deleteFile(@PathVariable String fileName) {
        try {
            fileUploadService.deleteFile(fileName); // Your service method to delete
            return ResponseEntity.ok("File deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting file.");
        }
    }
}