package br.com.faitec.food_care.port.service.user;

public interface UpdatePasswordService {
    boolean updatePassword(final int id, final String oldPassword, final String newPassword);
}
