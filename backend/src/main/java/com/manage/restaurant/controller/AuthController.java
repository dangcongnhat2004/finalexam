package com.manage.restaurant.controller;


import com.manage.restaurant.entity.User;
import com.manage.restaurant.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class AuthController {

    @Autowired
    private UserService userService;

    @GetMapping("/login")
    public String login() {
        return "auth/login";
    }

    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new User());
        return "auth/register";
    }

    @PostMapping("/register/save")
    public String registration(@ModelAttribute("user") User user, BindingResult result, Model model) {
        User existingUserByUsername = userService.findByUsername(user.getUsername());
        if (existingUserByUsername != null) {
            result.rejectValue("username", null, "Tên đăng nhập đã tồn tại.");
        }
        User existingUserByEmail = userService.findByEmail(user.getEmail());
        if (existingUserByEmail != null) {
            result.rejectValue("email", null, "Email đã được đăng ký.");
        }

        if (result.hasErrors()) {
            model.addAttribute("user", user);
            return "auth/register";
        }

        userService.saveUser(user);
        return "redirect:/register?success";
    }
}