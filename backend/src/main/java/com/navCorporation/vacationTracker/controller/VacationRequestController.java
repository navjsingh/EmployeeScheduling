package com.navCorporation.vacationTracker.controller;

import com.navCorporation.vacationTracker.dto.VacationRequestDto;
import com.navCorporation.vacationTracker.model.User;
import com.navCorporation.vacationTracker.model.VacationRequest;
import com.navCorporation.vacationTracker.repository.UserRepository;
import com.navCorporation.vacationTracker.repository.VacationRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/requests")
public class VacationRequestController {

    @Autowired
    private VacationRequestRepository vacationRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<VacationRequestDto>> getRequests(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).get();
        List<VacationRequest> requests = new ArrayList<>();

        if (user.getRole() == com.navCorporation.vacationTracker.model.Role.MANAGER) {
            for (User employee : user.getAssignedEmployees()) {
                requests.addAll(vacationRequestRepository.findByEmployeeId(employee.getId()));
            }
        } else {
            requests.addAll(vacationRequestRepository.findByEmployeeId(user.getId()));
        }

        List<VacationRequestDto> dtos = requests.stream()
                .map(VacationRequestDto::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER')")
    public ResponseEntity<VacationRequestDto> createRequest(@RequestBody VacationRequestDto requestDto, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).get();
        
        VacationRequest newRequest = new VacationRequest();
        newRequest.setEmployee(user);
        newRequest.setStartDate(requestDto.getStartDate());
        newRequest.setEndDate(requestDto.getEndDate());
        newRequest.setNote(requestDto.getNote());
        newRequest.setStatus(VacationRequest.Status.PENDING);
        newRequest.setRequestedHours(requestDto.getRequestedHours()); 
        
        VacationRequest savedRequest = vacationRequestRepository.save(newRequest);
        return new ResponseEntity<>(new VacationRequestDto(savedRequest), HttpStatus.CREATED);
    }
    
    // Manager approves or denies a request
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> updateRequestStatus(@PathVariable Long id, @RequestBody VacationRequestDto updateDto, Authentication authentication) {
         User manager = userRepository.findByEmail(authentication.getName()).get();
         VacationRequest request = vacationRequestRepository.findById(id).orElse(null);

         if (request == null) return ResponseEntity.notFound().build();
         
         boolean isAuthorized = manager.getAssignedEmployees().stream()
                                     .anyMatch(emp -> emp.getId().equals(request.getEmployee().getId()));

         if (!isAuthorized) {
             return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to update this request.");
         }
         
         request.setStatus(updateDto.getStatus());
         if (updateDto.getStatus() == VacationRequest.Status.DENIED) {
             request.setDenialReason(updateDto.getDenialReason());
         }
         
         vacationRequestRepository.save(request);
         return ResponseEntity.ok(new VacationRequestDto(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable Long id, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).get();
        VacationRequest request = vacationRequestRepository.findById(id).orElse(null);

        if (request == null) {
            return ResponseEntity.notFound().build();
        }

        if (!request.getEmployee().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to delete this request.");
        }
        
        if(request.getStatus() == VacationRequest.Status.APPROVED){
            User employee = request.getEmployee();
            employee.setUsedVacationHours(employee.getUsedVacationHours() - request.getRequestedHours());
            userRepository.save(employee);
        }

        vacationRequestRepository.deleteById(id);
        return ResponseEntity.ok("Request deleted successfully.");
    }
}
