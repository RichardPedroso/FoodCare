package br.com.faitec.foodcare.port.service.municipality;

import br.com.faitec.foodcare.domain.Municipality;
import br.com.faitec.foodcare.port.service.crud.CrudService;

import java.util.List;

public interface MunicipalityService extends CrudService<Municipality> {
    List<Municipality> findByCity(String city);
}