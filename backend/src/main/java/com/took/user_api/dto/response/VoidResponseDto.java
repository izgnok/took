package com.took.user_api.dto.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class VoidResponseDto extends ResponseDto{

    private VoidResponseDto(){
        super();
    }

    public static ResponseEntity<VoidResponseDto> success() {
        VoidResponseDto responseBody = new VoidResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }
}
