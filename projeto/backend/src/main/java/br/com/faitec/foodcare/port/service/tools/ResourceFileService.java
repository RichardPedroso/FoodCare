package br.com.faitec.foodcare.port.service.tools;

import java.io.IOException;

public interface ResourceFileService {
    String read(final String resourcePath) throws IOException;
}