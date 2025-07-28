package com.auditsystem.www.repository;

import com.auditsystem.www.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {
   Admin findByEmail(String email);

   @Modifying
   @Transactional
   @Query(
      value = "UPDATE admin_login SET is_verified = 1 WHERE email = :email",
      nativeQuery = true
   )
   void updateIsVerifiedByEmail(@Param("email") String email);
}