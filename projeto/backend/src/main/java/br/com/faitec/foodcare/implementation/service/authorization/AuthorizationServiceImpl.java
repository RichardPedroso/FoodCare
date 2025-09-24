package br.com.faitec.foodcare.implementation.service.authorization;

import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.port.service.authorization.AuthorizationService;
import org.springframework.stereotype.Service;

/**
 * Implementação do serviço de autorização.
 * Define permissões baseadas no tipo de usuário (admin, donor, beneficiary).
 */
@Service
public class AuthorizationServiceImpl implements AuthorizationService {

    /** Verifica se o usuário é administrador */
    @Override
    public boolean isAdmin(UserModel user) {
        return user != null && user.getUserType() == UserModel.UserType.admin;
    }

    /** Verifica se o usuário pode gerenciar solicitações (apenas admins) */
    @Override
    public boolean canManageRequests(UserModel user) {
        return isAdmin(user);
    }

    /** Verifica se o usuário pode visualizar todos os usuários (apenas admins) */
    @Override
    public boolean canViewAllUsers(UserModel user) {
        return isAdmin(user);
    }
}