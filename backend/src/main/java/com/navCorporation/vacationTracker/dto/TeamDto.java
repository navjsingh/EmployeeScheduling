package com.navCorporation.vacationTracker.dto;

import com.navCorporation.vacationTracker.model.Team;

public class TeamDto {
    private Long id;
    private String name;
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