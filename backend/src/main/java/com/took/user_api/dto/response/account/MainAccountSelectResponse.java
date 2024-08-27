package com.took.user_api.dto.response.account;

import com.took.user_api.entity.AccountEntity;
import com.took.user_api.entity.BankEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "메인 계좌 선택 응답")
public class MainAccountSelectResponse {

    @Schema(description = "계좌 시퀀스", example = "1")
    private Long accountSeq;

    @Schema(description = "사용자 시퀀스", example = "1")
    private Long userSeq;

    @Schema(description = "은행 시퀀스", example = "1")
    private Long bankSeq;

    @Schema(description = "계좌 이름", example = "생활비 계좌")
    private String accountName;

    @Schema(description = "간편 비밀번호", example = "1234")
    private String easyPwd;

    @Schema(description = "은행 번호", example = "100")
    private int bankNum;

    @Schema(description = "계좌 번호", example = "123-456-789")
    private String accountNum;

    @Schema(description = "계좌 비밀번호", example = "1234")
    private int accountPwd;

    @Schema(description = "소유자", example = "홍길동")
    private String own;

    @Schema(description = "잔액", example = "1000000")
    private Long balance;

    @Schema(description = "은행 여부", example = "true")
    private boolean isBank;

    public MainAccountSelectResponse(AccountEntity account, BankEntity bank) {
        this.accountSeq = account.getAccountSeq();
        this.userSeq = account.getUser().getUserSeq();
        this.bankSeq = bank.getBankSeq();
        this.accountName = account.getAccountName();
        this.easyPwd = account.getEasyPwd();
        this.bankNum = bank.getBankNum();
        this.accountNum = bank.getAccountNum();
        this.accountPwd = bank.getAccountPwd();
        this.own = bank.getOwn();
        this.balance = bank.getBalance();
        this.isBank = bank.isBank();
    }
}
