package com.took.fcm_api.repository;

import com.took.fcm_api.entity.Alarm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlarmRepository extends JpaRepository<Alarm, Long> {
    List<Alarm> findByUserSeq(long userSeq);
    List<Alarm> findByUserSeqAndPartySeq(Long userSeq, Long partySeq);
}
