export class Video {
    
    public id: string;
    public title: string;
    public s3Url: string;
    public fileType: string;
    public fileSize: number;

    constructor(
        id: string,
        title: string,
        s3Url: string,
        fileType: string,
        fileSize: number
    ) {
        this.id = id;
        this.title = title;
        this.s3Url = s3Url;
        this.fileType = fileType;
        this.fileSize = fileSize;
    }
}