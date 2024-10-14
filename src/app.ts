import express from 'express';
import {getTestsRouter} from "./routes/testing-all-data-route";
import {Video} from "./types/Videos/Video";
import {SETTINGS} from "./settings";
import {getVideosRoutes} from "./routes/videos-router";

// create app
export const app = express()

export let dbVideos: Video[] = [];

app.use(express.json());
app.use('/testing/all-data', getTestsRouter(dbVideos));
app.use(SETTINGS.PATH.VIDEOS, getVideosRoutes(dbVideos));



