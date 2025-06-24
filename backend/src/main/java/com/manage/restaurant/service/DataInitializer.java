package com.manage.restaurant.service;


import com.manage.restaurant.entity.Restaurant;
import com.manage.restaurant.entity.Role;
import com.manage.restaurant.entity.User;
import com.manage.restaurant.repository.RestaurantRepository;
import com.manage.restaurant.repository.RoleRepository;
import com.manage.restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. Tạo Roles
        Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseGet(() -> roleRepository.save(new Role("ROLE_ADMIN")));
        Role userRole = roleRepository.findByName("ROLE_USER").orElseGet(() -> roleRepository.save(new Role("ROLE_USER")));

        // 2. Tạo User Admin
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setFullName("Quản Trị Viên");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRoles(Set.of(adminRole));
            userRepository.save(admin);
        }

        // 3. Tạo Restaurants
        if (restaurantRepository.count() == 0) {
            Restaurant r1 = new Restaurant();
            r1.setName("Nhà Hàng Phố Cổ"); // Đảm bảo đã set name
            r1.setAddress("123 Hàng Bông, Hoàn Kiếm, Hà Nội");
            r1.setDescription("Thưởng thức ẩm thực truyền thống Việt Nam trong không gian hoài cổ. Thực đơn đa dạng với các món ăn đặc sắc ba miền.");
            r1.setImageUrl("/uploads/default.jpg");
            restaurantRepository.save(r1);

            Restaurant r2 = new Restaurant();
            r2.setName("The Gourmet Corner"); // Đảm bảo đã set name
            r2.setAddress("Tầng 12, 32 Lò Sũ, Hoàn Kiếm, Hà Nội");
            r2.setDescription("Nhà hàng sang trọng với tầm nhìn toàn cảnh ra Hồ Gươm. Phục vụ các món ăn Âu - Á tinh tế và sáng tạo.");
            r2.setImageUrl("/uploads/default.jpg");
            restaurantRepository.save(r2);
        }
    }
}