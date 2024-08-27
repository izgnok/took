package com.took.user_api.service.implement;


import com.took.user_api.dto.request.member.MemberSaveRequestDto;
import com.took.user_api.dto.response.member.MemberSaveResponseDto;
import com.took.user_api.entity.MemberEntity;
import com.took.user_api.entity.PartyEntity;
import com.took.user_api.entity.UserEntity;
import com.took.user_api.repository.MemberRepository;
import com.took.user_api.repository.PartyRepository;
import com.took.user_api.repository.UserRepository;
import com.took.user_api.repository.custom.BankRepositoryCustom;
import com.took.user_api.repository.custom.MemberRepositoryCustom;
import com.took.user_api.service.MemberService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final PartyRepository partyRepository;
    private final MemberRepository memberRepository;
    private final UserRepository userRepository;
    private final BankRepositoryCustom bankRepositoryCustom;
    private final MemberRepositoryCustom memberRepositoryCustom;


    @Override
    @Transactional
    public ResponseEntity<? super MemberSaveResponseDto> insertMember(MemberSaveRequestDto requestBody) {


        PartyEntity party = partyRepository.findById(requestBody.getPartySeq()).orElseThrow();
        UserEntity user = userRepository.findById(requestBody.getUserSeq()).orElseThrow();

//          정산 시작 전이므로 당연히 cost는 0에 해당
//          정산 시작 전으리므로 당연히 Status는 False
//          받는 사람을 누구로 할지 아예 안정했기 때문에 당연히 False
        MemberEntity member = MemberEntity.builder()
                .party(party)
                .user(user)
                .cost(0L)
                .status(false)
                .receive(false)
                .leader(false)
                .createdAt(LocalDateTime.now())
                .fakeCost(0L)
                .build();
        MemberEntity newMember = memberRepository.save(member);
        party.updateTotalMember(1);

        return MemberSaveResponseDto.success(newMember.getMemberSeq());
    }

    @Override
    @Transactional
    public ResponseEntity<? super MemberSaveResponseDto> deleteMember(MemberSaveRequestDto requestBody) {

        memberRepositoryCustom.deleteMemberByPartySeq(requestBody.getPartySeq(), requestBody.getUserSeq());
        PartyEntity party = partyRepository.findById(requestBody.getPartySeq()).orElseThrow();
        party.updateTotalMember(-1);

        return MemberSaveResponseDto.success();
    }
}
