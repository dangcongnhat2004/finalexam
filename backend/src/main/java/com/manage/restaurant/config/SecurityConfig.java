package com.manage.restaurant.config;



import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests((authorize) ->
                        authorize
                                // ----- DÒNG QUAN TRỌNG NHẤT LÀ ĐÂY -----
                                // Cho phép tất cả mọi người truy cập vào các tài nguyên tĩnh
                                .requestMatchers("/css/**", "/js/**", "/uploads/**", "/images/**").permitAll()
                                // Cho phép truy cập trang chủ, đăng ký, chi tiết nhà hàng
                                .requestMatchers("/", "/home", "/register/**", "/restaurant/**").permitAll()
                                // Yêu cầu quyền ADMIN cho trang /admin/**
                                .requestMatchers("/admin/**").hasRole("ADMIN")
                                // Tất cả các yêu cầu còn lại đều cần xác thực (đăng nhập)
                                .anyRequest().authenticated()
                ).formLogin(
                        form -> form
                                .loginPage("/login")
                                .loginProcessingUrl("/login")
                                .defaultSuccessUrl("/home", true)
                                .permitAll()
                ).logout(
                        logout -> logout
                                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                                .permitAll()
                );
        return http.build();
    }
}