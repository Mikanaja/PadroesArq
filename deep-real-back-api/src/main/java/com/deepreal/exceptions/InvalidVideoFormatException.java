package com.deepreal.exceptions;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class InvalidVideoFormatException extends RuntimeException {
    public InvalidVideoFormatException(String message) {
        super(message);
    }
    
}
