import React from "react";

export let MOCK_USERS = {
  'admin@company.com': { password: 'password', role: 'ADMIN', name: 'App Admin', id: 0 },
  'manager@company.com': {
    password: 'password',
    role: 'MANAGER',
    name: 'Jane Smith',
    id: 2,
    assignedEmployees: [1, 4],
  },
  'employee@company.com': {
    password: 'password',
    role: 'EMPLOYEE',
    name: 'John Doe',
    id: 1,
    totalVacationHours: 160,
    usedVacationHours: 16,
  },
  'employee2@company.com': {
    password: 'password',
    role: 'EMPLOYEE',
    name: 'Peter Jones',
    id: 4,
    totalVacationHours: 120,
    usedVacationHours: 0,
  },
};

export let MOCK_VACATION_REQUESTS = [
  {
    id: 1,
    employeeId: 1,
    startDate: new Date(2025, 6, 10),
    endDate: new Date(2025, 6, 11),
    status: 'APPROVED',
    requestedHours: 16,
    note: 'Family Trip',
  },
  {
    id: 2,
    employeeId: 1,
    startDate: new Date(2025, 6, 21),
    endDate: new Date(2025, 6, 21),
    status: 'PENDING',
    requestedHours: 8,
    note: 'Family event.',
  },
  {
    id: 3,
    employeeId: 4,
    startDate: new Date(2025, 6, 15),
    endDate: new Date(2025, 6, 16),
    status: 'DENIED',
    requestedHours: 16,
    note: '',
    denial_reason: 'Coverage needed',
  },
  {
    id: 4,
    employeeId: 1,
    startDate: new Date(2025, 5, 2),
    endDate: new Date(2025, 5, 3),
    status: 'APPROVED',
    requestedHours: 16,
    note: 'Past Request',
  },
];

export let MOCK_AVAILABILITY = {
  '2025-07-15': { hours: 16 }, '2025-07-16': { hours: 8 }, '2025-07-17': { hours: 24 },
};