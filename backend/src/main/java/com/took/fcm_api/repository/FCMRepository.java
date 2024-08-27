package com.took.fcm_api.repository;

import com.took.fcm_api.entity.FCMToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FCMRepository extends CrudRepository<FCMToken, String> {
    Optional<FCMToken> findByUserSeq(String userSeq);
    Optional<List<FCMToken>> findByUserSeqIn(List<String> userSeq);
}
