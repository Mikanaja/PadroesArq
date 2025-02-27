package com.deepreal.controllers;

import com.deepreal.models.dto.EnumDto;
import com.deepreal.services.EnumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/app")
public class AppController {

    private static final String message = "DeepReal API is running!";

    @Autowired
    private EnumService enumService;

    @GetMapping(path = "/health")
    @ResponseStatus(HttpStatus.OK)
    public String health() {
        return message;
    }

    @GetMapping(path = "/enum/{name}")
    public List<EnumDto> findEnumByName(@PathVariable(name = "name") String name) {
        return this.enumService.findEnumByName(name);
    }
}
