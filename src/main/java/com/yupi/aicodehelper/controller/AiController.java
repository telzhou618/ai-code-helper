package com.yupi.aicodehelper.controller;

import com.yupi.aicodehelper.ai.AiCodeHelperService;
import com.yupi.aicodehelper.ai.MilesOfSmiles;
import com.yupi.aicodehelper.ai.data.UserSession;
import com.yupi.aicodehelper.ai.session.SessionManager;
import com.yupi.aicodehelper.ai.store.PersistentChatMemoryStore;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.ChatMessageSerializer;
import dev.langchain4j.guardrail.InputGuardrailException;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.util.List;

@RestController
@RequestMapping("/ai")
public class AiController {

    @Resource
    private AiCodeHelperService aiCodeHelperService;
    @Resource
    private MilesOfSmiles milesOfSmiles;
    @Resource
    private SessionManager sessionManager;
    @Autowired
    private PersistentChatMemoryStore memoryStore;

    @GetMapping("/chat")
    public Flux<ServerSentEvent<String>> chat(int memoryId,
                                              Boolean isNewSession,
                                              String message) {
        try {
            return milesOfSmiles.handleStream(memoryId, isNewSession, message)
                    .map(chunk -> ServerSentEvent.<String>builder()
                            .data(chunk)
                            .build())
                    .onErrorResume(this::handleStreamError);
        } catch (Exception e) {
            return handleStreamError(e);
        }
    }

    @GetMapping("/getSessions")
    public List<UserSession> getSessions() {
        return sessionManager.getSessions();
    }

    @GetMapping("/getSessionMessages")
    public String getSessionMessages(int memoryId) {
        List<ChatMessage> messages = memoryStore.getMessages(memoryId);
        return ChatMessageSerializer.messagesToJson(messages);
    }

    @GetMapping("/delSession")
    public String delSession(int memoryId) {
        memoryStore.deleteMessages(memoryId);
        sessionManager.deleteSession(memoryId);
        return "success";
    }

    private Flux<ServerSentEvent<String>> handleStreamError(Throwable e) {
        String errorMsg;
        if (e instanceof InputGuardrailException) {
            errorMsg = "输入内容携带非法内容，已被拦截：" + e.getMessage();
        } else {
            errorMsg = "服务器内部错误：" + e.getMessage();
        }
        return Flux.just(ServerSentEvent.<String>builder()
                .data(errorMsg)
                .build());
    }
}
