package com.navCorporation.vacationTracker.repository;

import com.navCorporation.vacationTracker.model.Availability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    
    List<Availability> findByManagerIdAndDateBetween(Long managerId, LocalDate startDate, LocalDate endDate);
    Optional<Availability> findByManagerIdAndDate(Long managerId, LocalDate date);
}
