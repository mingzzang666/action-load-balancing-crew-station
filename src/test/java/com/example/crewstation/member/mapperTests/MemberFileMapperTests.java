package com.example.crewstation.member.mapperTests;

import com.example.crewstation.domain.file.member.MemberFileVO;
import com.example.crewstation.mapper.member.MemberFileMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Slf4j
public class MemberFileMapperTests {
    @Autowired
    private MemberFileMapper memberFileMapper;

    @Test
    @Transactional
    public void testInsertFile() {
        MemberFileVO memberFileVO = MemberFileVO.builder()
                .fileId(1L)
                .memberId(1L)
                .build();
        memberFileMapper.insert(memberFileVO);
    }
}
