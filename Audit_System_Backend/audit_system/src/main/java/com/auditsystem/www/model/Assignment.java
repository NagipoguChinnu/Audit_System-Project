package com.auditsystem.www.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "assignments")  // Naming table explicitly is a good practice
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column
    private String userName;
    
    @Column
    private String auditorName;

    @Column
    private String auditorEmail;

    @Column
    private String userEmail;

    @Column
    private String fileName;
    
    @Column
    private LocalDateTime assignedAt;
    
    public LocalDateTime getAssignedAt() {
		return assignedAt;
	}

	public void setAssignedAt(LocalDateTime assignedAt) {
		this.assignedAt = assignedAt;
	}

	@Column
    private Integer score;

    public Integer getScore() {
		return score;
	}

	public void setScore(Integer score) {
		this.score = score;
	}

	@Column(name = "status", nullable=false)
    private String status="pending";

    public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Lob
    @Column(name = "file_data", columnDefinition = "LONGBLOB", nullable = false)
    private byte[] fileData;  // Stores the actual file content
	
	public Assignment() {}


    public Assignment(String auditorEmail, String userEmail, String fileName,
    		byte[] fileData, Integer score, String userName, String auditorName) {
        this.auditorEmail = auditorEmail;
        this.userEmail = userEmail;
        this.fileName = fileName;
        this.fileData = fileData;
        this.score=score;
        this.userName=userName;
        this.auditorName=auditorName;}

    // Getters and setters
    public Long getId() {
        return id;
    }

    public String getAuditorEmail() {
        return auditorEmail;
    }

    public void setAuditorEmail(String auditorEmail) {
        this.auditorEmail = auditorEmail;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public byte[] getFileData() {
        return fileData;
    }

    public void setFileData(byte[] fileData) {
        this.fileData = fileData;
    }

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getAuditorName() {
		return auditorName;
	}

	public void setAuditorName(String auditorName) {
		this.auditorName = auditorName;
	}
}
