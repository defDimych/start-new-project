import {describe} from "node:test";
import {HTTP_STATUSES} from "../src/utils";
import {req} from "./test-helpers";
import {SETTINGS} from "../src/settings";
import {Video} from "../src/types/Videos/Video";

export const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

describe('tests for /videos', async () => {
    beforeAll(async () => {
        await req
            .delete('/testing/all-data')
            .expect(HTTP_STATUSES.NO_CONTENT_204);
    })

    it('should return 200 and empty array', async () => {
        await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(HTTP_STATUSES.OK_200, []);
    })

    it('Should not create an entity with incorrect input data.', async () => {
        await req
            .post(SETTINGS.PATH.VIDEOS)
            .send({ title: '', author: '',  availableResolutions: []})
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    { message: 'error!!!', field: 'availableResolutions' },
                    { message: 'Invalid title.', field: 'title' },
                    { message: 'Invalid author name.', field: 'author' }
                ]
            })

        await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(HTTP_STATUSES.OK_200, []);
    })

    let createdVideo1: Video | null = null;
    it('Must create an entity with valid input data.', async() => {
        const data = {
            title: 'Back-end Путь самурая',
            author: 'IT-INCUBATOR',
            availableResolutions: ['P1080', 'P1440']
        }

        const response = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201);

        createdVideo1 = response.body;

        expect(createdVideo1).toEqual({
            id: expect.any(Number),
            title: data.title,
            author: data.author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.stringMatching(isoPattern),
            publicationDate: expect.stringMatching(isoPattern),
            availableResolutions: data.availableResolutions
        })

        await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(HTTP_STATUSES.OK_200, [createdVideo1]);
    })

    let createdVideo2: Video | null = null;
    it('create one more entity', async() => {
        const data = {
            title: 'Back-end Путь самурая 2',
            author: 'IT-INCUBATOR',
            availableResolutions: ['P1080']
        }

        const response = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201);

        createdVideo2 = response.body;

        expect(createdVideo2).toEqual({
            id: expect.any(Number),
            title: data.title,
            author: data.author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.stringMatching(isoPattern),
            publicationDate: expect.stringMatching(isoPattern),
            availableResolutions: data.availableResolutions
        })

        await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(HTTP_STATUSES.OK_200, [createdVideo1, createdVideo2]);
    })

    it('should return 404 for not existing entity', async () => {
        await req
            .get(SETTINGS.PATH.VIDEOS + '/' + -100)
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    })

    it('Must find an existing entity.', async () => {
        const response = await req
            .get(SETTINGS.PATH.VIDEOS + '/' + createdVideo1!.id)
            .expect(HTTP_STATUSES.OK_200, createdVideo1);
    })

    it('should return 404 for not existing entity', async () => {
        await req
            .put(SETTINGS.PATH.VIDEOS + '/' + -100)
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    })

    it('Should not update an entity with incorrect input data.', async () => {
        const data = {
            title: '',
            author: '',
            availableResolutions: [],
            canBeDownloaded: 'test',
            minAgeRestriction: 20,
            publicationDate: 'test'
        }

        await req
            .put(SETTINGS.PATH.VIDEOS + '/' + createdVideo2!.id)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                errorsMessages: [
                    { message: 'error!!!', field: 'availableResolutions' },
                    { message: 'Invalid title.', field: 'title' },
                    { message: 'Invalid author name.', field: 'author' },
                    { message: 'An incorrect value range was passed.', field: 'minAgeRestriction' },
                    { message: 'Invalid date format.', field: 'publicationDate'},
                    { message: 'Invalid type passed.', field: 'canBeDownloaded'}
                ]
            })
    })

    it('Must update the entity with the correct input data.', async () => {
        const data = {
            title: 'Night show video',
            author: 'IT-KAMASUTRA',
            availableResolutions: ['P2160'],
            canBeDownloaded: false,
            minAgeRestriction: null,
            publicationDate: new Date().toISOString()
        }

        await req
            .put(SETTINGS.PATH.VIDEOS + '/' + createdVideo2!.id)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await req
            .get(SETTINGS.PATH.VIDEOS + '/' + createdVideo2!.id)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdVideo2,
                title: data.title,
                author: data.author,
                availableResolutions: data.availableResolutions,
                canBeDownloaded: data.canBeDownloaded,
                minAgeRestriction: data.minAgeRestriction,
                publicationDate: data.publicationDate
            })
    })

    it("Should not delete a non-existent entity.", async () => {
        await req
            .delete(SETTINGS.PATH.VIDEOS + '/' + -100)
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    })

    it('Must delete an existing entity.', async () => {
        await req
            .delete(SETTINGS.PATH.VIDEOS + '/' + createdVideo2!.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await req
            .delete(SETTINGS.PATH.VIDEOS + '/' + createdVideo1!.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(HTTP_STATUSES.OK_200, []);
    })
})