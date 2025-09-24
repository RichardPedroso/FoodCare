package br.com.faitec.foodcare.implementation.service.tools;

import br.com.faitec.foodcare.port.service.tools.ResourceFileService;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

/**
 * Implementação do serviço de leitura de arquivos de recursos.
 * Lê arquivos do classpath (resources) como scripts SQL de inicialização.
 */
@Service
public class ResourceFileServiceImpl implements ResourceFileService {

    /** 
     * Lê o conteúdo completo de um arquivo de recursos.
     * Usado principalmente para carregar scripts SQL de inicialização do banco.
     */
    @Override
    public String read(final String resourcePath) throws IOException {

        final ClassLoader classLoader = ResourceFileServiceImpl.class.getClassLoader();

        // Busca o arquivo no classpath
        InputStream inputStream = classLoader.getResourceAsStream(resourcePath);

        if(inputStream == null){
            throw new RuntimeException("Arquivo nao encontrado");
        }

        // Lê o arquivo linha por linha
        final BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
        String content = "";
        String line;

        while((line = bufferedReader.readLine()) != null) {
            System.out.println(line);  // Log para debug
            content += line + "\n";
        }

        return content;
    }
}