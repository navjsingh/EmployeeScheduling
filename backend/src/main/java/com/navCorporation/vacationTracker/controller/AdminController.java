package com.navCorporation.vacationTracker.controller;

import com.navCorporation.vacationTracker.dto.UserDto;
import com.navCorporation.vacationTracker.dto.AdminUserUpdateRequest;
import com.navCorporation.vacationTracker.dto.TeamDto;
import com.navCorporation.vacationTracker.dto.CsvImportRequest;
import com.navCorporation.vacationTracker.model.User;
import com.navCorporation.vacationTracker.model.Team;
import com.navCorporation.vacationTracker.repository.UserRepository;
import com.navCorporation.vacationTracker.repository.TeamRepository;
import com.navCorporation.vacationTracker.service.CsvImportService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private CsvImportService csvImportService;

    @GetMapping("/test")
    public ResponseEntity<?> testAdminAccess() {
        System.out.println("Admin test endpoint accessed"); // Debug log
        return ResponseEntity.ok(Map.of("message", "Admin access working"));
    }

    @GetMapping("/test-no-auth")
    public ResponseEntity<?> testNoAuth() {
        System.out.println("No auth test endpoint accessed"); // Debug log
        return ResponseEntity.ok(Map.of("message", "No auth endpoint working"));
    }

    @GetMapping("/users")
    public List<UserDto> getAllUsers() {
        System.out.println("Admin endpoint accessed - getting all users"); // Debug log
        return userRepository.findAll().stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@Valid @RequestBody AdminUserUpdateRequest createRequest) {
        if (userRepository.findByEmail(createRequest.getEmail()).isPresent()) {
            return new ResponseEntity<>("Email Address already in use!", HttpStatus.BAD_REQUEST);
        }
        if (createRequest.getPassword() == null || createRequest.getPassword().isEmpty()) {
            return new ResponseEntity<>("Password is required for new users.", HttpStatus.BAD_REQUEST);
        }

        User user = new User(
            createRequest.getName(),
            createRequest.getEmail(),
            passwordEncoder.encode(createRequest.getPassword()),
            createRequest.getRole()
        );
        user.setTotalVacationHours(createRequest.getTotalVacationHours());

        // Set team if provided
        if (createRequest.getTeamId() != null) {
            Team team = teamRepository.findById(createRequest.getTeamId()).orElse(null);
            if (team != null) {
                user.setTeam(team);
            }
        }

        // Set manager if provided
        if (createRequest.getManagerId() != null) {
            User manager = userRepository.findById(createRequest.getManagerId()).orElse(null);
            if (manager != null) {
                user.setManager(manager);
            }
        }

        User result = userRepository.save(user);
        return new ResponseEntity<>(new UserDto(result), HttpStatus.CREATED);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody AdminUserUpdateRequest updateRequest) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        user.setName(updateRequest.getName());
        user.setRole(updateRequest.getRole());
        user.setTotalVacationHours(updateRequest.getTotalVacationHours());

        if (updateRequest.getPassword() != null && !updateRequest.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
        }

        // Update team if provided
        if (updateRequest.getTeamId() != null) {
            Team team = teamRepository.findById(updateRequest.getTeamId()).orElse(null);
            user.setTeam(team);
        } else if (updateRequest.getTeamId() == null) {
            user.setTeam(null); // Clear team if explicitly set to null
        }

        // Update manager if provided
        if (updateRequest.getManagerId() != null) {
            User manager = userRepository.findById(updateRequest.getManagerId()).orElse(null);
            user.setManager(manager);
        } else if (updateRequest.getManagerId() == null) {
            user.setManager(null); // Clear manager if explicitly set to null
        }

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(new UserDto(updatedUser));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return new ResponseEntity<>(Map.of("message", "User not found"), HttpStatus.NOT_FOUND);
        }

        if (user.getRole() == com.navCorporation.vacationTracker.model.Role.ADMIN) {
             return new ResponseEntity<>(Map.of("message", "Cannot delete an admin account."), HttpStatus.FORBIDDEN);
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully."));
    }

    @DeleteMapping("/users/bulk")
    public ResponseEntity<?> bulkDeleteUsers(@RequestBody List<Long> userIds) {
        List<String> errors = new ArrayList<>();
        List<String> successes = new ArrayList<>();
        int deletedCount = 0;
        int skippedCount = 0;

        for (Long userId : userIds) {
            try {
                User user = userRepository.findById(userId).orElse(null);
                if (user == null) {
                    errors.add("User with ID " + userId + " not found");
                    skippedCount++;
                    continue;
                }

                if (user.getRole() == com.navCorporation.vacationTracker.model.Role.ADMIN) {
                    errors.add("Cannot delete admin account: " + user.getName() + " (" + user.getEmail() + ")");
                    skippedCount++;
                    continue;
                }

                userRepository.deleteById(userId);
                successes.add("Deleted: " + user.getName() + " (" + user.getEmail() + ")");
                deletedCount++;
            } catch (Exception e) {
                errors.add("Error deleting user with ID " + userId + ": " + e.getMessage());
                skippedCount++;
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("deletedCount", deletedCount);
        result.put("skippedCount", skippedCount);
        result.put("errors", errors);
        result.put("successes", successes);

        if (deletedCount > 0) {
            return ResponseEntity.ok(result);
        } else {
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
    }

    // Team Management Endpoints
    @GetMapping("/teams")
    public List<TeamDto> getAllTeams() {
        return teamRepository.findAll().stream()
                .map(TeamDto::new)
                .collect(Collectors.toList());
    }

    @PostMapping("/teams")
    public ResponseEntity<?> createTeam(@RequestBody TeamDto teamDto) {
        try {
            System.out.println("Creating team: " + teamDto.getName()); // Debug log
            
            // Validate input
            if (teamDto.getName() == null || teamDto.getName().trim().isEmpty()) {
                return new ResponseEntity<>(Map.of("message", "Team name is required"), HttpStatus.BAD_REQUEST);
            }
            
            String teamName = teamDto.getName().trim();
            if (teamRepository.existsByName(teamName)) {
                return new ResponseEntity<>(Map.of("message", "Team with this name already exists!"), HttpStatus.BAD_REQUEST);
            }

            Team team = new Team(teamName, teamDto.getDescription());
            Team result = teamRepository.save(team);
            System.out.println("Team created successfully: " + result.getId()); // Debug log
            return new ResponseEntity<>(new TeamDto(result), HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error creating team: " + e.getMessage()); // Debug log
            e.printStackTrace();
            return new ResponseEntity<>(Map.of("message", "Error creating team: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/teams/{id}")
    public ResponseEntity<?> updateTeam(@PathVariable Long id, @RequestBody TeamDto teamDto) {
        try {
            System.out.println("Updating team: " + id + " with name: " + teamDto.getName()); // Debug log
            
            // Validate input
            if (teamDto.getName() == null || teamDto.getName().trim().isEmpty()) {
                return new ResponseEntity<>(Map.of("message", "Team name is required"), HttpStatus.BAD_REQUEST);
            }
            
            Team team = teamRepository.findById(id).orElse(null);
            if (team == null) {
                return new ResponseEntity<>(Map.of("message", "Team not found"), HttpStatus.NOT_FOUND);
            }

            String newTeamName = teamDto.getName().trim();
            
            // Check if the new name conflicts with another team (excluding current team)
            if (!newTeamName.equals(team.getName()) && teamRepository.existsByName(newTeamName)) {
                return new ResponseEntity<>(Map.of("message", "Team with this name already exists!"), HttpStatus.BAD_REQUEST);
            }

            team.setName(newTeamName);
            team.setDescription(teamDto.getDescription());

            Team updatedTeam = teamRepository.save(team);
            System.out.println("Team updated successfully: " + updatedTeam.getId()); // Debug log
            return ResponseEntity.ok(new TeamDto(updatedTeam));
        } catch (Exception e) {
            System.err.println("Error updating team: " + e.getMessage()); // Debug log
            e.printStackTrace();
            return new ResponseEntity<>(Map.of("message", "Error updating team: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/teams/{id}")
    public ResponseEntity<?> deleteTeam(@PathVariable Long id) {
        try {
            Team team = teamRepository.findById(id).orElse(null);
            if (team == null) {
                return new ResponseEntity<>(Map.of("message", "Team not found"), HttpStatus.NOT_FOUND);
            }

            // Check if team has members by querying users directly
            long userCount = userRepository.countUsersByTeam(team);
            if (userCount > 0) {
                return new ResponseEntity<>(Map.of("message", "Cannot delete team with " + userCount + " members. Please reassign members first."), HttpStatus.FORBIDDEN);
            }

            teamRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Team deleted successfully."));
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("message", "Error deleting team: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // CSV Import Endpoint
    @PostMapping("/import-csv")
    public ResponseEntity<?> importUsersFromCsv(@Valid @RequestBody CsvImportRequest request) {
        try {
            Map<String, Object> result = csvImportService.importUsersFromCsv(request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return new ResponseEntity<>("Error importing users: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
