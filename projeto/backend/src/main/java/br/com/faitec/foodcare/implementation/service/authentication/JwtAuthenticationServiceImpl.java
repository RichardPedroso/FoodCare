package br.com.faitec.foodcare.implementation.service.authentication;

import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.port.service.authentication.AuthenticationService;
import br.com.faitec.foodcare.port.service.user.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * Implementação JWT do serviço de autenticação.
 * Usa UserService para validação e gera tokens JWT.
 */
//@Service
public class JwtAuthenticationServiceImpl implements AuthenticationService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final String jwtSecret = "foodcare-secret-key-2024";
    private final long jwtExpiration = 86400000; // 24 horas

    public JwtAuthenticationServiceImpl(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserModel authenticate(String email, String password) {
        if(email == null || email.isEmpty()
            || password == null || password.isEmpty())
        {
            return null;
        }

        UserModel user = userService.findByEmail(email);
        if(user == null) {
            return null;
        }
        
        // Log para verificar se senha está criptografada
        System.out.println("🔐 [JWT] Email: " + email);
        System.out.println("🔐 [JWT] Senha no banco: " + user.getPassword());
        System.out.println("🔐 [JWT] É criptografada? " + (user.getPassword().startsWith("$2a$") ? "SIM" : "NÃO"));

        // Verificar senha com criptografia
        boolean passwordMatch = false;
        if (user.getPassword().startsWith("$2a$") || user.getPassword().startsWith("$2b$")) {
            // Senha criptografada - usar BCrypt
            passwordMatch = passwordEncoder.matches(password, user.getPassword());
        } else {
            // Senha em texto simples - comparação direta
            passwordMatch = password.equals(user.getPassword());
        }

        if(passwordMatch) {
            // Verificar se beneficiário está aprovado
            if(user.getUserType() == UserModel.UserType.beneficiary) {
                if(user.getAble() == null || !user.getAble()) {
                    return null; // Beneficiário não aprovado
                }
            }
            
            // Gerar token JWT (será implementado futuramente)
            // String token = generateToken(user);
            
            return user;
        }

        return null;
    }

    /**
     * Gera token JWT para o usuário (implementação futura).
     */
    private String generateToken(UserModel user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("userId", user.getId())
                .claim("userType", user.getUserType().name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }
}