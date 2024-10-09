import {Resolutions} from "./Video";

export type CreateVideoInputModel = {
    title: string,
    author: string,
    availableResolutions: Resolutions[]
}