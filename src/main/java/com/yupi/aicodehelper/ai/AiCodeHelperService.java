package com.yupi.aicodehelper.ai;

import com.yupi.aicodehelper.ai.data.Report;
import com.yupi.aicodehelper.ai.guardrail.SafeInputGuardrail;
import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.Result;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.guardrail.InputGuardrails;
import reactor.core.publisher.Flux;

//改为手动构建，更灵活
//@AiService
@InputGuardrails({SafeInputGuardrail.class})
public interface AiCodeHelperService {

    @SystemMessage(fromResource = "system-prompt.txt")
    String chat(String userMessage);

    @SystemMessage(fromResource = "system-prompt.txt")
    Report chatForReport(String userMessage);

    @SystemMessage(fromResource = "system-prompt.txt")
    Result<String> chatWithRag(String userMessage);

    // 流式对话
    @SystemMessage(fromResource = "system-prompt.txt")
    Flux<String> chatStream(@MemoryId int memoryId, @UserMessage String userMessage);

    /**
     * 分析文本情绪
     * 框架会自动将 LLM 返回的文本（如 "HAPPY"）转换为 Emotion 枚举实例
     */
    @UserMessage("分析以下文本的情绪，只返回 HAPPY、SAD、ANGRY 或 NEUTRAL 中的一个：{{text}}")
    Emotion analyzeEmotion(String text);

    public enum Emotion {
        HAPPY, SAD, ANGRY, NEUTRAL;
    }
}
