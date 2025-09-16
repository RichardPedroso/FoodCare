package br.com.faitec.foodcare.implementation.service.authentication;

import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.port.service.authentication.AuthenticationService;
import br.com.faitec.foodcare.port.service.user.UserService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

public class JWtAuthenticationServiceImpl implements AuthenticationService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public JWtAuthenticationServiceImpl(UserService userService, PasswordEncoder passwordEncoder){
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserModel authenticate(String email, String password) {
        final UserModel userModel = userService.findByEmail(email);
        if (userModel == null){
            throw new UsernameNotFoundException("usuario nao encontrado");
        }

        if (!passwordEncoder.matches(password, userModel.getPassword())){
            throw new BadCredentialsException("credenciais invalidas");
        }

        return userModel;
    }
}