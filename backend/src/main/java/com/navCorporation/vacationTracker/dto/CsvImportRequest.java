package com.navCorporation.vacationTracker.dto;

import java.util.List;

public class CsvImportRequest {
    private List<CsvUserData> users;
    private String mode; // "create" or "update"

    public CsvImportRequest() {
    }

    public CsvImportRequest(List<CsvUserData> users) {
        this.users = users;
    }

    public List<CsvUserData> getUsers() {
        return users;
    }

    public void setUsers(List<CsvUserData> users) {
        this.users = users;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public static class CsvUserData {
        private String name;
        private String email;
        private String team;
        private String managerEmail;
        private String role;
        private int totalVacationHours;

        public CsvUserData() {
        }

        public CsvUserData(String name, String email, String team, String managerEmail, String role, int totalVacationHours) {
            this.name = name;
            this.email = email;
            this.team = team;
            this.managerEmail = managerEmail;
            this.role = role;
            this.totalVacationHours = totalVacationHours;
        }

        // Getters and Setters
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

        public String getTeam() {
            return team;
        }

        public void setTeam(String team) {
            this.team = team;
        }

        public String getManagerEmail() {
            return managerEmail;
        }

        public void setManagerEmail(String managerEmail) {
            this.managerEmail = managerEmail;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public int getTotalVacationHours() {
            return totalVacationHours;
        }

        public void setTotalVacationHours(int totalVacationHours) {
            this.totalVacationHours = totalVacationHours;
        }
    }
} 