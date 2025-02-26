import boto3
import os
from fastapi import HTTPException
from dotenv import load_dotenv
import io 

load_dotenv()

class S3Client:
    def __init__(self):
        """Inicializa o cliente S3 com as credenciais do ambiente."""
        self.bucket_name = os.getenv("AWS_S3_BUCKET_NAME")
        self.region_name = os.getenv("AWS_S3_REGION")
        self.aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
        self.aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")

        try:
            self.client = boto3.client(
                "s3",
                region_name=self.region_name,
                aws_access_key_id=self.aws_access_key_id,
                aws_secret_access_key=self.aws_secret_access_key,
            )
            self.client.list_buckets()  # Testa a conexão
        except boto3.exceptions.S3UploadFailedError as e:
            raise HTTPException(status_code=500, detail=f"Falha ao conectar ao S3: {str(e)}")
        except boto3.exceptions.NoCredentialsError:
            raise HTTPException(status_code=500, detail="Credenciais do AWS S3 não encontradas.")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro inesperado ao conectar ao S3: {str(e)}")

    def download_fileobj(self, bucket_name, key):
        """Baixa um arquivo do S3 diretamente para um objeto em memória."""
        file_buffer = io.BytesIO()
        try:
            print("to aqui dentro!!")
            self.client.download_fileobj(bucket_name, key, file_buffer)
            file_buffer.seek(0)
            return file_buffer
        except self.client.exceptions.NoSuchKey:
            raise HTTPException(status_code=404, detail="Arquivo não encontrado no S3.")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao baixar o arquivo do S3: {str(e)}")
