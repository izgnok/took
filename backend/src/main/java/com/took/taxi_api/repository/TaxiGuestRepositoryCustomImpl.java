package com.took.taxi_api.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.took.taxi_api.entity.QTaxiGuest;
import com.took.taxi_api.entity.Taxi;
import com.took.taxi_api.entity.TaxiGuest;
import com.took.user_api.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository  // 이 클래스가 Spring의 Repository 빈으로 등록됨을 나타냅니다.
@RequiredArgsConstructor  // Lombok을 사용하여 모든 final 필드를 매개변수로 가지는 생성자를 자동으로 생성합니다.
public class TaxiGuestRepositoryCustomImpl implements TaxiGuestRepositoryCustom {

    private final JPAQueryFactory queryFactory;  // JPAQueryFactory를 통해 데이터베이스 작업을 처리합니다.

    /**
     * 특정 택시의 다음 목적지 순위를 조회합니다.
     * @param taxiSeq 택시 번호
     * @return 다음 목적지 순위
     */
    @Override
    public int findNextRankByTaxiSeq(Long taxiSeq) {
        QTaxiGuest taxiGuest = QTaxiGuest.taxiGuest;

        Integer maxRank = queryFactory.select(taxiGuest.routeRank.max())
                .from(taxiGuest)
                .where(taxiGuest.taxi.taxiSeq.eq(taxiSeq))
                .fetchOne();

        return maxRank != null ? maxRank + 1 : 1;
    }

    /**
     * 특정 택시의 경로를 순위별로 조회합니다.
     * @param taxi 택시 번호
     * @return 경로 목록
     */
    @Override
    public List<TaxiGuest> findDestinationsByTaxiOrderedByRouteRank(Taxi taxi) {
        QTaxiGuest taxiGuest = QTaxiGuest.taxiGuest;

        return queryFactory.selectFrom(taxiGuest)
                .where(taxiGuest.taxi.eq(taxi))
                .orderBy(taxiGuest.routeRank.asc())
                .fetch();
    }

    /**
     * 특정 사용자가 참가했는지 확인합니다.
     * @param user 사용자 번호
     * @return 탑승 여부
     */
    @Override
    public boolean existsByUser(UserEntity user) {
        QTaxiGuest taxiGuest = QTaxiGuest.taxiGuest;

        Integer result = queryFactory.selectOne()
                .from(taxiGuest)
                .where(taxiGuest.user.userSeq.eq(user.getUserSeq()))
                .fetchFirst(); // fetchFirst()는 결과가 없으면 null을 반환

        return result != null;
    }
}
