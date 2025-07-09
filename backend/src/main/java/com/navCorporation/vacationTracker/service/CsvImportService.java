package com.navCorporation.vacationTracker.service;

import com.navCorporation.vacationTracker.dto.CsvImportRequest;
import com.navCorporation.vacationTracker.model.Role;
import com.navCorporation.vacationTracker.model.Team;
import com.navCorporation.vacationTracker.model.User;
import com.navCorporation.vacationTracker.repository.TeamRepository;
import com.navCorporation.vacationTracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CsvImportService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Map<String, Object> importUsersFromCsv(CsvImportRequest request) {
        Map<String, Object> result = new HashMap<>();
        List<String> errors = new ArrayList<>();
        List<String> successes = new ArrayList<>();
        int createdUsers = 0;
        int updatedUsers = 0;
        int createdTeams = 0;
        boolean isUpdateMode = "update".equals(request.getMode());

        // First pass: Create teams and collect manager emails
        Map<String, Team> teamsByName = new HashMap<>();
        Map<String, User> managersByEmail = new HashMap<>();

        for (CsvImportRequest.CsvUserData userData : request.getUsers()) {
            // Create team if it doesn't exist
            if (userData.getTeam() != null && !userData.getTeam().trim().isEmpty()) {
                String teamName = userData.getTeam().trim();
                if (!teamsByName.containsKey(teamName)) {
                    Team team = teamRepository.findByName(teamName).orElse(null);
                    if (team == null) {
                        team = new Team(teamName);
                        team = teamRepository.save(team);
                        createdTeams++;
                    }
                    teamsByName.put(teamName, team);
                }
            }

            // Collect manager emails for later processing
            if (userData.getManagerEmail() != null && !userData.getManagerEmail().trim().isEmpty()) {
                String managerEmail = userData.getManagerEmail().trim();
                if (!managersByEmail.containsKey(managerEmail)) {
                    User manager = userRepository.findByEmail(managerEmail).orElse(null);
                    if (manager != null) {
                        managersByEmail.put(managerEmail, manager);
                    }
                }
            }
        }

        // Second pass: Create or update users
        for (CsvImportRequest.CsvUserData userData : request.getUsers()) {
            try {
                // Validate required fields
                if (userData.getName() == null || userData.getName().trim().isEmpty()) {
                    errors.add("User with email " + userData.getEmail() + " has no name");
                    continue;
                }
                if (userData.getEmail() == null || userData.getEmail().trim().isEmpty()) {
                    errors.add("User " + userData.getName() + " has no email");
                    continue;
                }

                String email = userData.getEmail().trim();
                Optional<User> existingUser = userRepository.findByEmail(email);
                
                User user;
                boolean isNewUser = false;

                if (existingUser.isPresent()) {
                    if (isUpdateMode) {
                        // Update existing user
                        user = existingUser.get();
                        user.setName(userData.getName().trim());
                        user.setTotalVacationHours(userData.getTotalVacationHours());
                        
                        // Update role if provided
                        Role role = parseRole(userData.getRole());
                        if (role != null) {
                            user.setRole(role);
                        }
                        
                        updatedUsers++;
                        successes.add("Updated user: " + user.getName() + " (" + email + ")");
                    } else {
                        // Skip existing user in create mode
                        errors.add("User with email " + email + " already exists (skipped in create mode)");
                        continue;
                    }
                } else {
                    if (isUpdateMode) {
                        // Skip non-existent user in update mode
                        errors.add("User with email " + email + " not found (skipped in update mode)");
                        continue;
                    } else {
                        // Create new user
                        user = new User();
                        user.setName(userData.getName().trim());
                        user.setEmail(email);
                        user.setPassword(passwordEncoder.encode("changeme123")); // Default password
                        user.setTotalVacationHours(userData.getTotalVacationHours());
                        user.setUsedVacationHours(0);
                        isNewUser = true;
                        
                        // Set role
                        Role role = parseRole(userData.getRole());
                        if (role == null) {
                            errors.add("Invalid role '" + userData.getRole() + "' for user " + email);
                            continue;
                        }
                        user.setRole(role);
                        
                        createdUsers++;
                        successes.add("Created user: " + user.getName() + " (" + email + ")");
                    }
                }

                // Set team
                if (userData.getTeam() != null && !userData.getTeam().trim().isEmpty()) {
                    String teamName = userData.getTeam().trim();
                    Team team = teamsByName.get(teamName);
                    if (team != null) {
                        user.setTeam(team);
                    }
                }

                // Set team manager (fix the manager assignment)
                if (userData.getManagerEmail() != null && !userData.getManagerEmail().trim().isEmpty()) {
                    String managerEmail = userData.getManagerEmail().trim();
                    User manager = managersByEmail.get(managerEmail);
                    if (manager != null && manager.getTeam() != null) {
                        user.setTeamManager(manager.getTeam());
                    } else {
                        // Try to find manager in existing users
                        Optional<User> managerUser = userRepository.findByEmail(managerEmail);
                        if (managerUser.isPresent() && managerUser.get().getTeam() != null) {
                            user.setTeamManager(managerUser.get().getTeam());
                        } else {
                            errors.add("Manager with email " + managerEmail + " not found or has no team for user " + email);
                        }
                    }
                }

                user = userRepository.save(user);

            } catch (Exception e) {
                errors.add("Error processing user " + userData.getName() + ": " + e.getMessage());
            }
        }

        result.put("createdUsers", createdUsers);
        result.put("updatedUsers", updatedUsers);
        result.put("createdTeams", createdTeams);
        result.put("errors", errors);
        result.put("successes", successes);
        result.put("totalProcessed", request.getUsers().size());

        return result;
    }

    private Role parseRole(String roleString) {
        if (roleString == null) {
            return Role.EMPLOYEE; // Default role
        }
        
        String role = roleString.trim().toUpperCase();
        try {
            return Role.valueOf(role);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
} 