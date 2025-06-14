package com.navCorporation.vacationTracker.dto;

import java.time.LocalDate;

public class AvailabilityDto {
    private LocalDate date;
    private int availableHours;

    public AvailabilityDto() {}

    // Getters and Setters
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public int getAvailableHours() { return availableHours; }
    public void setAvailableHours(int availableHours) { this.availableHours = availableHours; }
}
