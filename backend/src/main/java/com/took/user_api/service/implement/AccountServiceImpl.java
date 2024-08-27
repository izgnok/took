package com.took.user_api.service.implement;


import com.took.user_api.dto.request.account.*;
import com.took.user_api.dto.response.ResponseDto;
import com.took.user_api.dto.response.VoidResponseDto;
import com.took.user_api.dto.response.account.*;
import com.took.user_api.entity.AccountEntity;
import com.took.user_api.entity.BankEntity;
import com.took.user_api.entity.UserEntity;
import com.took.user_api.repository.*;
import com.took.user_api.repository.custom.AccountRepositoryCustom;
import com.took.user_api.repository.custom.BankRepositoryCustom;
import com.took.user_api.service.AccountService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final BankRepository bankRepository;
    private final UserRepository userRepository;
    private final BankRepositoryCustom bankRepositoryCustom;
    private final AccountRepository accountRepository;
    private final AccountRepositoryCustom accountRepositoryCustom;
    private final MemberRepository memberRepository;
    private final PartyRepository partyRepository;

    @Transactional
    @Override
    public ResponseEntity<? super AccountLinkResponseDto> saveAccount(AccountLinkRequestDto dto) {

        try{

            // 계좌 인증용
            String accountNum = dto.getAccountNum();
            int accountPwd = dto.getAccountPwd();

            // 계좌 인증 완료
            BankEntity bank = bankRepositoryCustom.isMatched(accountNum,accountPwd);

            if(bank!=null){

                // 정보 저장
                String accountName = dto.getAccountName();
                UserEntity user = userRepository.getReferenceById(dto.getUserSeq());

                Boolean main = dto.getMain();
                AccountEntity account = new AccountEntity(accountName,main,user,bank,dto.getEasyPwd());

                if(main) accountRepositoryCustom.isMain(dto.getUserSeq());

                accountRepository.save(account);


            }else{
                return AccountLinkResponseDto.notFound();
            }
            

        }catch(Exception e){
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return AccountLinkResponseDto.success();
    }


    @Override
    @Transactional
    public ResponseEntity<? super ChangeMainResponseDto> changeMain(ChangeMainRequestDto dto) {
        
        try{
            accountRepositoryCustom.changeMain(dto.getUserSeq(),dto.getAccountSeq());
        }catch(Exception e){
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return ChangeMainResponseDto.success();
    }


//   제작
    @Transactional
    @Override
    public ResponseEntity<? super AccountListResponsetDto> accountList(AccountListRequestDto dto) {

        List<AccountEntity> al = null;
        List<BankEntity> bl = null;
        List<AccountListResponsetDto.BankAccount> result = new ArrayList<>();

        try{

//            al = accountRepositoryCustom.findAccountsByUserSeq(dto.getUserSeq());
            UserEntity user = userRepository.findById(dto.getUserSeq()).orElseThrow();
            al = accountRepository.findByUser(user);
            List<Long> bankSeq = new ArrayList<>();

            for(AccountEntity account : al){
                bankSeq.add(account.getBank().getBankSeq());
            }

//            bl = bankRepositoryCustom.findBanksByBankSeq(bankSeq);
            bl = bankRepository.findByBankSeqIn(bankSeq);

            int size = al.size();

            for(int i=0;i<size;i++){
                result.add(new AccountListResponsetDto.BankAccount(dto.getUserSeq(),
                        al.get(i).getAccountSeq(),
                        al.get(i).getAccountName(),
                        bl.get(i).getAccountNum(),
                        bl.get(i).getBankNum(),
                        bl.get(i).getBalance()));
            }



        }catch(Exception e){
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return AccountListResponsetDto.success(result);
    }

    @Transactional
    @Override
    public ResponseEntity<? super AccountBalanceResponseDto> balance(AccountSeqRequestDto dto) {
     
        Long bankSeq = null;
        Long balance = null;

        try{

            bankSeq = accountRepositoryCustom.findBankSeqByAccountSeq(dto.getAccountSeq());
            balance = bankRepositoryCustom.findBalanceByBankSeq(bankSeq);

        }catch(Exception e){
            e.printStackTrace();
            ResponseDto.databaseError();
        }

        return AccountBalanceResponseDto.success(balance);

    }


    @Transactional
    @Override
    public ResponseEntity<String> deleteAccount(Long accountSeq) {
        
        try{

            accountRepository.deleteById(accountSeq);

        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.ok("DBE!");
        }

        return ResponseEntity.ok("Done!");
    }


    @Transactional
    @Override
    public ResponseEntity<? super AccountEasyPwdResponseDto> updateEasyPwd(AccountEasyPwdRequestDto requestBody) {
        


        try{

            accountRepositoryCustom.updateEasyPwd(requestBody.getAccountSeq(),requestBody.getEasyPwd());

        }catch(Exception e){
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return AccountEasyPwdResponseDto.success();

    }

    @Transactional
    @Override
    public ResponseEntity<? super CheckEasyPwdResponseDto> checkEasyPwd(AccountEasyPwdRequestDto requestBody) {
        

        boolean result = false;

        try{

            String easyPwd = accountRepositoryCustom.checkEasyPwd(requestBody.getAccountSeq());

            if(easyPwd.equals(requestBody.getEasyPwd())) result = true;

        }catch(Exception e){
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return CheckEasyPwdResponseDto.success(result);
    }

    @Transactional
    @Override
    public ResponseEntity<? super VoidResponseDto> repay(RepayRequestDto requestBody) {

        Long bankSeq = null;
        BankEntity bank = null;

        try{

            bankSeq = accountRepositoryCustom.findBankSeqByAccountSeq(requestBody.getAccountSeq());
            bank = bankRepository.getReferenceById(bankSeq);
            long balance = bank.getBalance();

            if(balance < requestBody.getCost()) return ResponseDto.nomoney();

//           뱅크 업데이트 필요
            bank.updateBalance(balance + requestBody.getCost());

        }catch(Exception e){
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return VoidResponseDto.success();
    }


    @Transactional
    @Override
    public MainAccountSelectResponse getMainAccount(Long userSeq) {
        UserEntity user = userRepository.getReferenceById(userSeq);
        AccountEntity account = accountRepository.findByUserAndMainTrue(user);
        BankEntity bank = bankRepository.findById(account.getBank().getBankSeq()).orElseThrow();
        return new MainAccountSelectResponse(account,bank);
    }
}
