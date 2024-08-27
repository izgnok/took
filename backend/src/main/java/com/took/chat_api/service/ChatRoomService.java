package com.took.chat_api.service;

import com.took.chat_api.dto.*;
import com.took.chat_api.entity.ChatRoom;
import com.took.chat_api.repository.ChatRoomRepository;
import com.took.user_api.entity.UserEntity;
import com.took.user_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor  // Lombok 어노테이션으로, final 필드에 대해 생성자를 자동으로 생성
@Service  // 이 클래스가 서비스 역할을 한다는 것을 Spring에게 알려주는 어노테이션
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;

    /**
     * 채팅방 생성
     * @param chatRoomCreateRequest 채팅방 생성 요청 DTO
     * @return 생성된 채팅방의 응답 DTO
     */
    @Transactional  // 트랜잭션 설정, 해당 메서드가 실행되는 동안 트랜잭션이 유지됨
    public ChatRoomCreateResponse createChatRoom(ChatRoomCreateRequest chatRoomCreateRequest) {
        UserEntity user = userRepository.findById(chatRoomCreateRequest.getUserSeq()).orElseThrow();  // 사용자 번호로 사용자 조회

        ChatRoom chatRoom = ChatRoom.builder()
                .roomTitle(chatRoomCreateRequest.getRoomTitle())
                .user(user)
                .category(chatRoomCreateRequest.getCategory())
                .createdAt(LocalDateTime.now())
                .status(true)
                .build();
        ChatRoom savedChatRoom = chatRoomRepository.save(chatRoom);  // 채팅방을 저장
        return new ChatRoomCreateResponse(savedChatRoom);  // ChatRoomCreateResponse로 변환하여 반환
    }

//    /**
//     * 모든 채팅방 조회
//     * @return 모든 채팅방 리스트
//     */
//    @Transactional(readOnly = true)  // 읽기 전용 트랜잭션 설정, 성능 향상
//    public List<ChatRoomByUserSelectResponse> findAllRooms() {
//        return chatRoomRepository.findAll().stream()
//                .map(ChatRoomByUserSelectResponse::new)  // ChatRoom 엔티티를 ChatRoomCreateResponse로 변환
//                .collect(Collectors.toList());  // 리스트로 변환하여 반환
//    }
//
//    /**
//     * 카테고리로 채팅방 조회
//     * @param category 조회할 카테고리
//     * @return 조회된 채팅방 리스트
//     */
//    @Transactional(readOnly = true)  // 읽기 전용 트랜잭션 설정, 성능 향상
//    public List<ChatRoomByUserSelectResponse> findRoomsByCategory(int category) {
//        return chatRoomRepository.findByCategory(category).stream()
//                .map(ChatRoomByUserSelectResponse::new)  // ChatRoom 엔티티를 ChatRoomCreateResponse로 변환
//                .collect(Collectors.toList());  // 리스트로 변환하여 반환
//    }

    /**
     * 카테고리와 사용자 번호 목록으로 채팅방 조회
     * @param chatRoomFilterRequest 필터링할 카테고리와 사용자 번호 목록을 담은 객체
     * @return 필터링된 채팅방 리스트
     */
    @Transactional(readOnly = true)  // 읽기 전용 트랜잭션 설정, 성능 향상
    public List<ChatRoomFilterResponse> findRoomsByCategoryAndUsers(ChatRoomFilterRequest chatRoomFilterRequest) {
        List<UserEntity> users = userRepository.findByUserSeqIn(chatRoomFilterRequest.getUserSeqs());

        List<ChatRoom> chatRooms = chatRoomRepository.findByCategoryAndUserIn(chatRoomFilterRequest.getCategory(), users);
        return chatRooms.stream()
                .map(ChatRoomFilterResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * 특정 채팅방 삭제
     * @param roomSeq 삭제할 채팅방의 고유 번호
     */
    @Transactional  // 트랜잭션 설정, 해당 메서드가 실행되는 동안 트랜잭션이 유지됨
    public void deleteChatRoom(Long roomSeq) {
        chatRoomRepository.deleteById(roomSeq);
    }
}
