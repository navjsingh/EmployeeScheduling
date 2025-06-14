package com.navCorporation.vacationTracker.dto;

import com.navCorporation.vacationTracker.model.VacationRequest;
import java.time.LocalDate;

// This DTO is for sending vacation request info to the client.
public class VacationRequestDto {
    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    private VacationRequest.Status status;
    private int requestedHours;
    private String note;
    private String denialReason;
    private Long employeeId;
    private String employeeName;

    public VacationRequestDto() {}

    public VacationRequestDto(VacationRequest request) {
        this.id = request.getId();
        this.startDate = request.getStartDate();
        this.endDate = request.getEndDate();
        this.status = request.getStatus();
        this.requestedHours = request.getRequestedHours();
        this.note = request.getNote();
        this.denialReason = request.getDenialReason();
        this.employeeId = request.getEmployee().getId();
        this.employeeName = request.getEmployee().getName();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public VacationRequest.Status getStatus() { return status; }
    public void setStatus(VacationRequest.Status status) { this.status = status; }
    public int getRequestedHours() { return requestedHours; }
    public void setRequestedHours(int requestedHours) { this.requestedHours = requestedHours; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public String getDenialReason() { return denialReason; }
    public void setDenialReason(String denialReason) { this.denialReason = denialReason; }
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
}
