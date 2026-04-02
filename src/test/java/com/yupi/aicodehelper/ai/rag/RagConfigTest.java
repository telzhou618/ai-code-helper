package com.yupi.aicodehelper.ai.rag;

import dev.langchain4j.rag.content.Content;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.query.Query;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class RagConfigTest {

    @Resource
    private RagConfig ragConfig;
    @Resource
    private ContentRetriever contentRetriever;

    @Test
    void ingestData() {
        ragConfig.ingestData();
    }

    @Test
    void testContentRetriever() {
        List<Content> contentList = contentRetriever.retrieve(
                new Query("鱼皮的求职指南")
        );
        System.out.println(contentList);
    }
}