package com.smartcampus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartCampusApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartCampusApplication.class, args);
        System.out.println("===============================================================");
        System.out.println(" Smart Campus Service & Operations Platform is UP & RUNNING!  ");
        System.out.println(" Access Web Application: http://localhost:8080                ");
        System.out.println(" Access H2 Database:     http://localhost:8080/h2-console     ");
        System.out.println("===============================================================");
    }
}
