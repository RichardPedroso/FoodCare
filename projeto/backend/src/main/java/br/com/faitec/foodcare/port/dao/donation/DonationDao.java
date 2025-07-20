package br.com.faitec.foodcare.port.dao.donation;

import br.com.faitec.foodcare.domain.Donation;
import br.com.faitec.foodcare.port.dao.crud.CrudDao;

import java.util.List;

public interface DonationDao extends CrudDao<Donation> {
    List<Donation> findByUserId(int userId);
}