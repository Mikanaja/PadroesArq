package com.deepreal.services;

import com.deepreal.models.Video;
import com.deepreal.models.dto.EnumDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnumService {

    public List<EnumDto> findEnumByName(String name) {
        return switch (name) {
            case "analysisState" -> Video.AnalysisState.buildEnumDto();
            default -> null;
        };
    }
}
