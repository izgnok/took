package com.took.user_api.service.implement;


import com.took.common.CertificationNumber;
import com.took.provider.EmailProvider;
import com.took.provider.JwtProvider;
import com.took.user_api.dto.request.auth.*;
import com.took.user_api.dto.response.ResponseDto;
import com.took.user_api.dto.response.auth.*;
import com.took.user_api.entity.CertificationEntity;
import com.took.user_api.entity.UserEntity;
import com.took.user_api.repository.CertificationRepository;
import com.took.user_api.repository.UserRepository;
import com.took.user_api.service.AuthService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final CertificationRepository certificationRepository;

    private final JwtProvider jwtProvider;
    private final EmailProvider emailProvider;

    // 의존성을 주입받지 않고 외부에서 가지고 옴
    // 어떤걸 사용할지 직접 선택하기 위함.
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Transactional
    @Override
    public ResponseEntity<? super IdCheckResponseDto> idCheck(IdCheckRequestDto dto) {

        try {

            String userId = dto.getUserId();
            boolean isExistId = userRepository.existsByUserId(userId);

            if (isExistId)
                return IdCheckResponseDto.duplicatedId();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return IdCheckResponseDto.success();
    }

    @Transactional
    @Override
    public ResponseEntity<? super EmailCertificationResponseDto> emailCertification(EmailCertificaionRequestDto dto) {

        try {

            String userId = dto.getUserId();
            String email = dto.getEmail();

            boolean isExitsId = userRepository.existsByUserId(userId);

            if (isExitsId)
                return EmailCertificationResponseDto.duplicatedId();

            String certificationNumber = CertificationNumber.getCertificationNumber();

            boolean isSuccessed = emailProvider.sendCertificationMail(email, certificationNumber);

            if (!isSuccessed)
                return EmailCertificationResponseDto.mailSendFail();

            CertificationEntity certificationEntity = new CertificationEntity(userId, email, certificationNumber);
            certificationRepository.save(certificationEntity);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return EmailCertificationResponseDto.success();
    }

    @Transactional
    @Override
    public ResponseEntity<? super CheckCertificationResponseDto> checkCertification(CheckCertificationRequestDto dto) {

        try {

            String userId = dto.getUserId();
            String email = dto.getEmail();
            String certificationNumber = dto.getCertificationNumber();

            CertificationEntity certificationEntity = certificationRepository.findByUserId(userId);
            // 이렇게 되면 인증 자체를 보내지 않은 것.
            if (certificationEntity == null)
                return CheckCertificationResponseDto.certificationFail();

            boolean isMatch = certificationEntity.getEmail().equals(email)
                    && certificationEntity.getCertificationNumber().equals(certificationNumber);
            if (!isMatch)
                return CheckCertificationResponseDto.certificationFail();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return CheckCertificationResponseDto.success();
    }

    @Transactional
    @Override
    public ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto) {

        try {

            // 먼저 중복 하는 가?
            String userId = dto.getUserId();
            boolean isExistId = userRepository.existsByUserId(userId);

            if (isExistId)
                return SignUpResponseDto.duplicatedId();

            String email = dto.getEmail();
            String certificationNumber = dto.getCertificationNumber();
            CertificationEntity certificationEntity = certificationRepository.findByUserId(userId);
            boolean isMatch = certificationEntity.getEmail().equals(email)
                    && certificationEntity.getCertificationNumber().equals(certificationNumber);

            if (!isMatch)
                return SignUpResponseDto.certificationFail();

            // 받아온 비밀 번호를 암호화 시켜서 넘겨줘야한다.
            String password = dto.getPassword();
            String encodePassword = passwordEncoder.encode(password);
            dto.setPassword(encodePassword);

            UserEntity userEntity = new UserEntity(dto);
            userRepository.save(userEntity);

            //
            certificationRepository.deleteByUserId(userId);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return SignUpResponseDto.success();
    }

    @Transactional
    @Override
    public ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto) {


        String accessToken = null;
        String refreshToken = null;
        Long userSeq = null;
    

        try {

            String userId = dto.getUserId();
            UserEntity userEntity = userRepository.findByUserId(userId);

           

            if (userEntity == null)
                return SignInResponseDto.signInFail();

            // 유저의 입력된 비밀번호와 DB에 저장된 암호화된 비밀번호를 matches로 비교
            String password = dto.getPassword();
            String encodedPassword = userEntity.getPassword();

            boolean isMatched = passwordEncoder.matches(password, encodedPassword);

            if (!isMatched)
                return SignInResponseDto.signInFail();

            // token = jwtProvider.create(userId);

            accessToken = jwtProvider.createAccessToken(userId);
            refreshToken = jwtProvider.createRefreshToken(userId);
            userSeq = userEntity.getUserSeq();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }


        return SignInResponseDto.success(accessToken, refreshToken,userSeq);
    }

    @Transactional
    @Override
    public ResponseEntity<? super RefreshTokenResponseDto> refreshAccessToken(RefreshTokenRequestDto dto) {

        String newAccessToken = null;

        try {
            String userId = jwtProvider.validate(dto.getRefreshToken());

            if(userId==null){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }


            UserEntity user = userRepository.findByUserId(userId);

            if (userId.equals(user.getUserId())) {
                newAccessToken = jwtProvider.createAccessToken(userId);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.databaseError();
        }

        return RefreshTokenResponseDto.success(newAccessToken);
    }

}
