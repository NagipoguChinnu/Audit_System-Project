package com.auditsystem.www.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "file_upload")
public class FileUpload {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name="file_name",unique=true)
    private String fileName;

    private String fileType;
    
    @Column
    private String status;
    
    public String getAuditorName() {
		return auditorName;
	}

	public void setAuditorName(String auditorName) {
		this.auditorName = auditorName;
	}

	public String getScore() {
		return Score;
	}

	public void setScore(String score) {
		Score = score;
	}

	@Column
    private String auditorName;
    
    @Column
    private String Score;

    public String getStatus() {
		return status;
	}
    
	public void setStatus(String status) {
		this.status = status;
	}

    @Lob
    private byte[] document;

    private LocalDateTime uploadedAt;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user; // Assuming your user entity is named UserRegistration

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public byte[] getDocument() {
        return document;
    }

    public void setDocument(byte[] document) {
        this.document = document;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
