package com.manage.restaurant.controller;

import com.manage.restaurant.entity.Booking;
import com.manage.restaurant.entity.Restaurant;
import com.manage.restaurant.repository.BookingRepository;
import com.manage.restaurant.repository.RestaurantRepository;
import com.manage.restaurant.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        List<Booking> bookings = bookingRepository.findAll();
        List<Restaurant> restaurants = restaurantRepository.findAll();
        model.addAttribute("bookings", bookings);
        model.addAttribute("restaurants", restaurants);
        model.addAttribute("newRestaurant", new Restaurant());
        return "admin/dashboard";
    }

    @PostMapping("/restaurant/add")
    public String addRestaurant(@ModelAttribute("newRestaurant") Restaurant restaurant,
                                @RequestParam("imageFile") MultipartFile imageFile) {
        if (!imageFile.isEmpty()) {
            String fileName = fileStorageService.storeFile(imageFile);
            String fileUrl = MvcUriComponentsBuilder.fromMethodName(AdminController.class, "serveFile", fileName).build().toString();
            restaurant.setImageUrl("/uploads/" + fileName);
        }
        restaurantRepository.save(restaurant);
        return "redirect:/admin/dashboard";
    }

    // Phương thức này không thực sự cần thiết nếu bạn cấu hình resource handler,
    // nhưng để rõ ràng hơn trong logic của MvcUriComponentsBuilder
    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public void serveFile(@PathVariable String filename) {
        // Handled by resource handler
    }
}
