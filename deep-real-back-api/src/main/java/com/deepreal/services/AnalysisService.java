package com.deepreal.services;

import java.nio.file.Path;
import java.util.Arrays;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.deepreal.exceptions.InvalidVideoFormatException;
import com.deepreal.models.User;
import com.deepreal.models.Video;
import com.deepreal.repositories.VideoRepository;

import jakarta.transaction.Transactional;

@Service
public class AnalysisService {
    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private S3Service s3Service;

    private static final String[] validFormats = {"video/mp4", "video/avi", "video/mkv", "video/mov", "video/flv"};

    @Transactional
    public Video uploadVideo(UUID userId, Path filePath, String fileName, String fileType, Long fileSize) {
        this.isFormatTypeCorrect(fileType);

        User user = userService.findUser(userId);

        String s3Url = s3Service.uploadFile(filePath, "users/" + user.getEmail() + "/videos/" + fileName, fileType);

        Video video = new Video();
        video.setTitle(fileName);
        video.setS3Url(s3Url);
        video.setFileType(fileType);
        video.setFileSize(fileSize);
        video.setUser(user);

        return videoRepository.save(video);
    }

    public void isFormatTypeCorrect(String fileType) {
        if (!Arrays.asList(validFormats).contains(fileType)) {
            throw new InvalidVideoFormatException("Apenas os formatos de vídeo: " + Arrays.toString(validFormats) + " são aceitos. seu formato: " + fileType + " não é aceito.");	
        }
    }

    public void isSizeCorrect(Long fileSize) {
        if (fileSize > 105906176) { // 100MB + 1MB de margem
            throw new InvalidVideoFormatException("O tamanho máximo permitido é de 100MB. Seu arquivo tem " + fileSize + " bytes.");
        }
    }
}
