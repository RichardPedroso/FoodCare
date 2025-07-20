package br.com.faitec.foodcare.port.service.donation;

import br.com.faitec.foodcare.domain.Donation;
import br.com.faitec.foodcare.port.service.crud.CrudService;

import java.util.List;

public interface DonationService extends CrudService<Donation> {
    List<Donation> findByUserId(int userId);
}