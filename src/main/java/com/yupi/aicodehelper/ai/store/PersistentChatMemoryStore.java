package com.yupi.aicodehelper.ai.store;

import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.ChatMessageDeserializer;
import dev.langchain4j.data.message.ChatMessageSerializer;
import dev.langchain4j.store.memory.chat.ChatMemoryStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
public class PersistentChatMemoryStore implements ChatMemoryStore {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public List<ChatMessage> getMessages(Object memoryId) {
        String data = (String) redisTemplate.opsForValue().get(memoryId.toString());
        if (data != null) {
            return ChatMessageDeserializer.messagesFromJson(data);
        }
        return List.of();
    }

    @Override
    public void updateMessages(Object memoryId, List<ChatMessage> messages) {
        String data = ChatMessageSerializer.messagesToJson(messages);
        redisTemplate.opsForValue().set(memoryId.toString(), data, Duration.ofDays(7));
    }

    @Override
    public void deleteMessages(Object memoryId) {
        redisTemplate.delete(memoryId.toString());
    }
}
