package br.com.faitec.foodcare.implementation.service.authorization;

import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.port.service.authorization.AuthorizationService;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationServiceImpl implements AuthorizationService {

    @Override
    public boolean isAdmin(UserModel user) {
        return user != null && user.getUserType() == UserModel.UserType.admin;
    }

    @Override
    public boolean canManageRequests(UserModel user) {
        return isAdmin(user);
    }

    @Override
    public boolean canViewAllUsers(UserModel user) {
        return isAdmin(user);
    }
}