package com.navCorporation.vacationTracker.dto;

import com.navCorporation.vacationTracker.model.Role;

public class AdminUserUpdateRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
    private int totalVacationHours;

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
}
