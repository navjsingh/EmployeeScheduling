package com.navCorporation.vacationTracker.model;


import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private int totalVacationHours;
    private int usedVacationHours;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "manager_employees",
        joinColumns = @JoinColumn(name = "manager_id"),
        inverseJoinColumns = @JoinColumn(name = "employee_id")
    )
    private Set<User> assignedEmployees = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_manager_id")
    private Team teamManager;

    // Constructors
    public User() {
    }

    public User(String name, String email, String password, Role role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public int getTotalVacationHours() {
        return totalVacationHours;
    }

    public void setTotalVacationHours(int totalVacationHours) {
        this.totalVacationHours = totalVacationHours;
    }

    public int getUsedVacationHours() {
        return usedVacationHours;
    }

    public void setUsedVacationHours(int usedVacationHours) {
        this.usedVacationHours = usedVacationHours;
    }

    public Set<User> getAssignedEmployees() {
        return assignedEmployees;
    }

    public void setAssignedEmployees(Set<User> assignedEmployees) {
        this.assignedEmployees = assignedEmployees;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public Team getTeamManager() {
        return teamManager;
    }

    public void setTeamManager(Team teamManager) {
        this.teamManager = teamManager;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id) && Objects.equals(email, user.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, email);
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", role=" + role +
                '}';
    }
}
