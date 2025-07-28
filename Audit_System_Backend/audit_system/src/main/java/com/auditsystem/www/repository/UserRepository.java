package com.auditsystem.www.repository;



import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.auditsystem.www.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {
   User findByEmail(String email);

   @Modifying
   @Transactional
   @Query(
      value = "UPDATE user_registration SET is_verified = 1 WHERE email = :email",
      nativeQuery = true
   )
   void updateIsVerifiedByEmail(@Param("email") String email);
   void delete(User user);
   Optional<User> findNameByEmail(String email);
}