package com.yupi.aicodehelper.ai;

import com.yupi.aicodehelper.ai.service.AiGreetingExpertService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Slf4j
@Service
@AllArgsConstructor
public class MilesOfSmiles {

    private final AiGreetingExpertService aiGreetingExpertService;
    private final AiCodeHelperService aiCodeHelperService;


    public String handle(String userMessage) {
        if (aiGreetingExpertService.isGreeting(userMessage)) {
            return "你好，有什么我可以帮忙的吗？";
        } else {
            return aiCodeHelperService.chat(userMessage);
        }
    }

    public Flux<String> handle(int memoryId, String message) {
        if (aiGreetingExpertService.isGreeting(message)) {
            return Flux.just("你好，有什么我可以帮忙的吗？");
        } else {
            return aiCodeHelperService.chatStream(memoryId, message);
        }
    }
}
