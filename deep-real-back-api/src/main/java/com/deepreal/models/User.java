package com.deepreal.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import io.micrometer.common.lang.NonNull;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Getter @Setter
@Table(name = "users")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class User {
    
    public static final String TABLE_NAME = "users";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @NonNull
    private UUID id;

    @Column(name = "e-mail", unique = true, nullable = false, updatable = false)
    @NotBlank
    @Size(min = 5)
    private String email;

    @Column(name = "horario_criacao", updatable = false)
    @NotNull
    @PastOrPresent
    private LocalDateTime createdAt;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) 
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Video> videos;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }

}
