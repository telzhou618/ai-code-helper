package com.yupi.aicodehelper.controller;

import com.yupi.aicodehelper.ai.AiCodeHelperService;
import dev.langchain4j.guardrail.InputGuardrailException;
import jakarta.annotation.Resource;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/ai")
public class AiController {

    @Resource
    private AiCodeHelperService aiCodeHelperService;

    @GetMapping("/chat")
    public Flux<ServerSentEvent<String>> chat(int memoryId, String message) {
        try {
            return aiCodeHelperService.chatStream(memoryId, message)
                    .map(chunk -> ServerSentEvent.<String>builder()
                            .data(chunk)
                            .build())
                    .onErrorResume(this::handleStreamError);
        } catch (Exception e) {
            return handleStreamError(e);
        }
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
