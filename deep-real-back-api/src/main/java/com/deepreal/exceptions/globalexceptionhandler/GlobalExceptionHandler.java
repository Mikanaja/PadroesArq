package com.deepreal.exceptions.globalexceptionhandler;

import java.io.IOException;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.deepreal.exceptions.DuplicatedValueException;
import com.deepreal.exceptions.InvalidEmailException;
import com.deepreal.exceptions.InvalidVideoFormatException;
import com.deepreal.exceptions.ObjectNotFoundException;

import lombok.extern.slf4j.Slf4j;

@Slf4j(topic = "GLOBAL_EXCEPTION_HANDLER")
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @Value("${server.error.include-exception:false}") // Define um valor padrão caso não esteja configurado
    private boolean printStackTrace;

    @ExceptionHandler(InvalidEmailException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Object> handleInvalidEmailException(
            InvalidEmailException exception,
            WebRequest request) {
        return buildErrorResponse(exception, "E-mail inválido.", HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(ObjectNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<Object> handleObjectNotFoundException(
            ObjectNotFoundException exception,
            WebRequest request) {
        return buildErrorResponse(exception, exception.getMessage(), HttpStatus.NOT_FOUND, request);
    }

    @ExceptionHandler(InvalidVideoFormatException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Object> handleInvalidVideoFormatException(
            ObjectNotFoundException exception,
            WebRequest request) {
        return buildErrorResponse(exception, exception.getMessage(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(DuplicatedValueException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ResponseEntity<Object> handleDuplicatedValueException(
            DuplicatedValueException duplicatedValueException,
            WebRequest request) {
        final String errorMessage = duplicatedValueException.getMessage();
        log.error(errorMessage, duplicatedValueException);
        return buildErrorResponse(
                duplicatedValueException,
                errorMessage,
                HttpStatus.CONFLICT,
                request);
    }

    @ExceptionHandler(IOException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Object> handleIOException(
            IOException exception,
            WebRequest request) {
        return buildErrorResponse(exception, "Erro ao processar o arquivo.", HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(MultipartException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Object> handleMultipartException(
            MultipartException exception,
            WebRequest request) {
        return buildErrorResponse(exception, "Erro no upload do arquivo.", HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<Object> handleGenericException(
            Exception exception,
            WebRequest request) {
        return buildErrorResponse(exception, "Erro inesperado no servidor.", HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    private ResponseEntity<Object> buildErrorResponse(
            Exception exception,
            String message,
            HttpStatus httpStatus,
            WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(httpStatus.value(), message);
        if (this.printStackTrace) {
            errorResponse.setStackTrace(ExceptionUtils.getStackTrace(exception));
        }
        log.error("{} - {}", message, exception.getMessage());
        return ResponseEntity.status(httpStatus).body(errorResponse);
    }
}
