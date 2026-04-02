package com.yupi.aicodehelper.ai.rag;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.chroma.ChromaApiVersion;
import dev.langchain4j.store.embedding.chroma.ChromaEmbeddingStore;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(ChromaProperties.class)
public class ChromaConfig {

    @Bean
    public EmbeddingStore<TextSegment> chromaEmbeddingStore(ChromaProperties properties) {
        return ChromaEmbeddingStore.builder()
                .baseUrl(properties.getBaseUrl())
                .collectionName(properties.getCollectionName())
                .apiVersion(ChromaApiVersion.V2)
                .build();
    }
}
