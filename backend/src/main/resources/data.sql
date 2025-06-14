INSERT INTO users (id, name, email, password, role, total_vacation_hours, used_vacation_hours) VALUES
(0, 'App Admin', 'admin@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'ADMIN', 0, 0),
(2, 'Jane Smith', 'manager@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'MANAGER', 200, 0),
(1, 'John Doe', 'employee@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 16),
(4, 'Peter Jones', 'employee2@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 120, 0);

-- Assign employees to manager
INSERT INTO manager_employees (manager_id, employee_id) VALUES
(2, 1),
(2, 4);

-- Vacation Requests
INSERT INTO vacation_requests (id, start_date, end_date, status, requested_hours, note, employee_id, denial_reason) VALUES
(1, '2025-07-10', '2025-07-11', 'APPROVED', 16, 'Family Trip', 1, NULL),
(2, '2025-07-21', '2025-07-21', 'PENDING', 8, 'Family event.', 1, NULL),
(3, '2025-07-15', '2025-07-16', 'DENIED', 16, '', 4, 'Coverage needed');