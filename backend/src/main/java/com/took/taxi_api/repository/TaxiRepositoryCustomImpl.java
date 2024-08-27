package com.took.taxi_api.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.took.taxi_api.entity.QTaxi;
import com.took.taxi_api.entity.Taxi;
import com.took.user_api.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository  // 이 클래스가 Spring의 Repository 빈으로 등록됨을 나타냅니다.
@RequiredArgsConstructor  // Lombok을 사용하여 모든 final 필드를 매개변수로 가지는 생성자를 자동으로 생성합니다.
public class TaxiRepositoryCustomImpl implements TaxiRepositoryCustom {

    private final JPAQueryFactory queryFactory;  // JPAQueryFactory를 통해 데이터베이스 작업을 처리합니다.

    /**
     * 특정 사용자들의 택시 목록을 조회합니다.
     * @param users 사용자 번호 리스트
     * @return 사용자들의 택시 목록
     */
    @Override
    public List<Taxi> findTaxisByUsers(List<UserEntity> users) {
        QTaxi taxi = QTaxi.taxi;

        // 사용자 ID 리스트를 추출
        List<Long> userSeqs = users.stream()
                .map(UserEntity::getUserSeq)
                .collect(Collectors.toList());

        // Taxi 엔티티를 조회하는 쿼리 작성
        return queryFactory.selectFrom(taxi)
                .where(taxi.user.userSeq.in(userSeqs))
                .fetch();
    }
}
