import { Video } from "./video.model";

export class User {

    public id: string;
    public email: string;
    public videos: Video[];

    constructor(
        id: string,
        email: string,
        videos: Video[]
    ) {
        this.id = id;
        this.email = email;
        this.videos = videos;
    }
}