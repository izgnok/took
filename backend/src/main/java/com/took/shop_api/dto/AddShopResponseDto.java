package com.took.shop_api.dto;

import com.took.shop_api.entity.Shop;
import lombok.Data;

@Data
public class AddShopResponseDto {
    private Long shopSeq;
    private Long userSeq;
    private Long roomSeq;
    private String title;
    private String content;
    private String item;
    private String site;
    private String place;
    private int maxCount;
    private double lat;
    private double lon;

    public AddShopResponseDto(Shop shop) {
        this.shopSeq = shop.getShopSeq();
        this.userSeq = shop.getUser().getUserSeq();
        this.roomSeq = shop.getRoomSeq();
        this.title = shop.getTitle();
        this.content = shop.getContent();
        this.item = shop.getItem();
        this.site = shop.getSite();
        this.place = shop.getPlace();
        this.maxCount = shop.getMaxCount();
        this.lat = shop.getLat();
        this.lon = shop.getLon();
    }
}
