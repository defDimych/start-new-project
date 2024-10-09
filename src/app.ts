import express, {Request, Response} from 'express';
import {SETTINGS} from "./settings";
import {HTTP_STATUSES} from "./utils";
import {Resolutions, Video} from "./types/Videos/Video";
import {CreateVideoInputModel} from "./types/Videos/CreateVideoInputModel";
import {OutputErrorsType} from "./types/OutputErrorsType";

// create app
export const app = express()

app.use(express.json());

const dbVideos: Video[] = [];

const inputValidation = (video: CreateVideoInputModel) => {
    const errors: OutputErrorsType = {
        errorsMessages: []
    }

    if (!Array.isArray(video.availableResolutions) || !video.availableResolutions.length) {
        errors.errorsMessages.push({
            message: 'error!!!',
            field: 'availableResolutions'
        })
    }

    for (const item of video.availableResolutions) {
        if (!Object.values(Resolutions).includes(item)) {
            errors.errorsMessages.push({
                message: 'Invalid resolution format.',
                field: 'availableResolutions'
            })
            break;
        }

    }


}

app.get(SETTINGS.PATH.VIDEOS, (req: Request, res: Response) => {
    res.status(HTTP_STATUSES.OK_200).send(dbVideos);
})
app.post(SETTINGS.PATH.VIDEOS, (req: Request<any, any, CreateVideoInputModel>, res: Response) => {
    const errors = inputValidation(req.body);
})