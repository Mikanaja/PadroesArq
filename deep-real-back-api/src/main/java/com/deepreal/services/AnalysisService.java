package com.deepreal.services;

import java.nio.file.Path;
import java.util.Arrays;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.deepreal.exceptions.InvalidVideoFormatException;
import com.deepreal.models.Video;
import com.deepreal.repositories.UserRepository;
import com.deepreal.repositories.VideoRepository;

import jakarta.transaction.Transactional;

@Service
public class AnalysisService {
    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private S3Service s3Service;

    private static final String[] validFormats = {"mp4", "avi", "mkv", "mov", "flv"};

    @Transactional
    public Video uploadVideo(Path filePath, String fileName, String fileType, Long fileSize) {
        String s3Url = s3Service.uploadFile(filePath, "videos/" + fileName, fileType);

        //User user = userRepository.findById(userId)
        //        .orElseThrow(() -> new ObjectNotFoundException("Usuário não encontrado"));

        Video video = new Video();
        video.setTitle(fileName);
        video.setS3Url(s3Url);
        video.setFileType(fileType);
        video.setFileSize(fileSize);
        //video.setUser(user);

        return video;
    }

    public void isFormatTypeCorrect(String fileType) {
        if (!Arrays.asList(validFormats).contains(fileType)) {
            throw new InvalidVideoFormatException("Apenas os formatos de vídeo" + Arrays.toString(validFormats) + " são aceitos.");	
        }
    }
}
