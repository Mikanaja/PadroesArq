package com.deepreal.util;

import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

import com.deepreal.exceptions.InvalidEmailException;

@Component
public class EmailValidator {
    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);

    public static void validarEmail(String email) {
        if (email == null || !EMAIL_PATTERN.matcher(email).matches()) {
            throw new InvalidEmailException("Email inválido");
        }
    }
}
