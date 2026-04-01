package com.yupi.aicodehelper.ai.service;

import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.spring.AiService;
import dev.langchain4j.service.spring.AiServiceWiringMode;

@AiService(
        wiringMode = AiServiceWiringMode.EXPLICIT,
        chatModel = "myQwenChatModel"
)
public interface AiGreetingExpertService {

    @UserMessage("Is the following text a greeting? Text: {{it}}")
    boolean isGreeting(String text);
}
