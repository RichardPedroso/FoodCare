package br.com.faitec.foodcare.port.service.request;

import br.com.faitec.foodcare.domain.Request;
import br.com.faitec.foodcare.port.service.crud.CrudService;

import java.util.List;

public interface RequestService extends CrudService<Request> {
    List<Request> findByUserId(int userId);
    List<Request> findByStatus(Request.RequestStatus status);
    List<Request> findByRequestType(Request.RequestType requestType);
    boolean updateStatus(int id, Request.RequestStatus newStatus);
}