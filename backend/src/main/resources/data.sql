-- Create teams
INSERT INTO teams (id, name, description) VALUES
(1, 'Red', 'Red Team - Development'),
(2, 'Blue', 'Blue Team - Design'),
(3, 'Green', 'Green Team - Marketing'),
(4, 'Yellow', 'Yellow Team - Sales');

-- Create users
INSERT INTO users (id, name, email, password, role, total_vacation_hours, used_vacation_hours, team_id, team_manager_id) VALUES
(0, 'App Admin', 'admin@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'ADMIN', 0, 0, NULL, NULL),
(2, 'Jane Smith', 'manager@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'MANAGER', 200, 0, 1, NULL),
(3, 'Mike Davis', 'mike.davis@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'MANAGER', 200, 0, 2, NULL),
(4, 'Sarah Jones', 'sarah.jones@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'MANAGER', 200, 0, 3, NULL),
(5, 'Tom Wilson', 'tom.wilson@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'MANAGER', 200, 0, 4, NULL),
(1, 'John Doe', 'john.doe@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 16, 1, 1),
(6, 'Alice Johnson', 'alice.johnson@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 8, 1, 1),
(7, 'Bob Wilson', 'bob.wilson@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 12, 1, 1),
(8, 'Carol Brown', 'carol.brown@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 0, 1, 1),
(9, 'David Lee', 'david.lee@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 24, 1, 1),
(10, 'Emma Wilson', 'emma.wilson@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 16, 1, 1),
(11, 'Frank Miller', 'frank.miller@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 8, 1, 1),
(12, 'Grace Taylor', 'grace.taylor@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 0, 1, 1),
(13, 'Henry Anderson', 'henry.anderson@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 32, 1, 1),
(14, 'Ivy Chen', 'ivy.chen@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 16, 1, 1),
(15, 'Jack Davis', 'jack.davis@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 8, 1, 1),
(16, 'Kate Evans', 'kate.evans@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 0, 2, 2),
(17, 'Liam Foster', 'liam.foster@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 16, 2, 2),
(18, 'Mia Garcia', 'mia.garcia@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 24, 2, 2),
(19, 'Noah Harris', 'noah.harris@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 8, 2, 2),
(20, 'Olivia Jackson', 'olivia.jackson@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 0, 2, 2),
(21, 'Paul King', 'paul.king@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 16, 2, 2),
(22, 'Quinn Lopez', 'quinn.lopez@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 8, 2, 2),
(23, 'Ruby Martinez', 'ruby.martinez@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 32, 2, 2),
(24, 'Sam Nelson', 'sam.nelson@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 0, 2, 2),
(25, 'Tina Ortiz', 'tina.ortiz@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 16, 2, 2),
(26, 'Uma Patel', 'uma.patel@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 8, 2, 2),
(27, 'Victor Quinn', 'victor.quinn@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 0, 3, 3),
(28, 'Wendy Rivera', 'wendy.rivera@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 16, 3, 3),
(29, 'Xavier Smith', 'xavier.smith@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 24, 3, 3),
(30, 'Yara Torres', 'yara.torres@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 8, 3, 3),
(31, 'Zoe Underwood', 'zoe.underwood@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 0, 3, 3),
(32, 'Adam Vega', 'adam.vega@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 16, 3, 3),
(33, 'Bella Walsh', 'bella.walsh@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 8, 3, 3),
(34, 'Carlos Young', 'carlos.young@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 32, 3, 3),
(35, 'Diana Zimmerman', 'diana.zimmerman@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 0, 3, 3),
(36, 'Ethan Adams', 'ethan.adams@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 16, 3, 3),
(37, 'Fiona Baker', 'fiona.baker@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 8, 3, 3),
(38, 'George Cooper', 'george.cooper@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 0, 4, 4),
(39, 'Hannah Dixon', 'hannah.dixon@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 16, 4, 4),
(40, 'Ian Edwards', 'ian.edwards@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 24, 4, 4),
(41, 'Julia Fisher', 'julia.fisher@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 8, 4, 4),
(42, 'Kevin Green', 'kevin.green@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 0, 4, 4),
(43, 'Lisa Hall', 'lisa.hall@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 16, 4, 4),
(44, 'Mark Irwin', 'mark.irwin@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 8, 4, 4),
(45, 'Nina Johnson', 'nina.johnson@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 32, 4, 4),
(46, 'Oscar Kelly', 'oscar.kelly@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 0, 4, 4),
(47, 'Penny Lewis', 'penny.lewis@company.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfesgDRadJYkf/stTWFnZvEeXYidCVmxGy', 'EMPLOYEE', 160, 16, 4, 4);

-- Assign employees to manager (legacy table - keeping for compatibility)
INSERT INTO manager_employees (manager_id, employee_id) VALUES
(2, 1), (2, 6), (2, 7), (2, 8), (2, 9), (2, 10), (2, 11), (2, 12), (2, 13), (2, 14), (2, 15),
(3, 16), (3, 17), (3, 18), (3, 19), (3, 20), (3, 21), (3, 22), (3, 23), (3, 24), (3, 25), (3, 26),
(4, 27), (4, 28), (4, 29), (4, 30), (4, 31), (4, 32), (4, 33), (4, 34), (4, 35), (4, 36), (4, 37),
(5, 38), (5, 39), (5, 40), (5, 41), (5, 42), (5, 43), (5, 44), (5, 45), (5, 46), (5, 47);

-- Vacation Requests
INSERT INTO vacation_requests (id, start_date, end_date, status, requested_hours, note, employee_id, denial_reason) VALUES
(1, '2025-07-10', '2025-07-11', 'APPROVED', 16, 'Family Trip', 1, NULL),
(2, '2025-07-21', '2025-07-21', 'PENDING', 8, 'Family event.', 1, NULL),
(3, '2025-07-15', '2025-07-16', 'DENIED', 16, '', 4, 'Coverage needed');