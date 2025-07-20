package br.com.faitec.foodcare.domain.dto;

import br.com.faitec.foodcare.domain.Request;
import lombok.Data;

@Data
public class UpdateRequestDto {
    private int id;
    private String requestDate;
    private Request.RequestType requestType;
    private Request.RequestStatus status;
    private int userId;

    public Request toRequest() {
        final Request entity = new Request();
        entity.setId(id);
        entity.setRequestDate(requestDate);
        entity.setRequestType(requestType);
        entity.setStatus(status);
        entity.setUserId(userId);
        return entity;
    }
}