package br.com.faitec.foodcare.implementation.service.authentication;

import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.port.dao.user.UserDao;
import br.com.faitec.foodcare.port.service.authentication.AuthenticationService;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserDao userDao;

    public AuthenticationServiceImpl(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public UserModel authenticate(String email, String password) {
        if(email == null || email.isEmpty()
            || password == null || password.isEmpty())
        {
            return null;
        }

        UserModel user = userDao.findByEmail(email);
        if(user == null) {
            return null;
        }

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