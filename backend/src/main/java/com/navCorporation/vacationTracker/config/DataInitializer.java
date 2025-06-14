package com.navCorporation.vacationTracker.config;

import com.navCorporation.vacationTracker.model.Role;
import com.navCorporation.vacationTracker.model.User;
import com.navCorporation.vacationTracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Only run if the database is empty
        if (userRepository.count() == 0) {
            // Create Admin
            User admin = new User("App Admin", "admin@company.com", passwordEncoder.encode("password"), Role.ADMIN);
            userRepository.save(admin);

            // Create Employees
            User employee1 = new User("John Doe", "employee@company.com", passwordEncoder.encode("password"), Role.EMPLOYEE);
            employee1.setTotalVacationHours(160);
            employee1.setUsedVacationHours(16);
            
            User employee2 = new User("Peter Jones", "employee2@company.com", passwordEncoder.encode("password"), Role.EMPLOYEE);
            employee2.setTotalVacationHours(120);

            userRepository.save(employee1);
            userRepository.save(employee2);
            
            // Create Manager and assign employees
            User manager = new User("Jane Smith", "manager@company.com", passwordEncoder.encode("password"), Role.MANAGER);
            manager.setAssignedEmployees(Set.of(employee1, employee2));
            userRepository.save(manager);
            
            System.out.println("Database initialized with sample data.");
        }
    }
}
