export class Video {
    
    public id: string;
    public title: string;
    public s3Url: string;
    public fileType: string;
    public fileSize: number;
    public state: string;
    public createdAt: Date;

    constructor(
        id: string,
        title: string,
        s3Url: string,
        fileType: string,
        fileSize: number,
        state: string,
        createdAt: Date = new Date()
    ) {
        this.id = id;
        this.title = title;
        this.s3Url = s3Url;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.state = state;
        this.createdAt = createdAt;
    }
}