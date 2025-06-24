package com.manage.restaurant.controller;

import com.manage.restaurant.entity.Booking;
import com.manage.restaurant.entity.Restaurant;
import com.manage.restaurant.repository.RestaurantRepository;
import com.manage.restaurant.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class BookingController {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private BookingService bookingService;

    @GetMapping({"/", "/home"})
    public String home(Model model) {
        List<Restaurant> restaurants = restaurantRepository.findAll();
        model.addAttribute("restaurants", restaurants);
        return "home";
    }

    @GetMapping("/restaurant/{id}")
    public String restaurantDetails(@PathVariable Long id, Model model) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid restaurant Id:" + id));
        Booking booking = new Booking();
        booking.setRestaurant(restaurant);
        model.addAttribute("restaurant", restaurant);
        model.addAttribute("booking", booking);
        return "restaurant-details";
    }

    @PostMapping("/booking/create")
    public String createBooking(@ModelAttribute("booking") Booking booking, Model model) {
        Booking createdBooking = bookingService.createBooking(booking);
        model.addAttribute("booking", createdBooking);
        return "booking-confirmation";
    }
}