package com.took.delivery_api.repository;


import com.took.delivery_api.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

    List<Delivery> findByDeliverySeqIn(List<Long> deliverySeqs);

    Delivery findByRoomSeq(Long roomSeq);

    Delivery findByPartySeq(Long partySeq);
}
