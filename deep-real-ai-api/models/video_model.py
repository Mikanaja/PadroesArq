from pydantic import BaseModel, field_validator

class VideoModel(BaseModel):
    filename: str
    content_type: str
    format_type: str
    size: int
    duration: int

    @field_validator('filename')
    def validar_filename(cls, value: str):
        formatos_permitidos = ["mp4", "avi", "mkv", "mov", "flv"]
        
        if "." not in value:
            raise ValueError("O nome do arquivo deve conter uma extensão válida.")

        extensao = value.split('.')[-1].lower()
        if extensao not in formatos_permitidos:
            raise ValueError(f"Formato inválido. Use um dos seguintes: {', '.join(formatos_permitidos)}")
        
        return value
    
    @field_validator('size')
    def validar_size(cls, value: int):
        max_size = 524288000  # 500 MB
        if value > max_size:
            raise ValueError("O tamanho do vídeo deve ser no máximo 500 MB.")
        return value
    
    @field_validator('duration')
    def validar_duration(cls, value: int):
        if value < 5:
            raise ValueError("A duração do vídeo deve ser de pelo menos 5 segundos.")
        if value > 7200:
            raise ValueError("A duração do vídeo não pode ultrapassar 2 horas.")
        return value

