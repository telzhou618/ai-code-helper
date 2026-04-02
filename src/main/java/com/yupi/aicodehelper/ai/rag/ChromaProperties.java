package com.yupi.aicodehelper.ai.rag;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "chroma")
public class ChromaProperties {
    private String baseUrl;
    private String collectionName;
}