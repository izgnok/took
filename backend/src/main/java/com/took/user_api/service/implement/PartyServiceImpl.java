package com.took.user_api.service.implement;


import com.took.chat_api.entity.ChatRoom;
import com.took.chat_api.repository.ChatRoomRepository;
import com.took.delivery_api.entity.Delivery;
import com.took.delivery_api.repository.DeliveryRepository;
import com.took.fcm_api.dto.AlarmRequest;
import com.took.fcm_api.dto.MessageRequest;
import com.took.fcm_api.entity.Alarm;
import com.took.fcm_api.repository.AlarmRepository;
import com.took.fcm_api.service.FCMService;
import com.took.shop_api.entity.Shop;
import com.took.shop_api.repository.ShopRepository;
import com.took.taxi_api.entity.Taxi;
import com.took.taxi_api.repository.TaxiRepository;
import com.took.user_api.dto.request.party.*;
import com.took.user_api.dto.response.ResponseDto;
import com.took.user_api.dto.response.VoidResponseDto;
import com.took.user_api.dto.response.party.*;
import com.took.user_api.entity.*;
import com.took.user_api.repository.*;
import com.took.user_api.repository.custom.MemberRepositoryCustom;
import com.took.user_api.service.PartyService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PartyServiceImpl implements PartyService {

    private final PartyRepository partyRepository;
    private final MemberRepositoryCustom memberRepositoryCustom;
    private final UserRepository userRepository;
    private final MemberRepository memberRepository;
    private final BankRepository bankRepository;
    private final FCMService fcmService;
    private final AccountRepository accountRepository;
    private final PayRepository payRepository;
    private final AlarmRepository alarmRepository;
    private final DeliveryRepository deliveryRepository;
    private final ShopRepository shopRepository;
    private final TaxiRepository taxiRepository;
    private final ChatRoomRepository chatRoomRepository;


    @Transactional
    @Override
    public ResponseEntity<? super MakePartyResponseDto> makeParty(MakePartyRequestDto dto) {

        PartyEntity party = PartyEntity.builder()
                .title(dto.getTitle())
                .category(dto.getCategory())
                .cost(0L)
                .status(false)
                .createdAt(LocalDateTime.now())
                .count(0)
                .totalMember(1)
                .receiveCost(0L)
                .build();

        PartyEntity newParty = partyRepository.save(party);
        UserEntity user = userRepository.findById(dto.getUserSeq()).orElseThrow();

//          일단 정산 전이기에 자신의 cost로 0으로 설정 // status (정산 여부도 설정)
        // 일단 맴버도 돈을 다 낸건 아니기 때문에!
        MemberEntity member = MemberEntity
                .builder()
                .party(newParty)
                .user(user)
                .cost(0L)
                .status(false)
                .receive(false)
                .leader(true)
                .createdAt(LocalDateTime.now())
                .fakeCost(0L)
                .build();
        MemberEntity newMember = memberRepository.save(member);

        return MakePartyResponseDto.success(newParty.getPartySeq(), newMember.getMemberSeq());
    }

    // 파티 상세 조회
    @Transactional
    @Override
    public ResponseEntity<? super PartyDetailResponseDto> partyDetail(Long partySeq) {
        PartyEntity party = partyRepository.findById(partySeq).orElseThrow();
        List<MemberEntity> partyDetailList = memberRepository.findByParty(party);
        return PartyDetailResponseDto.success(partyDetailList);
    }

    // 내가 참가 하고 있는 파티 리스트 조회
    @Transactional
    @Override
    public List<MyPartyListResponseDto> myPartyList(Long userSeq) {
        UserEntity user = userRepository.findById(userSeq).orElseThrow();
        List<MemberEntity> memberList = memberRepository.findByUser(user);

        // 멤버 리스트에서 partySeq를 추출하여 PartyEntity 리스트를 만듭니다.
        List<Long> partySeqList = memberList.stream()
                .map(member -> member.getParty().getPartySeq())
                .collect(Collectors.toList());
        List<PartyEntity> partyList = partyRepository.findByPartySeqIn(partySeqList);

        // PartyEntity 리스트를 MyPartyListResponseDto 리스트로 변환합니다.
        return partyList.stream()
                .map(MyPartyListResponseDto::new)
                .collect(Collectors.toList());
    }

    // 파티 삭제
    @Transactional
    @Override
    public ResponseEntity<?> partyDelete(Long partySeq) {
        partyRepository.deleteById(partySeq);
        return null;
    }

    // 파티 정산
    @Transactional
    @Override
    public ResponseEntity<? super VoidResponseDto> insertAllMember(InsertAllMemberRequestDto requestBody) {

        PartyEntity party = partyRepository.findById(requestBody.getPartySeq()).orElseThrow();
        int cate = party.getCategory();

        Long leaderSeq = memberRepositoryCustom.findLeaderByPartySeq(party.getPartySeq());
        UserEntity leader = userRepository.findById(leaderSeq).orElseThrow();
        String name = leader.getUserName();
        Long TotalDeliveryTip = requestBody.getDeliveryTip();
        long deliveryTip = 0L;
        int totalMember = requestBody.getUserCosts().size();

        if (TotalDeliveryTip != null) {
            party.updateDeliveryTip(TotalDeliveryTip);
            deliveryTip = TotalDeliveryTip / totalMember;
            if (TotalDeliveryTip % totalMember != 0) {
                deliveryTip += 1; // 나머지가 있을 경우 deliveryTip을 +1
            }
        }

        long totalCost = 0L;
        for (InsertAllMemberRequestDto.userCost userCost : requestBody.getUserCosts()) {
            long cost = userCost.getCost() + deliveryTip;
            totalCost += cost;

            if (userCost.getUserSeq().equals(leaderSeq)) { // 결제자는 이미 디비에 추가되어있으니, COST만 업데이트
                MemberEntity leaderMember = memberRepository.findByPartyAndLeaderTrue(party);
                leaderMember.updateCost(userCost.getCost());
                continue;
            }

            UserEntity user = userRepository.findById(userCost.getUserSeq()).orElseThrow();
            MemberEntity member = MemberEntity.builder()
                    .party(party)
                    .user(user)
                    .cost(cost)
                    .status(false)
                    .receive(false)
                    .leader(false)
                    .createdAt(LocalDateTime.now())
                    .fakeCost(0L)
                    .build();
            memberRepository.save(member);

            AlarmRequest alarm = new AlarmRequest();
            String maskedName;
            if (name.length() == 2) {
                maskedName = name.charAt(0) + "*";
            } else if (name.length() == 3) {
                maskedName = name.charAt(0) + "*" + name.charAt(2);
            } else if (name.length() == 4) {
                maskedName = name.charAt(0) + "**" + name.charAt(name.length() - 1);
            } else {
                maskedName = name; // 이름이 1글자인 경우 그대로 사용
            }
            alarm.setBody(maskedName + "님에게 " + cost + "원 took!!");
            alarm.setSender(leaderSeq);
            alarm.setUserSeq(userCost.getUserSeq());
            alarm.setPartySeq(party.getPartySeq());

            if (party.getDeliveryTip() != null) {
                alarm.setDeliveryCost(deliveryTip);
                alarm.setCost(cost);
            }

//              배달
            if (cate == 1) {
                alarm.setTitle("배달 took 정산 요청이 왔어요!");
                alarm.setCategory(1);

//              택시
            } else if (cate == 2) {
                alarm.setTitle("택시 took 정산 요청이 왔어요!");
                alarm.setCategory(2);

//               공동구매
            } else if (cate == 3) {
                alarm.setTitle("공동구매 took 정산 요청이 왔어요!");
                alarm.setCategory(3);

//               더치페이
            } else if (cate == 4) {
                alarm.setTitle("정산 took 정산 요청이 왔어요!");
                alarm.setCategory(4);
//                  정산이니까 엔빵
                alarm.setCost(userCost.getCost());
            }
            fcmService.sendNotification(alarm);
        }
        party.updateCost(totalCost);
        party.updateTotalMember(totalMember);
        return VoidResponseDto.success();
    }

    //   게스트들이 송금 버튼을 눌렀을 때
    @Override
    @Transactional
    public ResponseEntity<? super ojResponseDto> onlyjungsanPay(OnlyJungsanRequestDto requestBody) {

        boolean done = false;

        PartyEntity party = partyRepository.findById(requestBody.getPartySeq()).orElseThrow();
        UserEntity user = userRepository.findById(requestBody.getUserSeq()).orElseThrow();
        AccountEntity account = accountRepository.findById(requestBody.getAccountSeq()).orElseThrow();
        MemberEntity member = memberRepository.findByPartyAndUser(party, user);

        Long memberCost = member.getCost();

//          빼주기 전에 돈 있는 없는지 검사
        BankEntity bank = bankRepository.getReferenceById(account.getBank().getBankSeq());
        long balance = bank.getBalance();

        if (balance < memberCost) {
            fcmService.sendMessage(
                    MessageRequest.builder()
                            .title("송금 알림")
                            .body("돈이 부족합니다. 잔액을 확인해주세요!")
                            .userSeqList(List.of(requestBody.getUserSeq()))
                            .build()
            );
            return ResponseDto.nomoney();
        }

//          맴버 상태 업데이트
        member.updateStatus(true);
        party.updateCount(1);


//          돈빼주고 저장
        bank.updateBalance(balance - memberCost);


//        돈이 빠져나갔으니 해당 알림의 상태는 true
        List<Alarm> alarm = alarmRepository.findByUserSeqAndPartySeq(requestBody.getUserSeq(), requestBody.getPartySeq());
        for (Alarm a : alarm) {
            a.updateStatus(true);
        }


//          빼주는 순간 리더에게 돈 들어가게
        Long leaderSeq = memberRepositoryCustom.findLeaderByPartySeq(requestBody.getPartySeq());
        UserEntity leader = userRepository.findById(leaderSeq).orElseThrow();
        AccountEntity leaderAccount = accountRepository.findByUserAndMainTrue(leader);
        BankEntity leaderBankEntity = bankRepository.findById(leaderAccount.getBank().getBankSeq()).orElseThrow();
        balance = leaderBankEntity.getBalance() + memberCost;
        leaderBankEntity.updateBalance(balance);

        // 거래 내역 저장 ( 송금 )
        PayEntity pay1 = PayEntity.builder()
                .user(user)
                .targetUserSeq(leaderSeq)
                .account(account)
                .createdAt(LocalDateTime.now())
                .cost(memberCost)
                .receive(false)
                .category(4)
                .build();
        payRepository.save(pay1);
        // 거래 내역 저장 ( 입금 )
        PayEntity pay2 = PayEntity.builder()
                .user(leader)
                .targetUserSeq(user.getUserSeq())
                .account(leaderAccount)
                .createdAt(LocalDateTime.now())
                .cost(memberCost)
                .receive(true)
                .category(4)
                .build();
        payRepository.save(pay2);
        String maskedName = user.getUserName();
        if (maskedName.length() == 2) {
            maskedName = maskedName.charAt(0) + "*";
        } else if (maskedName.length() == 3) {
            maskedName = maskedName.charAt(0) + "*" + maskedName.charAt(2);
        } else if (maskedName.length() == 4) {
            maskedName = maskedName.charAt(0) + "**" + maskedName.charAt(maskedName.length() - 1);
        }
        fcmService.sendMessage(
                MessageRequest.builder()
                        .title("송금 알림")
                        .body(maskedName + "님이 " + memberCost + "원을 송금하였습니다!")
                        .userSeqList(List.of(leaderSeq))
                        .build()
        );


//       정산이 끝낫을 경우

        if (party.getCount() == party.getTotalMember() - 1) {
            done = true;
            party.updateStatus(true);

            fcmService.sendMessage(
                    MessageRequest.builder()
                            .title("'" + party.getTitle() + "' 정산 알림")
                            .body("정산이 완료되었습니다!")
                            .userSeqList(List.of(leaderSeq))
                            .build()
            );
        }
        return ojResponseDto.success(done);
    }


    // 배달, 공구 결제
    @Transactional
    @Override
    public ResponseEntity<? super ojResponseDto> deligonguPay(OnlyJungsanRequestDto requestBody) {

        PartyEntity party = partyRepository.findById(requestBody.getPartySeq()).orElseThrow();
        UserEntity user = userRepository.findById(requestBody.getUserSeq()).orElseThrow();
        MemberEntity member = memberRepository.findByPartyAndUser(party, user);


        //빼주기 전에 돈 있는 없는지 검사
        AccountEntity account = accountRepository.findById(requestBody.getAccountSeq()).orElseThrow();
        BankEntity bank = bankRepository.findById(account.getBank().getBankSeq()).orElseThrow();

        Long balance = bank.getBalance();
        Long membercost = member.getCost();

        if (balance < membercost) {
            fcmService.sendMessage(
                    MessageRequest.builder()
                            .title("결제 알림")
                            .body("돈이 부족합니다. 잔액을 확인해주세요!")
                            .userSeqList(List.of(requestBody.getUserSeq()))
                            .build()
            );
            return ResponseDto.nomoney();
        }
        bank.updateBalance(balance - membercost);
        member.updateStatus(true);
        //        돈이 빠져나갔으니 해당 알림의 상태는 true
        List<Alarm> alarm = alarmRepository.findByUserSeqAndPartySeq(requestBody.getUserSeq(), requestBody.getPartySeq());
        for (Alarm a : alarm) {
            a.updateStatus(true);
        }

        party.updateReceiveCost(party.getReceiveCost() + membercost);
        party.updateCount(party.getCount() + 1);

        // 결제 내역 업데이트 ( 입금 )
        PayEntity pay = PayEntity.builder()
                .user(user)
                .targetUserSeq(null)
                .account(account)
                .createdAt(LocalDateTime.now())
                .cost(membercost)
                .receive(false)
                .category(party.getCategory())
                .build();
        payRepository.save(pay);

        // 모든 사람이 결제 완료 (결제자제외)
        if (party.getCount() == party.getTotalMember() - 1) {
            Long leaderSeq = memberRepositoryCustom.findLeaderByPartySeq(party.getPartySeq());
            fcmService.sendMessage(
                    MessageRequest.builder()
                            .title("'" + party.getTitle() + "' 모든 사람이 입금 완료!")
                            .body("주문을 진행해 주세요")
                            .userSeqList(List.of(leaderSeq))
                            .build()
            );
            return ojResponseDto.success(true);
        }
        return ojResponseDto.success(false);
    }

    // 중간계좌에서 호스트계좌로 이동
    @Transactional
    @Override
    public void deligonguHostRecieve(Long partySeq, Long userSeq) {

        PartyEntity party = partyRepository.findById(partySeq).orElseThrow();
        Long receiveCost = party.getReceiveCost();
        UserEntity user = userRepository.findById(userSeq).orElseThrow();
        AccountEntity account = accountRepository.findByUserAndMainTrue(user);
        BankEntity bank = bankRepository.findById(account.getBank().getBankSeq()).orElseThrow();
        Long balance = bank.getBalance();
        bank.updateBalance(receiveCost + balance);
        party.updateStatus(true);
        party.updateReceiveCost(0L);

        // 거래 내역 저장 ( 입금 )
        PayEntity pay = PayEntity.builder()
                .user(user)
                .targetUserSeq(null)
                .account(account)
                .createdAt(LocalDateTime.now())
                .cost(receiveCost)
                .receive(true)
                .category(party.getCategory())
                .build();
        payRepository.save(pay);

        // 알림 생성
        fcmService.sendMessage(
                MessageRequest.builder()
                        .title("'" + party.getTitle() + "' 정산 완료")
                        .body(receiveCost + "원이 정산 되었습니다.")
                        .userSeqList(List.of(userSeq))
                        .build()
        );

        // 배달or 공구 상태 DONE으로 변경
        if (party.getCategory() == 1) {
            Delivery delivery = deliveryRepository.findByPartySeq(partySeq);
            delivery.updateStatus(String.valueOf(Delivery.Status.DONE));
            ChatRoom chatRoom = chatRoomRepository.findById(delivery.getRoomSeq()).orElseThrow();
            chatRoom.updateStaus(false);
        } else if (party.getCategory() == 3) {
            Shop shop = shopRepository.findByPartySeq(partySeq);
            shop.updateStatus(Shop.statusType.COMPLETED);
            ChatRoom chatRoom = chatRoomRepository.findById(shop.getRoomSeq()).orElseThrow();
            chatRoom.updateStaus(false);
        }
    }

    // 택시 정산 생성 및 가결제
    @Transactional
    @Override
    public Long makeTaxiParty(MakeTaxiPartyRequest requestBody) {
        PartyEntity party = PartyEntity.builder()
                .title(requestBody.getTitle())
                .category(requestBody.getCategory())
                .cost(requestBody.getCost())
                .status(false)
                .createdAt(LocalDateTime.now())
                .count(requestBody.getUsers().size())
                .receiveCost(0L)
                .totalMember(requestBody.getUsers().size())
                .build();
        PartyEntity newParty = partyRepository.save(party);
        Taxi taxi = taxiRepository.findById(requestBody.getTaxiSeq()).orElseThrow();
        taxi.updateStart(requestBody.getStartLat(), requestBody.getStartLon());
        taxi.updateParty(newParty.getPartySeq());

        long receiveCost = 0L;
        boolean success = true;

        for (MakeTaxiPartyRequest.User user : requestBody.getUsers()) {
            boolean check = user.getUserSeq().equals(requestBody.getMaster());
            UserEntity userEntity = userRepository.findById(user.getUserSeq()).orElseThrow();
            AccountEntity account = accountRepository.findByUserAndMainTrue(userEntity);
            long fakeCost = 0L;

            if (!check) {
                // 가결제
                BankEntity bank = bankRepository.findById(account.getBank().getBankSeq()).orElseThrow();

                fakeCost = user.getFakeCost();
                long balance = bank.getBalance() - fakeCost;
                receiveCost += fakeCost;

                if (balance >= 0) {
                    bank.updateBalance(balance);
                } else {
                    success = false;
                    fcmService.sendMessage(
                            MessageRequest.builder()
                                    .title("택시 결제 알림")
                                    .body("돈이 부족합니다. 잔액을 확인해주세요!")
                                    .userSeqList(List.of(user.getUserSeq()))
                                    .build());
                }
            }
            if (!success) {
                // 예외처리
                throw new RuntimeException("결제 실패로 인해 트랜잭션을 롤백합니다.");
            }

            // member DB 추가
            MemberEntity member = MemberEntity.builder()
                    .party(newParty)
                    .user(userEntity)
                    .cost(0L)
                    .status(false)
                    .receive(false)
                    .leader(check)
                    .createdAt(LocalDateTime.now())
                    .fakeCost(fakeCost)
                    .build();
            memberRepository.save(member);

            // 거래 내역 추가
            PayEntity pay = PayEntity.builder()
                    .user(userEntity)
                    .targetUserSeq(null)
                    .account(account)
                    .createdAt(LocalDateTime.now())
                    .cost(fakeCost)
                    .receive(false)
                    .category(2)
                    .build();
            payRepository.save(pay);
        }
        newParty.updateReceiveCost(receiveCost);

        // 여기다 알림 추가 ( ~~원 가결제 완료, 반복문(리더제외) )
        for (MakeTaxiPartyRequest.User user : requestBody.getUsers()) {
            if (user.getUserSeq().equals(requestBody.getMaster())) continue;
            fcmService.sendMessage(
                    MessageRequest.builder()
                            .title("택시 결제 알림")
                            .body(user.getFakeCost() + "원이 결제 되었습니다.")
                            .userSeqList(List.of(user.getUserSeq()))
                            .build());
        }
        return newParty.getPartySeq();
    }

    // 택시 실결제
    @Transactional
    @Override
    public void finalTaxiParty(FinalTaxiPartyRequest requestBody) {
        PartyEntity party = partyRepository.findById(requestBody.getPartySeq()).orElseThrow();
        party.updateCost(requestBody.getCost());

        long receiveCost = party.getReceiveCost();

        boolean check = true;
        int count = 0;
        MemberEntity leaderMember = memberRepository.findByPartyAndLeaderTrue(party);
        UserEntity leader = userRepository.findById(leaderMember.getUser().getUserSeq()).orElseThrow();

        for (FinalTaxiPartyRequest.User user : requestBody.getUsers()) {
            UserEntity userEntity = userRepository.findById(user.getUserSeq()).orElseThrow();
            MemberEntity member = memberRepository.findByPartyAndUser(party, userEntity);
            if (member.isLeader()) {
                member.updateCost(user.getCost());
                continue; // 결제자는 패스
            }

            member.updateCost(user.getCost());
            long fakecost = member.getFakeCost();

            AccountEntity account = accountRepository.findByUserAndMainTrue(userEntity);
            BankEntity bank = bankRepository.findById(account.getBank().getBankSeq()).orElseThrow();
            long exchange = fakecost - user.getCost();

            if (exchange < 0) {
                exchange = Math.abs(exchange);
                member.updateRestCost(exchange);
                check = false;

                fcmService.sendNotification(
                        AlarmRequest.builder()
                                .title("택시 결제 알림")
                                .body(exchange + "원을 추가 송금 해주세요!")
                                .sender(leader.getUserSeq())
                                .userSeq(user.getUserSeq())
                                .partySeq(requestBody.getPartySeq())
                                .category(2)
                                .preCost(fakecost)
                                .actualCost(user.getCost())
                                .differenceCost(exchange)
                                .cost(exchange)
                                .build()
                );
            } else if (exchange == 0) {
                member.updateStatus(true);
                count++;
                fcmService.sendMessage(
                        MessageRequest.builder()
                                .title("'" + party.getTitle() + "' 택시 탑승 완료")
                                .body("택시 탑승이 완료 되었습니다.")
                                .userSeqList(List.of(user.getUserSeq()))
                                .build()
                );
            } else {
                long balance = bank.getBalance() + exchange;
                bank.updateBalance(balance);
                member.updateStatus(true);
                count++;

                // 결제 내역 추가 (입금)
                PayEntity pay = PayEntity.builder()
                        .user(userEntity)
                        .targetUserSeq(null)
                        .account(account)
                        .createdAt(LocalDateTime.now())
                        .cost(exchange)
                        .receive(true)
                        .category(2)
                        .build();
                payRepository.save(pay);

                // 결제 내역 추가 (송금 )
                PayEntity pay2 = PayEntity.builder()
                        .user(leader)
                        .targetUserSeq(userEntity.getUserSeq())
                        .account(accountRepository.findByUserAndMainTrue(leader))
                        .createdAt(LocalDateTime.now())
                        .cost(exchange)
                        .receive(false)
                        .category(2)
                        .build();
                payRepository.save(pay2);

                fcmService.sendMessage(
                        MessageRequest.builder()
                                .title("택시 결제 알림")
                                .body(exchange + "원이 반환 되었습니다.")
                                .userSeqList(List.of(user.getUserSeq()))
                                .build()
                );
            }
        }
        party.updateCount(count); // 정산 완료된 인원 수


        AccountEntity account = accountRepository.findByUserAndMainTrue(leader);
        BankEntity bank = bankRepository.findById(account.getBank().getBankSeq()).orElseThrow();
        long balance = bank.getBalance() + receiveCost;
        bank.updateBalance(balance);
        party.updateStatus(check);
        party.updateReceiveCost(0L);

        // 결제 내역 추가  (입금)
        PayEntity pay = PayEntity.builder()
                .user(leader)
                .targetUserSeq(null)
                .account(account)
                .createdAt(LocalDateTime.now())
                .cost(receiveCost)
                .receive(true)
                .category(2)
                .build();
        payRepository.save(pay);

        if (count == party.getTotalMember() - 1) {
            Taxi taxi = taxiRepository.findByPartySeq(requestBody.getPartySeq());
            taxi.updateStatus(Taxi.Status.DONE);
            taxiRepository.delete(taxi);
            ChatRoom chatRoom = chatRoomRepository.findById(taxi.getRoomSeq()).orElseThrow();
            chatRoom.updateStaus(false);
            fcmService.sendMessage(
                    MessageRequest.builder()
                            .title("택시 결제 알림")
                            .body("정산이 완료되었습니다!")
                            .userSeqList(List.of(leader.getUserSeq()))
                            .build()
            );
        } else {
            fcmService.sendMessage(
                    MessageRequest.builder()
                            .title("택시 결제 알림")
                            .body(receiveCost + "원이 입금 되었습니다. 추가 정산 필요!")
                            .userSeqList(List.of(leader.getUserSeq()))
                            .build()
            );
        }
    }

    // 택시 잔돈 정산
    @Transactional
    @Override
    public ResponseEntity<? super ojResponseDto> restCostPay(OnlyJungsanRequestDto requestBody) {
        PartyEntity party = partyRepository.findById(requestBody.getPartySeq()).orElseThrow();
        UserEntity user = userRepository.findById(requestBody.getUserSeq()).orElseThrow();
        MemberEntity member = memberRepository.findByPartyAndUser(party, user);

        AccountEntity account = accountRepository.findById(requestBody.getAccountSeq()).orElseThrow();
        BankEntity bank = bankRepository.findById(account.getBank().getBankSeq()).orElseThrow();

        long balance = bank.getBalance();
        long restCost = member.getRestCost();
        boolean done = false;

        if (balance < restCost) {
            fcmService.sendMessage(
                    MessageRequest.builder()
                            .title("택시 결제 알림")
                            .body("돈이 부족합니다. 잔액을 확인해주세요!")
                            .userSeqList(List.of(requestBody.getUserSeq()))
                            .build()
            );
            return ResponseDto.nomoney();
        }

        member.updateRestCost(0L);
        member.updateStatus(true);
        bank.updateBalance(balance - restCost);
        party.updateCount(1);

        List<Alarm> alarm = alarmRepository.findByUserSeqAndPartySeq(requestBody.getUserSeq(), requestBody.getPartySeq());
        for (Alarm a : alarm) {
            a.updateStatus(true);
        }

        // 리더에게 송금
        MemberEntity leaderMember = memberRepository.findByPartyAndLeaderTrue(party);
        UserEntity leader = userRepository.findById(leaderMember.getUser().getUserSeq()).orElseThrow();
        AccountEntity leaderAccount = accountRepository.findByUserAndMainTrue(leader);
        BankEntity leaderBank = bankRepository.findById(leaderAccount.getBank().getBankSeq()).orElseThrow();
        long leaderBalance = leaderBank.getBalance() + restCost;
        leaderBank.updateBalance(leaderBalance);
        // 입금 알림
        String maskedName = user.getUserName();
        if (maskedName.length() == 2) {
            maskedName = maskedName.charAt(0) + "*";
        } else if (maskedName.length() == 3) {
            maskedName = maskedName.charAt(0) + "*" + maskedName.charAt(2);
        } else if (maskedName.length() == 4) {
            maskedName = maskedName.charAt(0) + "**" + maskedName.charAt(maskedName.length() - 1);
        }
        fcmService.sendMessage(
                MessageRequest.builder()
                        .title("송금 알림")
                        .body(maskedName + "님이 " + restCost + "원을 송금하였습니다!")
                        .userSeqList(List.of(leader.getUserSeq()))
                        .build()
        );

        // 거래 내역 저장 (송금 )
        PayEntity pay1 = PayEntity.builder()
                .user(user)
                .targetUserSeq(leader.getUserSeq())
                .account(account)
                .createdAt(LocalDateTime.now())
                .cost(restCost)
                .receive(false)
                .category(4)
                .build();
        payRepository.save(pay1);

        // 거래 내역 저장 ( 입금 )
        PayEntity pay2 = PayEntity.builder()
                .user(leader)
                .targetUserSeq(user.getUserSeq())
                .account(leaderAccount)
                .createdAt(LocalDateTime.now())
                .cost(restCost)
                .receive(true)
                .category(4)
                .build();
        payRepository.save(pay2);

        // 정산 완료 여부 확인
        if (party.getCount() == party.getTotalMember() - 1) {
            party.updateStatus(true);
            done = true;

            Taxi taxi = taxiRepository.findByPartySeq(requestBody.getPartySeq());
            taxi.updateStatus(Taxi.Status.DONE);
            taxiRepository.delete(taxi);
            ChatRoom chatRoom = chatRoomRepository.findById(taxi.getRoomSeq()).orElseThrow();
            chatRoom.updateStaus(false);

            fcmService.sendMessage(
                    MessageRequest.builder()
                            .title("'" + party.getTitle() + "' 정산 알림")
                            .body("정산이 완료되었습니다!")
                            .userSeqList(List.of(leader.getUserSeq()))
                            .build()
            );
        }
        return ojResponseDto.success(done);
    }

    // 개인 거래 내역 목록 조회
    @Transactional
    @Override
    public List<PayHistoryResponseDto> payHistory(Long userSeq) {
        UserEntity user = userRepository.findById(userSeq).orElseThrow();
        List<PayEntity> payList = payRepository.findByUserOrderByCreatedAtDesc(user);
        List<PayHistoryResponseDto> responseList = new ArrayList<>();
        for (PayEntity pay : payList) {
            BankEntity bank = bankRepository.findById(pay.getAccount().getBank().getBankSeq()).orElseThrow();
            String accountNum = bank.getAccountNum();
            String maskedAccountNum = accountNum.substring(accountNum.length() - 4);
            String maskedUserName;
            int imageNo;

            if (pay.getCategory() == 1) {
                maskedUserName = "배달 took";
                imageNo = 31;
            } else if (pay.getCategory() == 2) {
                maskedUserName = "택시 took";
                imageNo = 32;
            } else if (pay.getCategory() == 3) {
                maskedUserName = "공구 took";
                imageNo = 33;
            } else {
                UserEntity userEntity = userRepository.findById(pay.getTargetUserSeq()).orElseThrow();
                String userName = userEntity.getUserName();
                imageNo = userEntity.getImageNo();
                if (userName.length() == 2) {
                    maskedUserName = userName.charAt(0) + "*";
                } else if (userName.length() == 3) {
                    maskedUserName = userName.charAt(0) + "*" + userName.charAt(2);
                } else if (userName.length() == 4) {
                    maskedUserName = userName.charAt(0) + "**" + userName.charAt(userName.length() - 1);
                } else {
                    maskedUserName = userName; // 1글자일 경우 그대로 사용
                }
            }
            responseList.add(new PayHistoryResponseDto(
                    pay.getPaySeq(),
                    maskedUserName,
                    imageNo,
                    pay.getCost(),
                    pay.isReceive(),
                    pay.getCreatedAt(),
                    pay.getAccount().getBank().getBankNum(),
                    maskedAccountNum
            ));
        }
        return responseList;
    }

    // 미정산 목록 반환
    @Transactional
    @Override
    public List<NoPayResponseDto> noPayList(Long userSeq) {
        UserEntity user = userRepository.findById(userSeq).orElseThrow();
        List<MemberEntity> memberList = memberRepositoryCustom.findNoLeaderAndNoStatusByUser(user);
        List<NoPayResponseDto> responseList = new ArrayList<>();

        for (MemberEntity member : memberList) {
            PartyEntity party = partyRepository.findById(member.getParty().getPartySeq()).orElseThrow();
            MemberEntity leader = memberRepository.findByPartyAndLeaderTrue(party);
            UserEntity leaderUser = userRepository.findById(leader.getUser().getUserSeq()).orElseThrow();

            String maskedName = leaderUser.getUserName();
            if (maskedName.length() == 2) {
                maskedName = maskedName.charAt(0) + "*";
            } else if (maskedName.length() == 3) {
                maskedName = maskedName.charAt(0) + "*" + maskedName.charAt(2);
            } else if (maskedName.length() == 4) {
                maskedName = maskedName.charAt(0) + "**" + maskedName.charAt(maskedName.length() - 1);
            }

            Long cost = member.getCost();
            if(party.getCategory() == 2) {
                cost = member.getRestCost();
            }
            responseList.add(
                    new NoPayResponseDto(
                            party.getPartySeq(),
                            leaderUser.getUserSeq(),
                            maskedName,
                            leaderUser.getImageNo(),
                            cost,
                            party.getCategory(),
                            party.getCreatedAt()
                    )
            );
        }
        return responseList;
    }
}
