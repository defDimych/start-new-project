import express, {Request, Response} from "express";
import {Resolutions, Video} from "../types/Videos/Video";
import {UpdateVideoInputModel} from "../types/Videos/UpdateVideoInputModel";
import {OutputErrorsType} from "../types/OutputErrorsType";
import {isoPattern} from "../../__tests__/videos.e2e.test";
import {CreateVideoInputModel} from "../types/Videos/CreateVideoInputModel";
import {HTTP_STATUSES} from "../utils";

const UpdateInputValidation = (video: UpdateVideoInputModel) => {
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

    if (!video.title || video.title.length > 40) {
        errors.errorsMessages.push({
            message: 'Invalid title.',
            field: 'title'
        })
    }

    if (!video.author || video.author.length > 20) {
        errors.errorsMessages.push({
            message: 'Invalid author name.',
            field: 'author'
        })
    }

    if (video.minAgeRestriction !== null) {
        if (video.minAgeRestriction < 1 || video.minAgeRestriction > 18) {
            errors.errorsMessages.push({
                message: 'An incorrect value range was passed.',
                field: 'minAgeRestriction'
            })
        }
    }

    if (!isoPattern.test(video.publicationDate)) {
        errors.errorsMessages.push({
            message: 'Invalid date format.',
            field: 'publicationDate'
        })
    }

    if (typeof video.canBeDownloaded !== 'boolean') {
        errors.errorsMessages.push({
            message: 'Invalid type passed.',
            field: 'canBeDownloaded'
        })
    }
    return errors;
}
const CreateInputValidation = (video: CreateVideoInputModel) => {
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

    if (!video.title || video.title.length > 40) {
        errors.errorsMessages.push({
            message: 'Invalid title.',
            field: 'title'
        })
    }

    if (!video.author || video.author.length > 20) {
        errors.errorsMessages.push({
            message: 'Invalid author name.',
            field: 'author'
        })
    }

    return errors;
}
const dateGeneration = () => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);

    return currentDate.toISOString();
}

export const getVideosRoutes = (dbVideos: Video[]) => {
    const router = express.Router()

    router.get('/', (req: Request, res: Response) => {
        res.status(HTTP_STATUSES.OK_200).send(dbVideos);
    })
    router.post('/',
        (req: Request<any, any, CreateVideoInputModel>, res: Response<Video | OutputErrorsType>) => {
            const errors = CreateInputValidation(req.body);

            if (errors.errorsMessages.length) {
                res.status(HTTP_STATUSES.BAD_REQUEST_400).json(errors);
                return;
            }

            const newVideo: Video = {
                id: Date.now() + Math.random(),
                title: req.body.title,
                author: req.body.author,
                canBeDownloaded: false,
                minAgeRestriction: null,
                createdAt: new Date().toISOString(),
                publicationDate: dateGeneration(),
                availableResolutions: req.body.availableResolutions
            }
            dbVideos.push(newVideo);

            res
                .status(HTTP_STATUSES.CREATED_201)
                .json(newVideo);
        })
    router.get('/:id', (req: Request, res: Response<Video>) => {
        const foundVideo = dbVideos.find(v => v.id === +req.params.id);

        if (!foundVideo) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.status(HTTP_STATUSES.OK_200).json(foundVideo);
    })
    router.put('/:id',
        (req: Request<any, any, UpdateVideoInputModel>, res: Response) => {
            const foundVideo: Video | undefined = dbVideos.find(v => v.id === +req.params.id);

            if (!foundVideo) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
                return;
            }

            const errors = UpdateInputValidation(req.body);

            if (errors.errorsMessages.length) {
                res.status(HTTP_STATUSES.BAD_REQUEST_400).json(errors);
                return;
            }

            foundVideo.title = req.body.title;
            foundVideo.author = req.body.author;
            foundVideo.availableResolutions = req.body.availableResolutions;
            foundVideo.canBeDownloaded = req.body.canBeDownloaded;
            foundVideo.minAgeRestriction = req.body.minAgeRestriction;
            foundVideo.publicationDate = req.body.publicationDate;

            // for (let key in foundVideo) {
            //     if (key === 'id' || key === 'createdAt') {
            //
            //     } else {
            //         foundVideo[key] = req.body[key]
            //     }
            // }

            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        })
    router.delete('/:id', (req: Request, res: Response) => {
        const foundVideoIndex = dbVideos.findIndex(v => v.id === +req.params.id);

        if (foundVideoIndex === -1) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        dbVideos.splice(foundVideoIndex, 1);

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    })

    return router;
}