# 🕵️‍♂️ DeepReal - Análise de Deepfakes com IA - Back API

> **DeepReal** é uma API desenvolvida com **Spring Boot** para detectar deepfakes em vídeos, utilizando inteligência artificial e armazenamento na **AWS S3**.

<p align="center">
  <img src="../images/spring_boot.png" alt="Spring Boot logo" style="width: 490px; height: auto;">
</p>

## 🚀 Funcionalidades  

✅ Upload de vídeos para análise  
✅ Armazenamento seguro no **Amazon S3**  
✅ Verificação de deepfake com o modelo **Deep-Fake-Detector-v2-Model**  
✅ Notificação por e-mail sobre o resultado da análise  

## 🛠️ Tecnologias  

- **Spring Boot** - Framework principal  
- **PostgreSQL** - Banco de dados  
- **Amazon S3** - Armazenamento de vídeos  
- **Google SMTP** - Envio de e-mails  

## 📦 Instalação e Execução  

### 🔹 **Pré-requisitos**  

Antes de rodar a aplicação, tenha instalado:  
✅ **Java 21**  
✅ **Maven 3.8+**  
✅ **PostgreSQL** (ou altere para um banco de sua preferência)  

### 🔹 **1. Clonar o repositório**  

```sh
 git clone https://github.com/Mikanaja/PadroesArq.git
 cd PadroesArq/deep-real-back-api
```

### 🔹 **2. Configurar o banco de dados**  

Crie um banco PostgreSQL e configure o `application.properties`:  

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/nome_banco
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=update
```

### 🔹 **3. Configurar credenciais do Bucket S3**  

No mesmo arquivo, adicione:  

```properties
aws.s3.bucket-name=nomo-seu-bucket
aws.s3.region=us-east-1
aws.s3.access-key=SUA_ACCESS_KEY
aws.s3.secret-key=SUA_SECRET_KEY
spring.servlet.multipart.max-file-size=101MB
spring.servlet.multipart.max-request-size=101MB
```

### 🔹 **4. Configurar credenciais Gmail SMTP e Paths dos templates**  

Ainda no mesmo arquivo, adicione:  

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=seu_email@gmail.com
spring.mail.password=sua-senha-de-app
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
email.template.path.fake=templates/email-fake.html
email.template.path.real=templates/email-real.html
```

### 🔹 **5. Rodar a aplicação**  

```sh
mvn spring-boot:run
```

A API estará disponível em:  
🔗 **<http://localhost:8080>**

## 📡 **Endpoints da API**  

### 🏷️ Criar Usuário  

```http
POST /users
```

**Body:**  

```json
{
  "email": "usuario@email.com"
}
```

### 🎥 Enviar Vídeo para Análise  

```http
POST /videos/upload
```

**Body:** *(Multipart Form Data)*  

- `userId` (UUID)
- `file` (arquivo de vídeo)  

### 📊 Consultar Resultados  

```http
GET /videos/{videoId}
```

## 📧 **Notificação por E-mail**  

Após a análise, o usuário recebe um e-mail com o resultado:  

✔️ **Deepfake detectado** – Alerta vermelho 🚨  
✔️ **Deepfake não detectado** – Resultado verde ✅  

## 🔥 **Contribuição**  

Sinta-se livre para abrir **Issues** ou **Pull Requests**!
