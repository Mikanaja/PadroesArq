package com.deepreal.services;

import java.nio.file.Path;
import java.util.Arrays;
import java.util.Collections;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.stereotype.Service;

import com.deepreal.exceptions.InvalidVideoFormatException;
import com.deepreal.models.User;
import com.deepreal.models.Video;
import com.deepreal.models.Video.AnalysisState;
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

    @Autowired
    private EmailService emailService;

    private static final String[] validFormats = {"video/mp4", "video/avi", "video/mkv", "video/mov", "video/flv"};

    private final WebClient webClient = WebClient.create();

    @Transactional
    public Video uploadVideo(UUID userId, Path filePath, String fileName, String fileType, Long fileSize) {
        this.isFormatTypeCorrect(fileType);
        this.isSizeCorrect(fileSize);

        User user = userService.findUser(userId);

        Video video = new Video();
        video.setTitle(fileName);
        video.setFileType(fileType);
        video.setFileSize(fileSize);
        video.setUser(user);

        // Armazenar no S3
        String s3Url = s3Service.uploadFile(filePath, "users/" + user.getEmail() + "/videos/" + fileName, fileType);
        video.setS3Url(s3Url);

        // Verificar se é deepfake
        video.setState(this.verificarDeepFake(s3Url));
        //video.setState(AnalysisState.REAL);

        // Enviar e-mail
        emailService.sendDeepfakeAnalysisEmail(user.getEmail(), fileName, video.getState());

        return videoRepository.save(video);
    }

    // Chamar AI Client
    public AnalysisState verificarDeepFake(String video_url) {
        String result = webClient.post()
            .uri("http://localhost:8000/upload/")
            .bodyValue(Collections.singletonMap("video_url", video_url)) 
            .retrieve() 
            .bodyToMono(String.class)
            .block();

        System.out.println("Resultado da análise: " + result);
        return result.contains("Deepfake") ? AnalysisState.FAKE : AnalysisState.REAL;
    }

    // Métodos auxiliares de validação
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
