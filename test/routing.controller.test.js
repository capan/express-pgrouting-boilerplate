const supertest = require('supertest');

let app; let request;
describe('routing', () => {
    beforeEach(() => {
        app = require('../server');
        request = supertest(app);
    });
    it('should return 200 status', async (done) => {
        const res = await request.get('/api/getrouteposition/39.937/32.824/39.934/32.823');
        expect(res.status).toBe(200);
        done();
    });
    it('should return a valid json for given coordinates', async (done) => {
        const res = await request.get('/api/getrouteposition/39.937/32.824/39.934/32.823');
        let isValid;
        try {
            JSON.parse(res.body.data[0].st_asgeojson);
            isValid = true;
        } catch (err) {
            isValid = false;
        }
        expect(isValid).toBe(true);
        done();
    });
});
