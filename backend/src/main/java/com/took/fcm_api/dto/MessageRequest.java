package com.took.fcm_api.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;


@Builder
@Data
public class MessageRequest {
    private String title;
    private String body;
    private List<Long> userSeqList;

}
