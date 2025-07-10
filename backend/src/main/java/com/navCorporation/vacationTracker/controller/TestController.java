package com.navCorporation.vacationTracker.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/public")
    public ResponseEntity<?> testPublic() {
        System.out.println("Public test endpoint accessed"); // Debug log
        return ResponseEntity.ok(Map.of("message", "Public endpoint working"));
    }

    @PostMapping("/public")
    public ResponseEntity<?> testPublicPost(@RequestBody Map<String, Object> data) {
        System.out.println("Public POST test endpoint accessed with data: " + data); // Debug log
        return ResponseEntity.ok(Map.of("message", "Public POST endpoint working", "receivedData", data));
    }
} 