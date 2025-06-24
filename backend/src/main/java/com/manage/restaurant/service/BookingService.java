package com.manage.restaurant.service;



import com.manage.restaurant.entity.Booking;
import com.manage.restaurant.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    // Đã xóa EmailService

    public Booking createBooking(Booking booking) {
        booking.setStatus("PENDING");
        Booking savedBooking = bookingRepository.save(booking);

        // Đã xóa lệnh gọi gửi email

        return savedBooking;
    }
}