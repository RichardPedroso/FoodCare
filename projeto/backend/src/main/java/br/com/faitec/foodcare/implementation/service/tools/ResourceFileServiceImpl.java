package br.com.faitec.foodcare.implementation.service.tools;

import br.com.faitec.foodcare.port.service.tools.ResourceFileService;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

@Service
public class ResourceFileServiceImpl implements ResourceFileService {

    @Override
    public String read(final String resourcePath) throws IOException {

        final ClassLoader classLoader = ResourceFileServiceImpl.class.getClassLoader();

        InputStream inputStream = classLoader.getResourceAsStream(resourcePath);

        if(inputStream == null){
            throw new RuntimeException("Arquivo nao encontrado");
        }

        final BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
        String content = "";
        String line;

        while((line = bufferedReader.readLine()) != null) {
            System.out.println(line);
            content += line + "\n";
        }

        return content;
    }
}