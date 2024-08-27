package com.took.taxi_api.repository;


import com.took.taxi_api.entity.Taxi;
import com.took.user_api.entity.UserEntity;

import java.util.List;

public interface TaxiRepositoryCustom {
    List<Taxi> findTaxisByUsers(List<UserEntity> users);
}
