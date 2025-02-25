import { User } from "../models/user.model";
import { Video } from "../models/video.model";
import { getProvider } from "../providers/global.providers";
import { FormBuilder, Validators } from '@angular/forms';

export const createUserForm = (user?: User) => {
    const formBuilder: FormBuilder = getFormBuilder();
    return formBuilder.group({
        id: [user?.id],
        email: [user?.email, Validators.required],
        videos: createVideoFormArray(user?.videos)
    });
}

export const createVideoFormArray = (videos?: Video[]) => {
    const formBuilder: FormBuilder = getFormBuilder();
    return formBuilder.array(videos?.map(createVideoForm) ?? []);
}

export const createVideoForm = (video?: Video) => {
    const formBuilder: FormBuilder = getFormBuilder();
    return formBuilder.group({
        id: [video?.id],
        title: [video?.title],
        s3Url: [video?.s3Url],
        fileType: [video?.fileType],
        fileSize: [video?.fileSize],
        progress: [0]
    });
}

const getFormBuilder = (): FormBuilder => getProvider(FormBuilder);