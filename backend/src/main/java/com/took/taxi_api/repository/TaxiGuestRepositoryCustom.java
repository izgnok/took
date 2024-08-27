package com.took.taxi_api.repository;


import com.took.taxi_api.entity.Taxi;
import com.took.taxi_api.entity.TaxiGuest;
import com.took.user_api.entity.UserEntity;

import java.util.List;

public interface TaxiGuestRepositoryCustom {
    int findNextRankByTaxiSeq(Long taxiSeq);
    List<TaxiGuest> findDestinationsByTaxiOrderedByRouteRank(Taxi taxi);
    boolean existsByUser(UserEntity user);
}
