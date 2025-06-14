package com.navCorporation.vacationTracker.controller;

import com.navCorporation.vacationTracker.dto.UserDto;
import com.navCorporation.vacationTracker.dto.AdminUserUpdateRequest;
import com.navCorporation.vacationTracker.model.User;
import com.navCorporation.vacationTracker.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
}
