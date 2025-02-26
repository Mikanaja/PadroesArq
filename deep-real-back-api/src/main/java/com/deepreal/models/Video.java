package com.deepreal.models;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "videos")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Video {

    public static final String TABLE_NAME = "videos";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @NotNull
    private UUID id;

    @Column(name = "titulo", updatable = false)
    @NotBlank
    private String title;

    @Column(name = "url_bucket", updatable = false)
    @NotBlank
    private String s3Url;

    @Column(name = "extensao_arquivo", updatable = false)
    @NotBlank
    private String fileType;

    @Column(name = "tamanho_arquivo", updatable = false)
    @NotNull
    private Long fileSize;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_analise", nullable = false)
    AnalysisState state;

    @Column(name = "horario_criacao", updatable = false)
    @NotNull
    @PastOrPresent
    private LocalDateTime createdAt;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) 
    @JoinColumn(name = "user_id", nullable = false, referencedColumnName = "id")
    private User user;

    @Getter
    @AllArgsConstructor
    public enum AnalysisState {
        FAKE(0, "Deepfake detectado"),
        REAL(1, "Deepfake não detectado");
        private int code;
        private String descricao;
    }

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
