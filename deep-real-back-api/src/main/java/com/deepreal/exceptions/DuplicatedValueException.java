package com.deepreal.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicatedValueException extends RuntimeException {
    public DuplicatedValueException(String message) {
        super(message);
    }
    
}
