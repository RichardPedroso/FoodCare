package br.com.faitec.foodcare.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

/**
 * Configuração CORS (Cross-Origin Resource Sharing) da aplicação.
 * Permite que o frontend acesse a API de diferentes domínios/portas.
 */
@Configuration
public class CorsConfiguration implements WebMvcConfigurer {

    /**
     * Configura as regras CORS globalmente para todos os endpoints.
     * Permite requisições de qualquer origem com todos os métodos HTTP.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Aplica CORS para todos os endpoints
                .allowedOriginPatterns("*")  // Permite qualquer origem (domínio/porta)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH")  // Métodos HTTP permitidos
                .allowedHeaders("*")  // Permite todos os cabeçalhos
                .allowCredentials(true);  // Permite envio de cookies/credenciais
    }

    /**
     * Bean alternativo para configuração CORS.
     * Usado pelo Spring Security quando presente na aplicação.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        // Cria nova configuração CORS
        org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
        
        // Define as mesmas regras do método addCorsMappings
        configuration.setAllowedOriginPatterns(List.of("*"));  // Qualquer origem
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));  // Métodos permitidos
        configuration.setAllowedHeaders(List.of("*"));  // Todos os cabeçalhos
        configuration.setAllowCredentials(true);  // Permite credenciais
        
        // Registra a configuração para todos os endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}