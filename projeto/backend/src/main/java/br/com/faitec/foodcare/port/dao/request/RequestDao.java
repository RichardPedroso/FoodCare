package br.com.faitec.foodcare.port.dao.request;

import br.com.faitec.foodcare.domain.Request;
import br.com.faitec.foodcare.port.dao.crud.CrudDao;

import java.util.List;

public interface RequestDao extends CrudDao<Request> {
    List<Request> findByUserId(int userId);
    List<Request> findByStatus(Request.RequestStatus status);
    List<Request> findByRequestType(Request.RequestType requestType);
    boolean updateStatus(int id, Request.RequestStatus newStatus);
}