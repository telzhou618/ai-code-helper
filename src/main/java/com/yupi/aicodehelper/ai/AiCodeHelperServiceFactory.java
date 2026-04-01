package com.yupi.aicodehelper.ai;

import com.yupi.aicodehelper.ai.tools.DateTool;
import com.yupi.aicodehelper.ai.tools.InterviewQuestionTool;
import dev.langchain4j.memory.chat.ChatMemoryProvider;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.store.memory.chat.ChatMemoryStore;
import jakarta.annotation.Resource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiCodeHelperServiceFactory {

    @Resource
    private ChatModel myQwenChatModel;

    @Resource
    private StreamingChatModel myQwenStreamChatModel;

//    @Resource
//    private ContentRetriever contentRetriever;

//    @Resource
//    private McpToolProvider mcpToolProvider;

    @Resource
    private ChatMemoryStore persistentChatMemoryStore;

    @Bean
    public AiCodeHelperService aiCodeHelperService() {
        // 会话记忆
        ChatMemoryProvider chatMemoryProvider = memoryId -> MessageWindowChatMemory.builder()
                .id(memoryId)
                .maxMessages(10)
                .chatMemoryStore(persistentChatMemoryStore)
                .build();

        // 构造 AI Service
        AiCodeHelperService aiCodeHelperService = AiServices.builder(AiCodeHelperService.class)
                .chatModel(myQwenChatModel)
                .streamingChatModel(myQwenStreamChatModel)
                .chatMemoryProvider(chatMemoryProvider)
//                .chatMemory(chatMemory)
//                .chatMemoryProvider(memoryId ->
//                        MessageWindowChatMemory.withMaxMessages(10)) // 每个会话独立存储
//                .contentRetriever(contentRetriever) // RAG 检索增强生成
                .tools(new InterviewQuestionTool(), new DateTool()) // 工具调用
//                .toolProvider(mcpToolProvider) // MCP 工具调用
                .build();
        return aiCodeHelperService;
    }
}
