package com.deepreal.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.deepreal.models.Video.AnalysisState;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${email.template.path.fake}")
    private String fakeResultEmailTemplatePath;

    @Value("${email.template.path.real}")
    private String realResultEmailTemplatePath;

    public void sendDeepfakeAnalysisEmail(String to, String videoName, AnalysisState isDeepfake) {
        String subject = "Resultado da análise do vídeo: " + videoName;
        String body;
        try {
            if (isDeepfake == AnalysisState.FAKE) {
                body = this.getHtmlContent(fakeResultEmailTemplatePath, videoName);
            } else {
                body = this.getHtmlContent(realResultEmailTemplatePath, videoName);
            }
        } catch (IOException e) {
            System.out.println("Erro ao ler o arquivo de template de e-mail: " + e.getMessage());
            e.printStackTrace();
            return;
        }

        // Enviar o e-mail
        try {
            System.out.println("Tentando enviar e-mail para: " + to);
            sendEmail(to, subject, body);
            System.out.println("E-mail enviado com sucesso para: " + to);
        } catch (MessagingException | MailException e) {
            System.out.println("Erro ao enviar e-mail para " + to + ": " + e.getMessage());
        }
    }

    private void sendEmail(String to, String subject, String body) throws MessagingException, MailException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
    
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true);
    
        mailSender.send(message);
    }

     public String getHtmlContent(String filePath, String videoName) throws IOException {
        ClassPathResource resource = new ClassPathResource(filePath);
        String genericBody = new String(Files.readAllBytes(Paths.get(resource.getURI())));
        String body = genericBody.replace("VIDEO_NAME", videoName);
        return body;
    }
}
