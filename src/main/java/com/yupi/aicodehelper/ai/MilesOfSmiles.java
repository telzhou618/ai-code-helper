package com.yupi.aicodehelper.ai;

import com.yupi.aicodehelper.ai.data.UserSession;
import com.yupi.aicodehelper.ai.service.AiGreetingExpertService;
import com.yupi.aicodehelper.ai.session.SessionManager;
import com.yupi.aicodehelper.ai.store.PersistentChatMemoryStore;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.UserMessage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class MilesOfSmiles {

    private final AiGreetingExpertService aiGreetingExpertService;
    private final AiCodeHelperService aiCodeHelperService;
    private final SessionManager sessionManager;
    private final PersistentChatMemoryStore persistentChatMemoryStore;


    public String handle(int memoryId, String userMessage) {
        if (aiGreetingExpertService.isGreeting(userMessage)) {
            return "你好，有什么我可以帮忙的吗？";
        } else {
            return aiCodeHelperService.chat(userMessage);
        }
    }

    public Flux<String> handleStream(int memoryId, Boolean isNewSession, String message) {
        if (message == null || message.isBlank()) {
            return Flux.just("请输入内容");
        }
        // 新建会话
        if (isNewSession != null && isNewSession) {
            sessionManager.addSession(new UserSession(memoryId, message, new Date()));
        }
        if (aiGreetingExpertService.isGreeting(message)) {
            // 打招呼消息不能用AI处理，直接返回固定的问候语，但需要持久化
            List<ChatMessage> messages = persistentChatMemoryStore.getMessages(memoryId);
            if (messages.isEmpty()) {
                messages = new LinkedList<>();
            }
            messages.add(new UserMessage(message));
            messages.add(new AiMessage("你好，有什么我可以帮忙的吗？"));
            persistentChatMemoryStore.updateMessages(memoryId, messages);

            return Flux.just("你好，有什么我可以帮忙的吗？");
        } else {
            return aiCodeHelperService.chatStream(memoryId, message);
        }
    }
}
