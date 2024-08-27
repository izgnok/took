package com.took.sms_api.repository;

import com.took.sms_api.entity.Identity;
import org.springframework.data.repository.CrudRepository;


public interface IdentityRepository extends CrudRepository<Identity, String> {
}
