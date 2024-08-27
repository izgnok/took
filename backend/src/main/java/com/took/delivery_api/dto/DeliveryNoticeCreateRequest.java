package com.took.delivery_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 공지사항 등록 요청 DTO
 */
@Data
public class DeliveryNoticeCreateRequest {

    @Schema(description = "배달 고유 번호", example = "123")
    private Long deliverySeq;  // 배달 고유 번호

    @Schema(description = "공지사항 내용", example = "배달 시 주의 사항을 꼭 확인하세요.")
    private String notice;  // 공지사항 내용
}
