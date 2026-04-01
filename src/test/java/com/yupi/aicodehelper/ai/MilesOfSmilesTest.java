package com.yupi.aicodehelper.ai;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


@SpringBootTest
class MilesOfSmilesTest {

    @Autowired
    private MilesOfSmiles milesOfSmiles;

    @Test
    void handle() {
        String hello = milesOfSmiles.handle(memoryId, isNewSession, "你好");
        System.out.println(hello);
    }
}