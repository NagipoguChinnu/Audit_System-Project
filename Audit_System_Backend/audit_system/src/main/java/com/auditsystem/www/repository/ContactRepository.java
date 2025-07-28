package com.auditsystem.www.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.auditsystem.www.model.Contact;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Integer>{

}
