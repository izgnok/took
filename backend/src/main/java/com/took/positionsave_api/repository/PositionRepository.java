package com.took.positionsave_api.repository;


import com.took.positionsave_api.entity.Position;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface PositionRepository extends CrudRepository<Position, String> {
    // 추가적인 메서드가 필요한 경우 여기에 정의할 수 있습니다.
    // Long 타입의 userSeq를 사용하여 Position을 찾는 메서드 정의
    Optional<Position> findByUserSeq(String userSeq);
}