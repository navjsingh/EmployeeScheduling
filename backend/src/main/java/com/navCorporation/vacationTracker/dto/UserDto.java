package com.navCorporation.vacationTracker.dto;

import com.navCorporation.vacationTracker.model.Role;
import com.navCorporation.vacationTracker.model.User;
import java.util.Set;
import java.util.stream.Collectors;

// This DTO is for sending user info to the client, hiding sensitive data like passwords.
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private int totalVacationHours;
    private int usedVacationHours;
    private Set<Long> assignedEmployeeIds;
    private String teamName;
    private String teamManagerName;

    public UserDto() {}

    // Constructor to map from User entity
    public UserDto(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.totalVacationHours = user.getTotalVacationHours();
        this.usedVacationHours = user.getUsedVacationHours();
        if (user.getAssignedEmployees() != null) {
            this.assignedEmployeeIds = user.getAssignedEmployees().stream()
                .map(User::getId)
                .collect(Collectors.toSet());
        }
        
        // Set team information
        if (user.getTeam() != null) {
            this.teamName = user.getTeam().getName();
        }
        if (user.getTeamManager() != null) {
            this.teamManagerName = user.getTeamManager().getName();
        }
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public int getTotalVacationHours() { return totalVacationHours; }
    public void setTotalVacationHours(int totalVacationHours) { this.totalVacationHours = totalVacationHours; }
    public int getUsedVacationHours() { return usedVacationHours; }
    public void setUsedVacationHours(int usedVacationHours) { this.usedVacationHours = usedVacationHours; }
    public Set<Long> getAssignedEmployeeIds() { return assignedEmployeeIds; }
    public void setAssignedEmployeeIds(Set<Long> assignedEmployeeIds) { this.assignedEmployeeIds = assignedEmployeeIds; }
    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }
    public String getTeamManagerName() { return teamManagerName; }
    public void setTeamManagerName(String teamManagerName) { this.teamManagerName = teamManagerName; }
}
