package com.example.crewstation.banner;

import com.example.crewstation.dto.banner.BannerDTO;
import com.example.crewstation.mapper.banner.BannerMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@SpringBootTest
@Slf4j
public class MapperTests {

    @Autowired
    private BannerMapper bannerMapper;
    @Autowired
    private BannerDTO bannerDTO;

    @Test
    public void getBannerTest() {
        List<BannerDTO> banners = bannerMapper.getBanners(5);
        log.info("banners: {}", banners);
    }

    @Test
    @Transactional
    public void insertBannerTest() {
        BannerDTO banner = new BannerDTO();
        banner.setBannerOrder(1);
        bannerMapper.insertBanner(banner);

        log.info("생성된 배너 ID: {}", banner.getBannerId());
    }

    @Test
    @Transactional
    public void insertBannerFileTest() {
        Long testFileId = 119L;
        Long testBannerId = 1L;

        bannerMapper.insertBannerFile(testBannerId,testFileId);

        log.info("fileId: {}, bannerId: {}", testFileId, testBannerId);
    }


    @Test
    public void updateBannerFileTest() {
        Long testBannerId = 1L;
        Long bannerOrder = 54L;
        bannerMapper.updateBannerFile(bannerDTO);

        log.info("배너 파일 수정{}", testBannerId, bannerOrder);

    }

}
