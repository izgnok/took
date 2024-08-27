package com.took.taxi_api.repository;


import com.took.taxi_api.entity.Taxi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaxiRepository extends JpaRepository<Taxi, Long>, TaxiRepositoryCustom {
    Taxi findByRoomSeq(Long roomSeq);

    Taxi findByPartySeq(Long partySeq);
}
