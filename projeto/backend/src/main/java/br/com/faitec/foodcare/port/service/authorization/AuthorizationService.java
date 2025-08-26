package br.com.faitec.foodcare.port.service.authorization;

import br.com.faitec.foodcare.domain.UserModel;

public interface AuthorizationService {
    boolean isAdmin(UserModel user);
    boolean canManageRequests(UserModel user);
    boolean canViewAllUsers(UserModel user);
}