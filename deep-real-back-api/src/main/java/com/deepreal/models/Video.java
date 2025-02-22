package com.deepreal.models;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "videos")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @NotBlank
    private UUID id;

    @Column(name = "titulo")
    @NotBlank
    private String title;

    @Column(name = "url_bucket")
    @NotBlank
    private String s3Url;

    @Column(name = "extensao_arquivo")
    @NotBlank
    private String fileType;

    @Column(name = "tamanho_arquivo")
    @NotBlank
    private Long fileSize;

    @Column(name = "horario_criacao", updatable = false)
    @NotBlank
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
