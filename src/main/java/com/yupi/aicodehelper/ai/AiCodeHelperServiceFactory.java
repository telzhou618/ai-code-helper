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
    public AiCodeHelperService aiCodeHelperService(ChatMemoryProvider myChatMemoryProvider) {

        // 构造 AI Service
        return AiServices.builder(AiCodeHelperService.class)
                .chatModel(myQwenChatModel)  // 聊天模型
                .streamingChatModel(myQwenStreamChatModel) // 流式聊天模型
                .chatMemoryProvider(myChatMemoryProvider)  // 聊天记忆提供者
                .tools(new InterviewQuestionTool(), new DateTool()) // 工具调用
//                .contentRetriever(contentRetriever) // RAG 检索增强生成
//                .toolProvider(mcpToolProvider) // MCP 工具调用
                .build();
    }

    @Bean
    public ChatMemoryProvider myChatMemoryProvider() {
        return memoryId -> MessageWindowChatMemory.builder()
                .id(memoryId)
                .maxMessages(10)
                .chatMemoryStore(persistentChatMemoryStore)
                .build();
    }

}
