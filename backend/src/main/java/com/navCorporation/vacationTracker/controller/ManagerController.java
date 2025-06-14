package com.navCorporation.vacationTracker.controller;

import com.navCorporation.vacationTracker.dto.UserDto;
import com.navCorporation.vacationTracker.dto.AvailabilityDto;
import com.navCorporation.vacationTracker.model.User;
import com.navCorporation.vacationTracker.model.Availability;
import com.navCorporation.vacationTracker.repository.UserRepository;
import com.navCorporation.vacationTracker.repository.AvailabilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/manager")
@PreAuthorize("hasRole('MANAGER')")
public class ManagerController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AvailabilityRepository availabilityRepository;

    @GetMapping("/team")
    public ResponseEntity<List<UserDto>> getTeam(Authentication authentication) {
        
        User manager = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        List<UserDto> team = manager.getAssignedEmployees().stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(team);
    }

    @PutMapping("/employees/{id}/hours")
    public ResponseEntity<?> setEmployeeHours(@PathVariable Long id, @RequestBody Map<String, Integer> payload, Authentication authentication) {
        User manager = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Manager not found"));
        User employee = userRepository.findById(id).orElse(null);

        if (employee == null) {
            return ResponseEntity.notFound().build();
        }

        boolean isAuthorized = manager.getAssignedEmployees().stream().anyMatch(e -> e.getId().equals(id));
        if (!isAuthorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("This employee is not on your team.");
        }

        Integer hours = payload.get("totalVacationHours");
        if (hours == null || hours < 0) {
            return ResponseEntity.badRequest().body("Invalid hours value provided.");
        }

        employee.setTotalVacationHours(hours);
        userRepository.save(employee);
        return ResponseEntity.ok(new UserDto(employee));
    }

    @GetMapping("/availability")
    public ResponseEntity<List<AvailabilityDto>> getAvailability(
            @RequestParam int year,
            @RequestParam int month,
            Authentication authentication) {
        User manager = userRepository.findByEmail(authentication.getName()).get();
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<Availability> availabilities = availabilityRepository.findByManagerIdAndDateBetween(manager.getId(), startDate, endDate);
        List<AvailabilityDto> dtos = availabilities.stream().map(a -> {
            AvailabilityDto dto = new AvailabilityDto();
            dto.setDate(a.getDate());
dto.setAvailableHours(a.getAvailableHours());
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/availability")
    public ResponseEntity<?> setAvailability(@RequestBody List<AvailabilityDto> availabilityList, Authentication authentication) {
        User manager = userRepository.findByEmail(authentication.getName()).get();

        for (AvailabilityDto dto : availabilityList) {
            
            Availability availability = availabilityRepository
                    .findByManagerIdAndDate(manager.getId(), dto.getDate())
                    .orElse(new Availability());

            availability.setManager(manager);
            availability.setDate(dto.getDate());
            availability.setAvailableHours(dto.getAvailableHours());
            availabilityRepository.save(availability);
        }

        return ResponseEntity.ok("Availability updated successfully.");
    }
}

