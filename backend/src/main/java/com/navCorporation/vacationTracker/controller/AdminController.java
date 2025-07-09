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

    @GetMapping("/users")
    public List<UserDto> getAllUsers() {
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

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(new UserDto(updatedUser));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        if (user.getRole() == com.navCorporation.vacationTracker.model.Role.ADMIN) {
             return new ResponseEntity<>("Cannot delete an admin account.", HttpStatus.FORBIDDEN);
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully.");
    }

    // Team Management Endpoints
    @GetMapping("/teams")
    public List<TeamDto> getAllTeams() {
        return teamRepository.findAll().stream()
                .map(TeamDto::new)
                .collect(Collectors.toList());
    }

    @PostMapping("/teams")
    public ResponseEntity<?> createTeam(@Valid @RequestBody TeamDto teamDto) {
        if (teamRepository.existsByName(teamDto.getName())) {
            return new ResponseEntity<>("Team with this name already exists!", HttpStatus.BAD_REQUEST);
        }

        Team team = new Team(teamDto.getName(), teamDto.getDescription());
        Team result = teamRepository.save(team);
        return new ResponseEntity<>(new TeamDto(result), HttpStatus.CREATED);
    }

    @PutMapping("/teams/{id}")
    public ResponseEntity<?> updateTeam(@PathVariable Long id, @Valid @RequestBody TeamDto teamDto) {
        Team team = teamRepository.findById(id).orElse(null);
        if (team == null) {
            return new ResponseEntity<>("Team not found", HttpStatus.NOT_FOUND);
        }

        team.setName(teamDto.getName());
        team.setDescription(teamDto.getDescription());

        Team updatedTeam = teamRepository.save(team);
        return ResponseEntity.ok(new TeamDto(updatedTeam));
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
