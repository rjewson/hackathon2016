var EuclideanMST = require("euclideanmst")
var Graph = require('node-dijkstra')

function distance_metric(a,b) 
{
  return (a[0]-b[0])*(a[0]-b[0]) + (a[1]-b[1])*(a[1]-b[1]); 
}

function add(array, u, v, dist ) {
        if(typeof array[u] === 'undefined') {
                array[u] = {};
        }
        array[u][v]=dist;
}

function shortestPath(verts, from, to) {
// This API returns edges as unordered pairs [(0,1), (3,4), (0,2)]
var edges = EuclideanMST.euclideanMST( verts, distance_metric  );

// Take the MST edges and denormalize them so they suit the shortest path API input format
// Denormalized format: {parentVertex, {vertex1:dist, vertex2:dist... vertexN:dist}}
// Note: this library seems very picky about receiving vertex indexes as strings - numbers will not work.

var denormalizedEdges = {};
for (var e in edges) {
    // Convert to string to appease library..
    var u = edges[e][0] + '';
    var v = edges[e][1] + '';
    var dist = parseInt(distance_metric(verts[u], verts[v]) * 100 + 1, 10);

    // Store parent->child and vice versa
    add(denormalizedEdges, u, v, dist);
    add(denormalizedEdges, v, u, dist);
}

// Convert the denormalized edges to the format the shortest path library needs
var route = new Graph();
for(var e in denormalizedEdges) {
   route.addNode(e, denormalizedEdges[e]); 
}

var shortestPath = route.path(from+'', to+'')

return {shortestPath:shortestPath,denormalizedEdges:denormalizedEdges};

//printEdge( verts, edges );
}

function shortestPath2(denormalizedEdges, from, to) {
    var route = new Graph();
    for(var e in denormalizedEdges) {
       route.addNode(e, denormalizedEdges[e]); 
    }

    var shortestPath = route.path(from+'', to+'')

    return {shortestPath:shortestPath,denormalizedEdges:denormalizedEdges};
}

function sortByDist(a, b) {
  return a.dist - b.dist;
}

function pathToNavigate(graph, verts, selectedPoints, position) {
  var sortedPath=[];
  // Calculate total distance from position to each selected point
  for(var point in selectedPoints) {
     var res = shortestPath2(graph, position, selectedPoints[point]);
     var path = res.shortestPath;
     var dist = 0;
     for(var p in path) {
       if(p > 0) {
         //console.log("path[p-1]=" + verts[path[p-1]] + ", verts[path[p]]=" + verts[path[p]]);
         dist += distance_metric(verts[path[p-1]], verts[path[p]]);
       }
     }
     console.log("Distance from " + position + " to " + selectedPoints[point] + ": " + dist);
     //console.log(path);
     console.log("-------");
     sortedPath.push({point:selectedPoints[point], dist:dist});
  }

  sortedPath.sort(sortByDist);
  return orderedShortestPath(sortedPath, graph);
}

function orderedShortestPath(points, graph) {
   var path=[];
   for(var point in points) {
      if(point > 0) {
         var res = shortestPath2(graph, points[point-1].point, points[point].point);
         if(point > 1) {
            res.shortestPath.splice(0,1);
         }
         path = path.concat(res.shortestPath);
      }
   }
   return path;
}

exports.shortestPath = shortestPath2;
exports.distance_metric = distance_metric;
exports.pathToNavigate = pathToNavigate;
