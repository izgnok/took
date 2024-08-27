package com.took.user_api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;


@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "account")
@Table(name = "account")
@Builder
@ToString
public class AccountEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountSeq;

    @Column(name="account_name")
    private String accountName;

    @Column(name = "main")
    private Boolean main;

    @Column(name="easyPwd",nullable=false)
    private String easyPwd;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name="user_seq")
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name="bank_seq", nullable = false)
    private BankEntity bank;


    public AccountEntity(String accountName, Boolean main,UserEntity user, BankEntity bank,String easyPwd){

        this.accountName = accountName;
        this.user = user;
        this.bank = bank;
        this.main = main;
        this.easyPwd = easyPwd;

    }




}
