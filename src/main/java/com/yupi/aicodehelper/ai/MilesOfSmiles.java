package com.yupi.aicodehelper.ai;

import com.yupi.aicodehelper.ai.data.UserSession;
import com.yupi.aicodehelper.ai.service.AiGreetingExpertService;
import com.yupi.aicodehelper.ai.session.SessionManager;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.Date;

@Slf4j
@Service
@AllArgsConstructor
public class MilesOfSmiles {

    private final AiGreetingExpertService aiGreetingExpertService;
    private final AiCodeHelperService aiCodeHelperService;
    private final SessionManager sessionManager;


    public String handle(int memoryId, String userMessage) {
        if (aiGreetingExpertService.isGreeting(userMessage)) {
            return "你好，有什么我可以帮忙的吗？";
        } else {
            return aiCodeHelperService.chat(userMessage);
        }
    }

    public Flux<String> handleStream(int memoryId, Boolean isNewSession, String message) {
        if (isNewSession != null && isNewSession) {
            sessionManager.addSession(new UserSession(memoryId,
                    message == null || message.isBlank() ? "新建会话" : message,
                    new Date()));
        }
        if (aiGreetingExpertService.isGreeting(message)) {
            return Flux.just("你好，想聊点什么呢");
        } else {
            return aiCodeHelperService.chatStream(memoryId, message);
        }
    }
}
