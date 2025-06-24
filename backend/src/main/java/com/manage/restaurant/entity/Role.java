package com.manage.restaurant.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // File: Role.java
    @Column(nullable = false, unique = true)
    private String name;

    public Role(String name) {
        this.name = name;
    }
}