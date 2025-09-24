package br.com.faitec.foodcare.implementation.service.authentication;

import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.port.dao.user.UserDao;
import br.com.faitec.foodcare.port.service.authentication.AuthenticationService;
import org.springframework.stereotype.Service;

/**
 * Implementação do serviço de autenticação.
 * Valida credenciais de usuários e verifica status de aprovação para beneficiários.
 */
@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserDao userDao;

    /** Construtor com injeção do DAO de usuários */
    public AuthenticationServiceImpl(UserDao userDao) {
        this.userDao = userDao;
    }

    /**
     * Autentica um usuário com email e senha.
     * Valida credenciais e verifica se beneficiários estão aprovados.
     */
    @Override
    public UserModel authenticate(String email, String password) {
        // Validação básica dos parâmetros
        if(email == null || email.isEmpty()
            || password == null || password.isEmpty())
        {
            return null;
        }

        // Busca usuário pelo email
        UserModel user = userDao.findByEmail(email);
        if(user == null) {
            return null;
        }

        // Verifica senha (em produção deveria usar hash)
        if(user.getPassword().equals(password)) {
            // Verificar se beneficiário está aprovado
            if(user.getUserType() == UserModel.UserType.beneficiary) {
                if(user.getAble() == null || !user.getAble()) {
                    return null; // Beneficiário não aprovado
                }
            }
            return user;
        }

        return null;
    }
}