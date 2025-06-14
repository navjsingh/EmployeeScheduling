package com.navCorporation.vacationTracker.repository;

import com.navCorporation.vacationTracker.model.VacationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VacationRequestRepository extends JpaRepository<VacationRequest, Long> {
    List<VacationRequest> findByEmployeeId(Long employeeId);
}
