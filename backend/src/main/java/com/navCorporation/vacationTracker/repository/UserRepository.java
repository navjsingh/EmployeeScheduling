package com.navCorporation.vacationTracker.repository;

import com.navCorporation.vacationTracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    long countByTeam(com.navCorporation.vacationTracker.model.Team team);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.team = :team")
    long countUsersByTeam(@Param("team") com.navCorporation.vacationTracker.model.Team team);
}
