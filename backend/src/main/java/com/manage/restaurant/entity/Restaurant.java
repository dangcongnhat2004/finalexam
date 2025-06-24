package com.manage.restaurant.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "restaurants")
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Cột này có thể là nguyên nhân nếu bạn không cung cấp giá trị
    @Column(nullable = false)
    private String name;

    private String address;

    @Lob
    private String description;

    private String imageUrl;

    @OneToMany(mappedBy = "restaurant")
    private List<Booking> bookings;
}