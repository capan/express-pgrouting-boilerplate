const db = require('../db');

const getRoutePosition = async (req, res) => {
    console.log(`getRoutePosition  ${req.params.startlatitude}, ${req.params.startlongitude}, 
        ${req.params.finishlatitude}, ${req.params.finishlongitude}`);

    try {
        const values = [];
        values.push(req.params.startlatitude); values.push(req.params.startlongitude);
        values.push(req.params.finishlatitude); values.push(req.params.finishlongitude);
        const queryString = `SELECT ST_AsGeoJSON(ST_Union((the_geom))) FROM ways WHERE id in
								(SELECT edge FROM pgr_dijkstra(
								'SELECT id,
								 source,
								 target,
								 length AS cost
								FROM ways',
								(SELECT id FROM ways_vertices_pgr
								ORDER BY the_geom <-> ST_SetSRID(ST_Point(${values[1]} ,${values[0]}), 4326) LIMIT 1), 
								(SELECT id FROM ways_vertices_pgr
								ORDER BY the_geom <-> ST_SetSRID(ST_Point(${values[3]} ,${values[2]}), 4326) LIMIT 1),
								directed := true) foo)`;
        const { rows } = await db.query(queryString, []);
        res.status(200).json({
            status: 'success',
            data: rows,
        });
    } catch (err) {
        console.error(`GET api/cemetery/getroute/:latitude/:longitude ${err.stack}`);
        res.status(400).json({
            status: 'error',
            data: err.stack,
        });
    }
};
exports.getRoutePosition = getRoutePosition;
