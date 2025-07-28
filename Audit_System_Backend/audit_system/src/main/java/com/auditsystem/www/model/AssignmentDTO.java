package com.auditsystem.www.model;

import java.time.LocalDateTime;

public class AssignmentDTO {
    private Long id;
    private String fileName;
    private String status;
    private Integer score;
    private String userEmail;
    private String auditorEmail;
    private String username;
    private String auditorName;
    private LocalDateTime assignedAt;

    public AssignmentDTO(Assignment assignment,String username, String auditorName) {
        this.id = assignment.getId();
        this.fileName = assignment.getFileName();
        this.status = assignment.getStatus();
        this.score = assignment.getScore();
        this.userEmail = assignment.getUserEmail();
        this.auditorEmail = assignment.getAuditorEmail();
        this.username = username;
        this.auditorName = auditorName;
        this.assignedAt = assignment.getAssignedAt();
    }
    
   
    public Long getId() {
        return id;
    }
    
    public LocalDateTime getAssignedAt() {
    	return assignedAt;
    }

    public String getFileName() {
        return fileName;
    }

    public String getStatus() {
        return status;
    }

    public Integer getScore() {
        return score;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public String getAuditorEmail() {
        return auditorEmail;
    }

    public String getUsername() {
        return username;
    }

    public String getAuditorName() {
        return auditorName;
    }
}
