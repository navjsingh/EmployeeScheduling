package com.navCorporation.vacationTracker.dto;

import com.navCorporation.vacationTracker.model.Team;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TeamDto {
    private Long id;
    
    @NotBlank(message = "Team name is required")
    @Size(min = 1, max = 100, message = "Team name must be between 1 and 100 characters")
    private String name;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    private int memberCount;
    private int managerCount;

    public TeamDto() {
    }

    public TeamDto(Team team) {
        this.id = team.getId();
        this.name = team.getName();
        this.description = team.getDescription();
        this.memberCount = team.getMembers() != null ? team.getMembers().size() : 0;
        this.managerCount = team.getManagers() != null ? team.getManagers().size() : 0;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(int memberCount) {
        this.memberCount = memberCount;
    }

    public int getManagerCount() {
        return managerCount;
    }

    public void setManagerCount(int managerCount) {
        this.managerCount = managerCount;
    }
} 