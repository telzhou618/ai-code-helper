package com.yupi.aicodehelper.ai;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
class MilesOfSmilesTest {

    @Autowired
    private MilesOfSmiles milesOfSmiles;

    @Test
    void handle() {
        String hello = milesOfSmiles.handle("你好");
        System.out.println(hello);
    }
}