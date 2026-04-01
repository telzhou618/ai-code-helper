package com.yupi.aicodehelper.ai.store;

import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.ChatMessageDeserializer;
import dev.langchain4j.data.message.ChatMessageSerializer;
import dev.langchain4j.store.memory.chat.ChatMemoryStore;
import jakarta.annotation.Resource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
public class PersistentChatMemoryStore implements ChatMemoryStore {
    // Redis key prefix for chat memory data
    private static final String KEY_PREFIX = "chat_memory:";
    // Expiration time for chat memory data in days
    private static final int EXPIRE_IN_DAYS = 1;

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public List<ChatMessage> getMessages(Object memoryId) {
        String data = (String) redisTemplate.opsForValue().get(getKey(memoryId));
        if (data != null) {
            return ChatMessageDeserializer.messagesFromJson(data);
        }
        return List.of();
    }

    @Override
    public void updateMessages(Object memoryId, List<ChatMessage> messages) {
        String data = ChatMessageSerializer.messagesToJson(messages);
        redisTemplate.opsForValue().set(getKey(memoryId), data, Duration.ofDays(EXPIRE_IN_DAYS));
    }

    @Override
    public void deleteMessages(Object memoryId) {
        redisTemplate.delete(getKey(memoryId));
    }

    public String getKey(Object memoryId) {
        return KEY_PREFIX + memoryId.toString();
    }
}
