package com.took.fcm_api.dto;

import lombok.Data;
@Data
public class FCMTokenRequest {
    private Long userSeq;

    private String Token;
}