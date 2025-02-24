package com.deepreal.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.deepreal.exceptions.DuplicatedValueException;
import com.deepreal.exceptions.ObjectNotFoundException;
import com.deepreal.models.User;
import com.deepreal.models.Video;
import com.deepreal.repositories.UserRepository;
import com.deepreal.util.EmailValidator;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User create(String email) {
        // Validações
        EmailValidator.validarEmail(email);
        this.checkDuplicatedEmail(email);
        
        User user = new User();
        user.setEmail(email);
        return userRepository.save(user);
    } 

    public User findUser(UUID userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return user.get();
        } else {
            throw new ObjectNotFoundException("Usuário não encontrado");	
        }
    }

    public User findUser(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            return user.get();
        } else {
            throw new ObjectNotFoundException("Usuário não encontrado");	
        }
    }

    public List<Video> findUserVideos(UUID userId) {
        User user = this.findUser(userId);
        return user.getVideos();
    }

    public void checkDuplicatedEmail(String email) throws DuplicatedValueException {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new DuplicatedValueException("Usuário já existe");
        }
    }
}
