package com.took.user_api.dto.response.party;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PayHistoryResponseDto {

    @Schema(description = "결제 시퀀스", example = "123456")
    private Long paySeq;

    @Schema(description = "사용자 이름(상대방)", example = "홍*동")
    private String userName;

    @Schema(description = "사용자 이미지 번호(상대방)", example = "1")
    private int imageNo;

    @Schema(description = "금액", example = "10000")
    private Long cost;

    @Schema(description = "입출금여부, 입금:true, 송금:false", example = "true")
    private boolean receive;

    @Schema(description = "결제 생성 시간", example = "2023-08-09T12:34:56")
    private LocalDateTime createdAt;

    @Schema(description = "은행 번호", example = "123")
    private int bankNum;

    @Schema(description = "계좌 번호(마지막 4자리)", example = "6789")
    private String accountNum;

    @Schema(description = "카테고리 (배달,택시,공구,정산)", example = "1")
    private int category;

    public PayHistoryResponseDto(Long paySeq, String userName, int imageNo, Long cost, boolean receive, LocalDateTime createdAt, int bankNum, String accountNum) {
        this.paySeq = paySeq;
        this.userName = userName;
        this.imageNo = imageNo;
        this.cost = cost;
        this.receive = receive;
        this.createdAt = createdAt;
        this.bankNum = bankNum;
        this.accountNum = accountNum;
    }
}
