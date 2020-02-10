![alt text](https://raw.githubusercontent.com/capan/express-pgrouting-boilerplate/master/yazi.jpg)
Node.js (express) Backend Boilerplate for Routing Applications
==============================================
A boilerplate for pgRouting applications.

[![CircleCI](https://david-dm.org/capan/express-pgrouting-boilerplate.svg)]()

This repository is intended to provide a basis for routing applications.

If you already have a routing database you can jump to [Installation](#installation), otherwise to setup a routing database follow the steps on [Getting Started](#getting-started).

Prerequisites
-------------
- [PostgreSQL](https://www.postgresql.org/)
- [Node.js](https://nodejs.org/en/)
- **Optional** : [Postman](https://www.postman.com/) 

Getting Started
---------------

> 1) Download OpenStreetMap(OSM) Data
You can use the options below;
* [Using tools on OSM web site.](https://www.openstreetmap.org/export#map=14/39.8711/32.7929)
* [Using OverpassTurbo API.](https://overpass-turbo.eu/)
* [OSM API](https://wiki.openstreetmap.org/wiki/API_v0.6#Retrieving_map_data_by_bounding_box:_GET_.2Fapi.2F0.6.2Fmap)
> 2) Transfer Downloaded Data to the PostgreSQL
You can use [**osm2pgrouting**](https://github.com/pgRouting/osm2pgrouting) to transfer osm data into PostgreSQL. But first create a database and make sure you have run the following commands;
```shell
CREATE EXTENSION postgis;
CREATE EXTENSION pgRouting;
```
Then use the osm2pgrouting command
```shell
osm2pgrouting -d routing_db -U postgres -h localhost -p 5432 -W pass -f map.osm -c “your\path\to\mapconfig.xml” — clean
```
> 3) Testing Imported Data
Before testing the imported data use the following SQL command to change **gid** column of ways table to **id**.
```shell
ALTER TABLE ways RENAME gid TO id
```
Then analyze data using two commands below by running them individually;
```shell
SELECT pgr_analyzeGraph('ways', 0.000001);


SELECT pgr_analyzeOneway('ways',
            ARRAY['', 'B', 'TF'],
            ARRAY['', 'B', 'FT'],
            ARRAY['', 'B', 'FT'],
            ARRAY['', 'B', 'TF']);
```
Results should be **OK**.

Now you can test the data against a real routing query;
```shell
SELECT ST_AsGeoJSON(ST_Union((the_geom))) FROM ways WHERE id in
(SELECT edge FROM pgr_dijkstra(
 'SELECT id,
 source,
 target,
 length AS cost
 FROM ways',
 (SELECT id FROM ways_vertices_pgr
 ORDER BY the_geom <-> ST_SetSRID(ST_Point(32.824, 39.937), 4326) LIMIT 1), 
 (SELECT id FROM ways_vertices_pgr
 ORDER BY the_geom <-> ST_SetSRID(ST_Point(32.823, 39.934), 4326) LIMIT 1),
 directed := true) foo);
```
This query should return a valid geojson.

Installation
------------
Just clone the project and change env. file to connect your database.
> Clone the project 
```shell
$ git clone https://github.com/capan/express-pgrouting-boilerplate.git
```
