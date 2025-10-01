package br.com.faitec.foodcare.implementation.service.user;

import br.com.faitec.foodcare.domain.UserModel;
import br.com.faitec.foodcare.port.dao.user.UserDao;
import br.com.faitec.foodcare.port.service.user.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Implementação do serviço de usuários.
 * Gerencia cadastro, autenticação e aprovação de beneficiários com validações de negócio.
 */
@Service
public class UserServiceImpl implements UserService {

    private final UserDao userDao;

    /** Construtor com injeção do DAO de usuários */
    public UserServiceImpl(UserDao userDao, PasswordEncoder passwordEncoder){
        this.userDao = userDao;
    }

    /** 
     * Cria um novo usuário com validações completas.
     * Beneficiários são criados como não aprovados por padrão.
     */
    @Override
    public int create(UserModel entity) {
        int invalidResponse = -1;
        if (entity == null) {
            return invalidResponse;
        }

        // Validações de campos obrigatórios
        if (entity.getName().isEmpty() || entity.getEmail().isEmpty() || isPassWordInvalid(entity.getPassword())) {
            return invalidResponse;
        }
        
        // Definir able = false como padrão para beneficiários (precisam de aprovação)
        if (entity.getUserType() == UserModel.UserType.beneficiary && entity.getAble() == null) {
            entity.setAble(false);
        }
        
        final int id = userDao.create(entity);
        return id;
    }

    /** 
     * Valida se a senha atende aos critérios mínimos.
     * Senha deve ter pelo menos 3 caracteres.
     */
    private boolean isPassWordInvalid(final String password) {

        if (password.isEmpty()) {
            return true;
        }

        if (password.length() < 3) {
            return true;
        }
        return false;
    }

    @Override
    public void delete(int id) {
        if (id < 0) {
            return;
        }
        userDao.delete(id);
    }

    @Override
    public UserModel findById(int id) {
        if (id < 0) {
            return null;
        }
        UserModel entity = userDao.findByid(id);
        return entity;
    }

    @Override
    public List<UserModel> findAll() {
        final List<UserModel> entities = userDao.findAll();
        return entities;
    }

    @Override
    public void update(int id, UserModel entity) {
        if (id != entity.getId()) {
            return;
        }

        UserModel userModel = findById(id);
        if (userModel == null) {
            return;
        }

        userDao.update(id, entity);
    }

    @Override
    public UserModel findByEmail(String email) {

        if (email.isEmpty()) {
            return null;
        }

        UserModel user = userDao.findByEmail(email);

        return user;
    }

    /** 
     * Atualiza senha do usuário com verificação da senha atual.
     * Valida a senha antiga antes de permitir a alteração.
     */
    @Override
    public boolean updatePassword(int id, String oldPassword, String newPassword) {

        UserModel user = findById(id);
        if (user == null) {
            return false;
        }

        // Verifica se a senha atual está correta
        if (!user.getPassword().equals(oldPassword)) {
            return false;
        }

        boolean response = userDao.updatePassword(id, newPassword);

        return response;
    }

    /** Filtra usuários por tipo (admin, donor, beneficiary) */
    @Override
    public List<UserModel> findByUserType(UserModel.UserType userType) {
        return userDao.findByUserType(userType);
    }

    /** Filtra usuários por status de aprovação */
    @Override
    public List<UserModel> findByAbleStatus(Boolean able) {
        return userDao.findByAbleStatus(able);
    }

    /** 
     * Atualiza status de aprovação de beneficiários.
     * Apenas beneficiários podem ter status alterado.
     */
    @Override
    public boolean updateAbleStatus(int userId, Boolean able) {
        UserModel user = findById(userId);
        if (user == null || user.getUserType() != UserModel.UserType.beneficiary) {
            return false;
        }
        return userDao.updateAbleStatus(userId, able);
    }

    /** 
     * Busca usuários por nome (busca parcial).
     * Se nome vazio, retorna todos os usuários.
     */
    @Override
    public List<UserModel> searchByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return findAll();
        }
        return userDao.searchByName(name.trim());
    }

}
