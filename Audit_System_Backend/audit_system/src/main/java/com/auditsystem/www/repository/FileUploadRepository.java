package com.auditsystem.www.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.auditsystem.www.model.FileUpload;
import com.auditsystem.www.model.User;

public interface FileUploadRepository extends JpaRepository<FileUpload, Integer> {

    List<FileUpload> findByUser(User user);
    FileUpload findByFileName(String fileName);
    Optional<FileUpload> findByUserAndFileName(User user, String fileName);
    void deleteByUser(User user);
    
    Optional<FileUpload> findById(int fileId);
    
    List<FileUpload> findByUserEmail(String email);

}
