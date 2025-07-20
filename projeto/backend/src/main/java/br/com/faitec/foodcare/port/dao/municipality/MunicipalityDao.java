package br.com.faitec.foodcare.port.dao.municipality;

import br.com.faitec.foodcare.domain.Municipality;
import br.com.faitec.foodcare.port.dao.crud.CrudDao;

import java.util.List;

public interface MunicipalityDao extends CrudDao<Municipality> {
    List<Municipality> findByCity(String city);
}