package com.auditsystem.www.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.auditsystem.www.model.FileUpload;
import com.auditsystem.www.model.User;
import com.auditsystem.www.repository.FileUploadRepository;
import com.auditsystem.www.repository.UserRepository;

@Service
public class FileUploadService {

    @Autowired
    private FileUploadRepository fileUploadRepository;

    @Autowired
    private UserRepository userRepository;

    public String uploadFile(MultipartFile file, String email) throws IOException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return "User not found";
        }

        // Check if the file with same name already exists for this user
        Optional<FileUpload> existingFile = fileUploadRepository.findByUserAndFileName(user, file.getOriginalFilename());
        if (existingFile.isPresent()) {
            throw new IllegalStateException("File already exists");
        }

        FileUpload fileUpload = new FileUpload();
        fileUpload.setFileName(file.getOriginalFilename());
        fileUpload.setFileType(file.getContentType());
        fileUpload.setDocument(file.getBytes()); // ✅ Store full file content
        fileUpload.setUploadedAt(LocalDateTime.now());
        fileUpload.setUser(user);
        fileUpload.setStatus("Pending"); // ✅ Set document status as "Pending"

        fileUploadRepository.save(fileUpload);
        return "File uploaded successfully!";
    }

    public void deleteFile(String fileName) {
        FileUpload file = fileUploadRepository.findByFileName(fileName);
        if (file != null) {
            fileUploadRepository.delete(file);
        } else {
            throw new RuntimeException("File not found with name: " + fileName);
        }
    }

}
