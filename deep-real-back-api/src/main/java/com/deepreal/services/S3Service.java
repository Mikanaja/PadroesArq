package com.deepreal.services;

import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class S3Service {
    
    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    public S3Service(
        @Value("${aws.s3.region}") String region,
        @Value("${aws.s3.access-key}") String accessKey,
        @Value("${aws.s3.secret-key}") String secretKey) {

        this.s3Client = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)
                ))
                .build();
    }

     public String uploadFile(Path filePath, String key, String fileFormat) {
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(this.bucketName)
                .key(key)
                .contentType("video/" + fileFormat) // Ajuste conforme necessário
                .build();

        s3Client.putObject(request, RequestBody.fromFile(filePath));

        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, "us-east-1", key);
    }

}
