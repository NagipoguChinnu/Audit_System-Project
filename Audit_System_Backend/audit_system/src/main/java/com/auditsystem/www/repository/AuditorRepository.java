package com.auditsystem.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.auditsystem.www.model.Auditor;

public interface AuditorRepository extends JpaRepository<Auditor, Integer> {

    // Find auditor by email
    Auditor findByEmail(String email);

    // Update is_verified flag by email
    @Modifying
    @Transactional
    @Query(value = "UPDATE auditor_registration SET is_verified = true WHERE email = :email", nativeQuery = true)
    void updateIsVerifiedByEmail(@Param("email") String email);
    
    void deleteByEmail(String email);
}
