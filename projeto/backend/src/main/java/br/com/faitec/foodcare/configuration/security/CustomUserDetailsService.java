package br.com.faitec.foodcare.configuration.security;

import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.port.dao.user.UserDao;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserDao userDao;

    public CustomUserDetailsService(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserModel user = userDao.findByEmail(email);
        
        if (user == null) {
            throw new UsernameNotFoundException("Usuário não encontrado: " + email);
        }

        return User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(Collections.singletonList(
                    new SimpleGrantedAuthority(user.getUserType().name())
                ))
                .build();
    }
}