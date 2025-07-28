package com.auditsystem.www.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.auditsystem.www.model.Assignment;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    List<Assignment> findByAuditorEmail(String auditorEmail);

    List<Assignment> findByAuditorEmailAndFileName(String auditorEmail, String fileName);

    List<Assignment> findByUserEmail(String userEmail);

    boolean existsByAuditorEmailAndFileName(String auditorEmail, String fileName);
    
    List<Assignment> findByAuditorEmailIgnoreCase(String auditorEmail); // <-- updated
    
    List<Assignment> findByStatusIgnoreCase(String status);
    List<Assignment> findByStatusNotIgnoreCase(String status);
    
    Assignment findByFileName(String fileName);
    
    
    Optional<Assignment> findByUserEmailAndFileName(String userEmail, String fileName);


}
