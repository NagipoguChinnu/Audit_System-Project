package com.auditsystem.www.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.auditsystem.www.model.Contact;
import com.auditsystem.www.repository.ContactRepository;

@Controller
@RequestMapping("/contact")
public class ContactController {
	
	@Autowired
	ContactRepository contactRepository;

	@PostMapping("/send")
	public ResponseEntity<String> contact(@RequestBody Contact contactForm) {
	    // Save to DB or send email
		
		contactRepository.save(contactForm);
	    return ResponseEntity.ok("Message received");
	}

}
