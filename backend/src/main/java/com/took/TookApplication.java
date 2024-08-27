package com.took;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.TimeZone;

@SpringBootApplication
@EnableRedisRepositories // Redis 리포지토리 활성화
public class TookApplication {

    @PostConstruct
    void started(){
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
    }

    public static void main(String[] args) throws IOException {
        // FirebaseApp 초기화 여부 확인
        if (FirebaseApp.getApps().isEmpty()) {
            InputStream serviceAccount = TookApplication.class.getClassLoader().getResourceAsStream("serviceAccountKey.json");

            if (serviceAccount == null) {
                throw new FileNotFoundException("serviceAccountKey.json 파일을 찾을 수 없습니다.");
            }

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            FirebaseApp.initializeApp(options);
        }
        SpringApplication.run(com.took.TookApplication.class, args);
    }

}
