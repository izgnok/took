package com.took.user_api.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "bank")
@Table(name = "bank")
@Builder
@ToString
public class BankEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bankSeq;

    @Column(name="bank_num")
    private int bankNum;

    @Column(name="account_num")
    private String accountNum;

    @Column(name="account_pwd")
    private int accountPwd;

    @Column(name="own")
    private String own;

    @Column(name="balance")
    private Long balance;

    @Column(name="is_bank")
    private boolean isBank;

    public void updateBalance(long balance) {
        this.balance = balance;
    }
}
