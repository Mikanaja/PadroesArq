package com.deepreal.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.deepreal.models.Video;
import com.deepreal.services.AnalysisService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/upload")
public class UploadController {

    @Autowired
    AnalysisService analysisService;
    

    @PostMapping()
    public ResponseEntity<Video> uploadVideo(@RequestParam("file") MultipartFile file) {
        try {
            Path tempFile = Files.createTempFile("upload-", file.getOriginalFilename());
            file.transferTo(tempFile.toFile());
            Video video = analysisService.uploadVideo(tempFile, file.getOriginalFilename(), file.getContentType(), file.getSize());
            return ResponseEntity.ok().body(video);
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        }
    }
    
}
