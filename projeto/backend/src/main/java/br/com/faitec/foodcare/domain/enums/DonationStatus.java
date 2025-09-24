package br.com.faitec.foodcare.domain.enums;

public class DonationStatus {
    public static final String PENDENTE = "Pendente";
    public static final String EM_ESTOQUE = "Em estoque";
    public static final String UTILIZADA = "Utilizada";
    public static final String REJEITADA = "Rejeitada";
    
    private DonationStatus() {
        // Utility class
    }
}