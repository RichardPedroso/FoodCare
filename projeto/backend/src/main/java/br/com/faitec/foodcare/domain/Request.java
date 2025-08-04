package br.com.faitec.foodcare.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Request {
    private int id;
    private String requestDate;
    private RequestType requestType;
    private RequestStatus status;
    private int userId;
    
    public enum RequestType {
        BASIC,
        HYGIENE
    }
    
    public enum RequestStatus {
        PENDING,
        APPROVED,
        REJECTED,
        COMPLETED
    }
}