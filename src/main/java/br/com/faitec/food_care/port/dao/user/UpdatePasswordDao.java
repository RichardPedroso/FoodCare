package br.com.faitec.food_care.port.dao.user;

public interface UpdatePasswordDao {
    boolean updatePassword(final int id, final String newPassword);
}
