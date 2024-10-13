import {Resolutions} from "./Video";

export type UpdateVideoInputModel = {
    title: string,
    author: string,
    availableResolutions: Resolutions[],
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    publicationDate: string,
}