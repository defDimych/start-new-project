import express, {Request, Response} from "express";
import {HTTP_STATUSES} from "../utils";
import {Video} from "../types/Videos/Video";

export const getTestsRouter = (dbVideos: Video[]) => {
    const router = express.Router();

    router.delete('/', (req: Request, res: Response) => {
        dbVideos = []

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    })

    return router;
}

