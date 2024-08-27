package com.took.chat_api.controller;

import com.took.chat_api.dto.*;
import com.took.chat_api.service.ChatMessageService;
import com.took.chat_api.service.ChatRoomService;
import com.took.chat_api.service.ChatUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/chat")
@Tag(name = "ChatController", description = "채팅 관련 API")
public class ChatController {

    private final ChatRoomService chatRoomService;
    private final ChatUserService chatUserService;
    private final ChatMessageService chatMessageService;
    private final SimpMessageSendingOperations messagingTemplate;

    @Operation(summary = "채팅방 생성", description = "새로운 채팅방을 생성합니다.")
    @PostMapping("/room")
    public ResponseEntity<ChatRoomCreateResponse> createRoom(
            @RequestBody @Parameter(description = "채팅방 생성 요청 정보", required = true) ChatRoomCreateRequest chatRoomCreateRequest) {
        ChatRoomCreateResponse createdRoom = chatRoomService.createChatRoom(chatRoomCreateRequest);
        messagingTemplate.convertAndSend("/sub/chat/rooms", createdRoom);
        return ResponseEntity.ok(createdRoom);
    }

//    @Operation(summary = "모든 채팅방 조회", description = "모든 채팅방의 정보를 조회합니다.")
//    @GetMapping("/rooms")
//    public ResponseEntity<List<ChatRoomByUserSelectResponse>> getAllRooms() {
//        List<ChatRoomByUserSelectResponse> rooms = chatRoomService.findAllRooms();
//        return ResponseEntity.ok(rooms);
//    }
//
//    @Operation(summary = "특정 카테고리의 채팅방 조회", description = "특정 카테고리의 채팅방을 조회합니다.")
//    @GetMapping("/room/{category}")
//    public ResponseEntity<List<ChatRoomByUserSelectResponse>> getRoom(
//            @PathVariable @Parameter(description = "조회할 카테고리", required = true) int category) {
//        List<ChatRoomByUserSelectResponse> room = chatRoomService.findRoomsByCategory(category);
//        return ResponseEntity.ok(room);
//    }

    @Operation(summary = "특정 카테고리와 사용자의 채팅방 조회", description = "특정 카테고리와 사용자가 만든 채팅방을 조회합니다.")
    @PostMapping("/rooms/filter")
    public ResponseEntity<List<ChatRoomFilterResponse>> filterRoomsByCategoryAndUsers(
            @RequestBody @Parameter(description = "필터링할 카테고리와 사용자 번호 목록", required = true) ChatRoomFilterRequest chatRoomFilterRequest) {
        List<ChatRoomFilterResponse> filteredRooms = chatRoomService.findRoomsByCategoryAndUsers(chatRoomFilterRequest);
        return ResponseEntity.ok(filteredRooms);
    }

    @Operation(summary = "채팅방에 속한 유저 조회", description = "특정 채팅방에 속한 유저를 조회합니다.")
    @GetMapping("/users/{roomSeq}")
    public ResponseEntity<List<ChatUserSelectResponse>> getUser(
            @PathVariable @Parameter(description = "조회할 채팅방", required = true) Long roomSeq) {
        List<ChatUserSelectResponse> users = chatUserService.findUserByRoom(roomSeq);
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "유저 채팅방 입장 처리", description = "유저가 채팅방에 입장할 때 처리하는 메서드입니다.")
    @MessageMapping("/room/enter")
    public void enterRoom(
            @RequestBody @Parameter(description = "유저의 방 입장 요청 정보", required = true) ChatUserCreateRequest chatUserCreateRequest) {
        if (chatUserService.checkChatUser(chatUserCreateRequest)) {
            joinRoom(chatUserCreateRequest);
            messagingTemplate.convertAndSend("/sub/chat/room/" + chatUserCreateRequest.getRoomSeq(),
                    chatUserCreateRequest.getUserSeq() + " has entered the room.");
        }
    }

    public ResponseEntity<?> joinRoom(ChatUserCreateRequest chatUserCreateRequest) {
        chatUserService.enterChatRoom(chatUserCreateRequest);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "유저 채팅방 퇴장 처리", description = "유저가 채팅방에서 퇴장할 때 처리하는 메서드입니다.")
    @MessageMapping("/room/leave")
    public void leaveRoom(
            @RequestBody @Parameter(description = "유저의 방 퇴장 요청 정보", required = true) ChatUserDeleteRequest chatUserDeleteRequest) {
        chatUserService.leaveChatRoom(chatUserDeleteRequest);
        messagingTemplate.convertAndSend("/sub/chat/room/" + chatUserDeleteRequest.getRoomSeq(),
                chatUserDeleteRequest.getUserSeq() + " has left the room.");
    }

    @Operation(summary = "특정 멤버 채팅방에서 내보내기", description = "특정 멤버를 채팅방에서 내보내는 메서드입니다.")
    @MessageMapping("/room/kick")
    public void kickUser(
            @RequestBody @Parameter(description = "유저의 방 퇴장 요청 정보", required = true) ChatUserDeleteRequest chatUserDeleteRequest) {
        chatUserService.kickUserFromRoom(chatUserDeleteRequest);
        messagingTemplate.convertAndSend("/sub/chat/room/" + chatUserDeleteRequest.getRoomSeq(),
                chatUserDeleteRequest.getUserSeq() + " has left the room.");
    }

    @Operation(summary = "채팅방 삭제", description = "채팅방을 삭제합니다.")
    @DeleteMapping("/room/{roomSeq}")
    public ResponseEntity<?> deleteRoom(
            @PathVariable @Parameter(description = "삭제할 채팅방의 고유 번호", required = true) Long roomSeq) {
        chatRoomService.deleteChatRoom(roomSeq);
        messagingTemplate.convertAndSend("/sub/chat/rooms", roomSeq + " 채팅방이 삭제되었습니다.");
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "메시지 전송", description = "채팅방에 메시지를 전송합니다.")
    @MessageMapping("/message/send")
    public void sendMessage(
            @RequestBody @Parameter(description = "메시지 생성 요청 정보", required = true) ChatMessageCreateRequest chatMessageCreateRequest) {
        ChatMessageCreateResponse savedMessage = chatMessageService.saveMessage(chatMessageCreateRequest);
        messagingTemplate.convertAndSend("/sub/chat/room/" + savedMessage.getRoomSeq(), savedMessage);
    }

    @Operation(summary = "채팅방의 모든 메시지 조회", description = "특정 채팅방의 모든 메시지를 조회합니다.")
    @PostMapping("/message/list")
    public ResponseEntity<List<ChatMessageSelectResponse>> getMessages(
            @RequestBody @Parameter(description = "조회할 채팅방의 해당 유저의 참가시간과 메시지 생성 시간", required = true) ChatMessageSelectRequest chatMessageSelectRequest) {
        List<ChatMessageSelectResponse> messages = chatMessageService.findMessagesByRoomSeq(chatMessageSelectRequest);
        return ResponseEntity.ok(messages);
    }

    @Operation(summary = "해당 유저가 채팅방 목록 조회", description = "특정 유저의 모든 채팅방을 조회합니다.")
    @GetMapping("/rooms/{userSeq}")
    public ResponseEntity<List<ChatRoomByUserSelectResponse>> getRoomsByUser(
            @PathVariable @Parameter(description = "조회할 유저의 고유 번호", required = true) Long userSeq) {
        List<ChatRoomByUserSelectResponse> rooms = chatUserService.findRoomsByUser(userSeq);
        return ResponseEntity.ok(rooms);
    }
}
