package com.yupi.aicodehelper.ai.session;

import com.alibaba.fastjson2.JSON;
import com.yupi.aicodehelper.ai.data.UserSession;
import jakarta.annotation.Resource;
import lombok.AllArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Component
@AllArgsConstructor
public class SessionManager {
    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    public List<UserSession> getSessions() {

        Object o = redisTemplate.opsForValue().get("chat:sessions");
        if (o == null) {
            return List.of();
        }
        return JSON.parseArray(o.toString(), UserSession.class);

    }

    public void addSession(UserSession userSession) {
        List<UserSession> sessions = getSessions();
        if (userSession == null || sessions.isEmpty()) {
            sessions = new ArrayList<>();
        }
        sessions.add(userSession);
        redisTemplate.opsForValue().set("chat:sessions", JSON.toJSONString(sessions), Duration.ofDays(1));
    }

}
