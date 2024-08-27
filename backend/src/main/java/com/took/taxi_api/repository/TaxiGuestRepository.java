package com.took.taxi_api.repository;


import com.took.taxi_api.entity.Taxi;
import com.took.taxi_api.entity.TaxiGuest;
import com.took.user_api.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaxiGuestRepository extends JpaRepository<TaxiGuest, Long>, TaxiGuestRepositoryCustom {
    TaxiGuest findByUserAndTaxi(UserEntity user, Taxi taxi);
    TaxiGuest findByUser(UserEntity user);
    List<TaxiGuest> findByTaxi(Taxi taxi);
    List<TaxiGuest> findByTaxiAndDestiName(Taxi taxi, String destiName);
}
