package com.navCorporation.vacationTracker.dto;

import com.navCorporation.vacationTracker.model.Role;

public class AdminUserUpdateRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
    private int totalVacationHours;
    private Long teamId;
    private Long managerId;

    public AdminUserUpdateRequest() {}
    
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public int getTotalVacationHours() {
        return totalVacationHours;
    }

    public void setTotalVacationHours(int totalVacationHours) {
        this.totalVacationHours = totalVacationHours;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }
}
