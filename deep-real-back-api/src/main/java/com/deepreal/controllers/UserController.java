package com.deepreal.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.deepreal.models.User;
import com.deepreal.services.UserService;
import com.deepreal.models.Video;

import java.net.URI;
import java.util.UUID;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<User> create(@RequestBody String email) {
        User user = userService.create(email);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(user.getId()).toUri();

        return ResponseEntity.created(uri).body(user);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> findUser(@PathVariable String email) {
        User user = userService.findUser(email);
        return ResponseEntity.ok().body(user);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<User> findUser(@PathVariable UUID id) {
        User user = userService.findUser(id);
        return ResponseEntity.ok().body(user);
    }

    @GetMapping("/videos/{userId}")
    public ResponseEntity<List<Video>> findUserVideos(@PathVariable UUID userId) {
        List<Video> videos = userService.findUserVideos(userId);
        return ResponseEntity.ok().body(videos);
    }
    
}
