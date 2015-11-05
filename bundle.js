/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var sp = __webpack_require__(1);

	var verts = [];

	verts = [[215,119],[161,229],[292,228],[438,230],[545,182],[666,202],[670,270],[672,371],[665,444],[583,452],[476,454],[286,445],[157,446],[148,351],[100,376],[313,643],[440,336],[538,241],[526,331],[573,361],[575,399]];

	var graph = {
		'0':{'1':1,'2':1},
		'1':{'0':1,'2':1,'13':1},
		'2':{'0':1,'1':1,'3':1},
		'3':{'2':1,'4':1,'16':1},
		'4':{'3':1,'5':1,'17':1},
		'5':{'4':1,'6':1},
		'6':{'5':1,'17':1,'7':1},
		'7':{'6':1,'8':1,'18':1},
		'8':{'7':1,'9':1},
		'9':{'10':1,'8':1},
		'10':{'9':1,'18':1,'11':1},
		'11':{'10':1,'15':1,'12':1},
		'12':{'11':1,'13':1},
		'13':{'12':1,'1':1,'14':1},
		'14':{'13':1},
		'15':{'11':1},
		'16':{'3':1,'18':1},
		'17':{'4':1,'6':1,'18':1},
		'18':{'17':1,'16':1,'7':1,'19':1,'20':1,'10':1},
		'19':{'18':1},
		'20':{'18':1}
	}

	// for (var i = 0; i < 50; i++) {
	// 	verts.push([800*Math.random(),800*Math.random()])
	// }

	for(var i in verts) {
	   console.log("Point " + i + " is " + verts[i]);
	}

	var canvas = document.getElementById('map');

	function drawNodes() {
		if (canvas.getContext) {
			var ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, 800, 800);
			for (var i = verts.length - 1; i >= 0; i--) {
				var vert = verts[i];
				ctx.beginPath();
				ctx.arc(vert[0],vert[1],3,0,Math.PI*2,true);
				ctx.stroke();
			}
		}
	}

	// Path mode
	drawNodes();
	var from = 5;
	var to = 15;
	console.log("Shortest path from " + from + " to " + to + " is:");

	//var path = sp.shortestPath(verts, from, to);
	var path = sp.shortestPath(graph, from, to);

	console.log(path);

	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');
		
		for (var i = 1; i<path.shortestPath.length; i++) {
			var last = verts[path.shortestPath[i-1]];
			var current = verts[path.shortestPath[i]];
			ctx.beginPath();
			ctx.moveTo(last[0],last[1]);
			ctx.lineWidth = 5;
			ctx.strokeStyle = 'red';
			ctx.lineTo(current[0],current[1]);
			ctx.stroke();
		}

	}

	// Edit mode
	// $('.container').click(function(e){
	// 	verts.push([e.offsetX,e.offsetY]);
	// 	console.log(JSON.stringify(verts));
	// 	drawNodes();
	// })

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var EuclideanMST = __webpack_require__(2)
	var Graph = __webpack_require__(9)

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

	exports.shortestPath = shortestPath2;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var EuclideanMST;
	var Delaunay = __webpack_require__(3);
	var Kruskal = __webpack_require__(7);

	(function() {
	  "use strict";

	  EuclideanMST = {
	    euclideanMST : function ( vertices, metric )
	    {

	      var tri = Delaunay.triangulate(vertices);

	      var edges = [];
	      var edge_seen = {};

	      for (var i=0; i<tri.length; i+=3)
	      {
	        var e = [ tri[i], tri[i+1], tri[i+2] ];
	        e.sort();

	        var a = e[0];
	        var b = e[1];
	        var c = e[2];

	        var key = "" + a + "," + b;
	        if ( !(key in edge_seen) )
	          edges.push( [a,b] );
	        edge_seen[key] = 1;

	        key = "" + b + "," + c;
	        if ( !(key in edge_seen) )
	          edges.push( [b,c] );
	        edge_seen[key] = 1;

	        key = "" + a + "," + c;
	        if ( !(key in edge_seen) )
	          edges.push( [a,c] );
	        edge_seen[key] = 1;

	      }

	      var mst = 
	        Kruskal.kruskal( 
	            vertices, 
	            edges, 
	            metric
	        );

	      return mst;

	    }

	  };

	  if ( true )
	    module.exports = EuclideanMST;
	})();




/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Barycentric = __webpack_require__(4),
	    Delaunay    = __webpack_require__(6);

	exports.triangulate = Delaunay.triangulate;
	exports.coordinates = Barycentric.coordinates;
	exports.contains    = Barycentric.contains;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Barycentric;

	(function() {
	  "use strict";

	  var M = typeof Matrix !== "undefined" ? Matrix : __webpack_require__(5);

	  Barycentric = {
	    coordinates: function(vertices, point) {
	      var n = point.length,
	          vector = new Array(n),
	          matrix = new Array(n * n),
	          i, j;

	      /* Sanity check the given simplex. */
	      if(vertices.length !== n + 1)
	        throw new Error("Invalid simplex.");

	      for(i = n + 1; i--; )
	        if(vertices[i].length !== n)
	          throw new Error("Invalid simplex.");

	      /* Set up our input vector and matrix. */
	      for(i = n; i--; ) {
	        vector[i] = point[i] - vertices[0][i];

	        for(j = n; j--; )
	          matrix[i * n + j] = vertices[j + 1][i] - vertices[0][i];
	      }

	      /* Compute the barycentric coordinates and return them. */
	      return M.multiply(M.invert(matrix), vector);
	    },
	    /* Barycentric.contains() is like coordinates(), above, except that it only
	     * returns the coordinates if the point is within the given simplex; if the
	     * point is outside, then null is returned. */
	    contains: function(vertices, point) {
	      var coordinates = Barycentric.coordinates(vertices, point),
	          sum = 0,
	          i;

	      for(i = coordinates.length; i--; ) {
	        if(coordinates[i] < 0.0)
	          return null;

	        sum += coordinates[i];
	      }

	      return sum <= 1.0 ? coordinates : null;
	    }
	  };

	  if(true)
	    module.exports = Barycentric;
	}());


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* This is a crappy, half-formed matrix library that only works in 2 or 3
	 * dimensions. It should be replaced with a real, grown-up matrix library. */

	var Matrix;

	(function() {
	  "use strict";

	  Matrix = {
	    determinant: function(matrix) {
	      switch(matrix.length) {
	        case 4:
	          return matrix[0] * matrix[3] - matrix[1] * matrix[2];

	        case 9:
	          return matrix[0] * (matrix[4] * matrix[8] - matrix[5] * matrix[7]) +
	                 matrix[1] * (matrix[5] * matrix[6] - matrix[3] * matrix[8]) +
	                 matrix[2] * (matrix[3] * matrix[7] - matrix[4] * matrix[6]) ;

	        default:
	          throw new Error("FIXME");
	      }
	    },
	    invert: function(matrix) {
	      var det = Matrix.determinant(matrix);

	      if(det === 0)
	        throw new Error("Cannot invert a matrix with a determinant of zero.");

	      switch(matrix.length) {
	        case 4:
	          return [
	             matrix[3] / det,
	            -matrix[1] / det,
	            -matrix[2] / det,
	             matrix[0] / det
	          ];

	        case 9:
	          return [
	            (matrix[4] * matrix[8] - matrix[5] * matrix[7]) / det,
	            (matrix[2] * matrix[7] - matrix[1] * matrix[8]) / det,
	            (matrix[1] * matrix[5] - matrix[2] * matrix[4]) / det,

	            (matrix[5] * matrix[6] - matrix[3] * matrix[8]) / det,
	            (matrix[0] * matrix[8] - matrix[2] * matrix[6]) / det,
	            (matrix[2] * matrix[3] - matrix[0] * matrix[5]) / det,

	            (matrix[3] * matrix[7] - matrix[4] * matrix[6]) / det,
	            (matrix[6] * matrix[1] - matrix[0] * matrix[7]) / det,
	            (matrix[0] * matrix[4] - matrix[1] * matrix[3]) / det
	          ];

	        default:
	          throw new Error("FIXME");
	      }
	    },
	    multiply: function(a, b) {
	      var n, c, i, j;

	      /* Matrix times matrix. */
	      if(a.length === b.length)
	        throw new Error("FIXME");

	      /* Matrix times column vector. */
	      else if(a.length === b.length * b.length) {
	        n = b.length;
	        c = new Array(n);

	        for(i = n; i--; ) {
	          c[i] = 0;

	          for(j = n; j--; )
	            c[i] += a[i * n + j] * b[j];
	        }

	        return c;
	      }

	      else
	        throw new Error("Matrix mismatch.");
	    }
	  };

	  if(true)
	    module.exports = Matrix;
	}());


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* This is a JavaScript implementation of Delaunay triangulation. Ideally, it
	 * would function in any number of dimensions; the only restriction is in
	 * calculating the circumsphere of a simplex, and I can't seem to find the
	 * algorithm to do it. As such, this code currently just works in 2 or 3
	 * dimensions.
	 * 
	 * The theory behind Delaunay triangulation can be found here:
	 * 
	 * http://paulbourke.net/papers/triangulate/ */

	var Delaunay;

	(function() {
	  "use strict";

	  var M = typeof Matrix !== "undefined" ? Matrix : __webpack_require__(5),
	      Simplex = function(indices, vertices, n) {
	        var list = new Array(indices.length),
	            i;

	        for(i = list.length; i--; )
	          list[i] = vertices[indices[i]];

	        this.vertices = indices;
	        this.center   = Delaunay.circumcenter(list, n);
	        this.radius   = Delaunay.distanceSquared(this.center, list[0], n);
	      };

	  Simplex.prototype = {
	    passed: function(vertex, n) {
	      var d = vertex[0] - this.center[0];
	      return d > 0.0 && d * d > this.radius;
	    },
	    contains: function(vertex, n) {
	      return Delaunay.distanceSquared(this.center, vertex, n) <= this.radius;
	    },
	    /* FIXME: This can be done more efficiently, since the vertices are already
	     * in sorted order, there's no need to do another sort. Just iterate every
	     * array formed by removing one vertex. */
	    addEdges: function(n, edges) {
	      var edge, i, j;

	      for(i = n + 1; i--; ) {
	        edge = new Array(n);

	        for(j = n; j--; )
	          edge[j] = this.vertices[(i + j) % this.vertices.length];

	        edge.sort();
	        edges.push(edge);
	      }
	    }
	  };

	  Delaunay = {
	    resolve: function(obj, key) {
	      var i;

	      if(key !== undefined) {
	        if(Array.isArray(key))
	          for(i = 0; obj !== undefined && i !== key.length; ++i)
	            obj = obj[key[i]];

	        else if(obj !== undefined)
	          obj = obj[key];
	      }

	      return obj;
	    },
	    dimensions: function(vertices) {
	      var d = 0,
	          i = vertices.length;

	      if(i) {
	        d = vertices[--i].length;

	        while(i--)
	          if(vertices[i].length < d)
	            d = vertices[i].length;
	      }

	      return d;
	    },
	    /* Return the bounding box (two vertices) enclosing each given vertex. */
	    boundingBox: function(vertices, n) {
	      var min = new Array(n),
	          max = new Array(n),
	          i, j, pos;

	      /* Given some objects, find the bounding box of those objects. */
	      if(vertices.length) {
	        for(j = n; j--; ) {
	          min[j] = Number.POSITIVE_INFINITY;
	          max[j] = Number.NEGATIVE_INFINITY;
	        }

	        for(i = vertices.length; i--; ) {
	          pos = vertices[i];

	          for(j = n; j--; ) {
	            if(pos[j] < min[j])
	              min[j] = pos[j];

	            if(pos[j] > max[j])
	              max[j] = pos[j];
	          }
	        }
	      }

	      /* No points? Well then, you get a degenerate bounding box. Dumbface. */
	      else
	        for(j = n; j--; ) {
	          min[j] = 0;
	          max[j] = 0;
	        }

	      return [min, max];
	    },
	    boundingSimplex: function(vertices, n) {
	      var box = Delaunay.boundingBox(vertices, n),
	          min = box[0],
	          max = box[1],
	          simplex = new Array(n + 1),
	          i, j, w, pos;

	      /* Scale up the bounding box. FIXME: This is something of a fudge, in
	       * order to make all triangles formed against the super triangle super
	       * long and skinny, so that the triangles will be formed against the hull
	       * of shapes, instead. That's kludgy. It'd be better to make the
	       * algorithm as a whole robust against that kind of silliness. */
	      for(j = n; j--; ) {
	        w = 2048 + max[j] - min[j];
	        min[j] -= w * 1;
	        max[j] += w * 3;
	      }

	      /* The first vertex is just the minimum vertex of the bounding box. */
	      simplex[0] = min;

	      /* Every subsequent vertex is the max along that axis. */
	      for(i = n; i--; ) {
	        pos = simplex[1 + i] = new Array(n);

	        for(j = n; j--; )
	          pos[j] = (i !== j ? min : max)[j];
	      }

	      /* Return the simplex. */
	      return simplex;
	    },
	    bisectors: function(vertices, n) {
	      var m = n + 1,
	          matrix = new Array(m * n),
	          i, j, a, b, c;

	      for(i = n; i--; ) {
	        a = vertices[i + 0];
	        b = vertices[i + 1];
	        c = 0;

	        for(j = n; j--; )
	          c += (a[j] + b[j]) * (matrix[i * m + j] = a[j] - b[j]);

	        matrix[i * m + n] = c * -0.5;
	      }

	      return matrix;
	    },
	    cross: function(matrix, n) {
	      if(matrix.length !== n * n + n)
	        throw new Error("Invalid matrix shape.");

	      var m = n + 1,
	          sgn = 1,
	          vec = new Array(m),
	          sq  = new Array(n * n),
	          i, j, k;

	      for(i = 0; i !== m; ++i) {
	        /* If it's the first time through the loop, initialize the square
	         * matrix to hold every column but the first. */
	        if(i === 0)
	          for(j = n; j--; )
	            for(k = n; k--; )
	              sq[j * n + k] = matrix[j * m + k + 1];

	        /* Every other time, just replace the one column that's no longer
	         * relevant. */
	        else {
	          k = i - 1;
	          for(j = n; j--; )
	            sq[j * n + k] = matrix[j * m + k];
	        }

	        vec[i] = sgn * M.determinant(sq);
	        sgn    = -sgn;
	      }

	      return vec;
	    },
	    /* FIXME: This should probably test the points for collinearity and use a
	     * different algorithm in that case, in order to improve robustness. */
	    circumcenter: function(vertices, n) {
	      if(vertices.length !== n + 1)
	        throw new Error("A " + n + "-simplex requires " + (n + 1) + " vertices.");

	      /* Find the position of the circumcenter in homogeneous coordinates. */
	      var matrix = Delaunay.bisectors(vertices, n),
	          center = Delaunay.cross(matrix, n),
	          j;

	      /* Convert into Euclidean coordinates. */
	      for(j = n; j--; )
	        center[j] /= center[n];

	      center.length = n;

	      /* Return the results. */
	      return center;
	    },
	    distanceSquared: function(a, b, n) {
	      var d = 0,
	          i, t;

	      for(i = n; i--; ) {
	        t  = b[i] - a[i];
	        d += t * t;
	      }

	      return d;
	    },
	    distance: function(a, b, n) {
	      return Math.sqrt(Delaunay.distanceSquared(a, b, n));
	    },
	    isSameEdge: function(a, b) {
	      var i;

	      if(a.length !== b.length)
	        return false;

	      for(i = a.length; i--; )
	        if(a[i] !== b[i])
	          return false;

	      return true;
	    },
	    /* FIXME: By using a set data structure, this can be made O(n log n). */
	    removeDuplicateEdges: function(edges) {
	      var i, j;

	      for(i = edges.length; i--; )
	        for(j = i; j--; )
	          if(Delaunay.isSameEdge(edges[i], edges[j])) {
	            edges.splice(i, 1);
	            edges.splice(j, 1);
	            --i;
	            break;
	          }
	    },
	    triangulate: function(objects, key) {
	      var v = objects.length,
	          i, j;

	      /* Resolve all objects, so we never have to do it again. */
	      objects = objects.slice(0);
	      for(i = objects.length; i--; )
	        objects[i] = Delaunay.resolve(objects[i], key);

	      /* Get the dimensionality of the objects. */
	      var n = Delaunay.dimensions(objects);

	      if(n < 2 || n > 3)
	        throw new Error("The Delaunay module currently only supports 2D or 3D data.");

	      /* Sort the objects on an axis so we can get O(n log n) behavior. Sadly,
	       * we also need to keep track of their original position in the array, so
	       * we wrap the objects to track that and then unwrap them again. */
	      for(i = objects.length; i--; )
	        objects[i] = {index: i, position: objects[i]};

	      /* FIXME: It'd be better to sort on the longest axis, rather than on an
	       * arbitrary axis, since it'll lower the constant factor. */
	      objects.sort(function(a, b) { return b.position[0] - a.position[0]; });

	      var indices = new Array(objects.length);

	      for(i = objects.length; i--; ) {
	        indices[i] = objects[i].index;
	        objects[i] = objects[i].position;
	      }

	      /* Add the vertices of the bounding simplex to the object list. It's okay
	       * that these vertices aren't sorted like the others, since they're never
	       * going to be iterated over. */
	      Array.prototype.push.apply(
	        objects,
	        Delaunay.boundingSimplex(objects, n)
	      );

	      /* Initialize the simplex list to the bounding simplex. */
	      var list = new Array(n + 1);

	      for(i = list.length; i--; )
	        list[i] = v + i;

	      var open   = [new Simplex(list, objects, n)],
	          closed = [],
	          edges  = [];

	      for(i = v; i--; edges.length = 0) {
	        for(j = open.length; j--; ) {
	          /* If this vertex is past the simplex, then we're never going to
	           * intersect it again, so remove it from the open list and move it to
	           * the closed list. */
	          if(open[j].passed(objects[i], n)) {
	            closed.push(open[j]);
	            open.splice(j, 1);
	          }

	          /* Otherwise, if the simplex contains the vertex, it needs to get
	           * split apart. */
	          else if(open[j].contains(objects[i], n)) {
	            open[j].addEdges(n, edges);
	            open.splice(j, 1);
	          }
	        }

	        Delaunay.removeDuplicateEdges(edges);

	        for(j = edges.length; j--; ) {
	          edges[j].unshift(i);
	          open.push(new Simplex(edges[j], objects, n));
	        }
	      }

	      /* Move all open simplices into the closed list. */
	      Array.prototype.push.apply(closed, open);
	      open.length = 0;

	      /* Build and return the final list of simplex vertex indices. */
	      list.length = 0;

	      simplex: for(i = closed.length; i--; ) {
	        /* If any of the vertices are from the bounding simplex, skip adding
	         * this simplex to the output list. */
	        for(j = closed[i].vertices.length; j--; )
	          if(closed[i].vertices[j] >= v)
	            continue simplex;

	        for(j = 0; j < closed[i].vertices.length; j++)
	          list.push(indices[closed[i].vertices[j]]);
	      }

	      return list;
	    }
	  };

	  /* If we're in Node, export our module as a Node module. */
	  if(true)
	    module.exports = Delaunay;
	}());


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Kruskal;

	var MakeSet  = __webpack_require__(8);

	(function() {
	  "use strict";

	  // vertices hold data that will be used in the distance 'metric' function
	  // edges holds position in vertices list
	  //
	  Kruskal = {
	    kruskal: function( vertices, edges, metric )
	    {
	      var set = {};

	      var finalEdge = [];

	      var forest = new MakeSet( vertices.length );

	      var edgeDist = [];
	      for (var ind in edges)
	      {
	        var u = edges[ind][0];
	        var v = edges[ind][1];
	        var e = { edge: edges[ind], weight: metric( vertices[u], vertices[v] ) };
	        edgeDist.push(e);
	      }

	      edgeDist.sort( function(a, b) { return a.weight- b.weight; } );

	      for (var i=0; i<edgeDist.length; i++)
	      {
	        var u = edgeDist[i].edge[0];
	        var v = edgeDist[i].edge[1];

	        if ( forest.find(u) != forest.find(v) )
	        {
	          finalEdge.push( [ u, v ] );
	          forest.link( u, v );
	        }
	      }

	      return finalEdge;

	    }
	  }

	  if (true)
	    module.exports = Kruskal;

	})();





/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict"; "use restrict";

	module.exports = UnionFind;

	function UnionFind(count) {
	  this.roots = new Array(count);
	  this.ranks = new Array(count);
	  
	  for(var i=0; i<count; ++i) {
	    this.roots[i] = i;
	    this.ranks[i] = 0;
	  }
	}

	UnionFind.prototype.length = function() {
	  return this.roots.length;
	}

	UnionFind.prototype.makeSet = function() {
	  var n = this.roots.length;
	  this.roots.push(n);
	  this.ranks.push(0);
	  return n;
	}

	UnionFind.prototype.find = function(x) {
	  var roots = this.roots;
	  while(roots[x] !== x) {
	    var y = roots[x];
	    roots[x] = roots[y];
	    x = y;
	  }
	  return x;
	}

	UnionFind.prototype.link = function(x, y) {
	  var xr = this.find(x)
	    , yr = this.find(y);
	  if(xr === yr) {
	    return;
	  }
	  var ranks = this.ranks
	    , roots = this.roots
	    , xd    = ranks[xr]
	    , yd    = ranks[yr];
	  if(xd < yd) {
	    roots[xr] = yr;
	  } else if(yd < xd) {
	    roots[yr] = xr;
	  } else {
	    roots[yr] = xr;
	    ++ranks[xr];
	  }
	}



/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	const Queue = __webpack_require__(10)
	const populateMap = __webpack_require__(11)

	class Graph {

	  /**
	   * Constrict the graph
	   *
	   * @param {object} [graph] - Nodes to initiate the graph with
	   */
	  constructor (graph) {
	    this.graph = new Map()

	    if (graph) populateMap(this.graph, graph, Object.keys(graph))
	  }

	  /**
	   * Add a node to the graph
	   *
	   * @param {string} name      - Name of the node
	   * @param {object} neighbors - Neighbouring nodes and cost to reach them
	   */
	  addNode (name, neighbors) {
	    let _neighbors = new Map()

	    populateMap(_neighbors, neighbors, Object.keys(neighbors))
	    this.graph.set(name, _neighbors)

	    return this
	  }

	  /**
	   * Alias of addNode
	   */
	  addVertex () {
	    console.log('Graph#addVertex is deprecated, use Graph#addNode instead')

	    return this.addNode.apply(this, arguments)
	  }

	  /**
	   * Compute the shortest path between the specified nodes
	   *
	   * @param {string}  start     - Starting node
	   * @param {string}  goal      - Node we want to reach
	   * @param {object}  [options] - Options
	   *
	   * @param {boolean} [options.trim]    - Exclude the origin and destination nodes from the result
	   * @param {boolean} [options.reverse] - Return the path in reversed order
	   * @param {boolean} [options.cost]    - Also return the cost of the path when set to true
	   *
	   * @return {array|object} Computed path between the nodes.
	   *  When `option.cost` is set to true, the returned value will be an object
	   *  with keys:
	   *
	   *    - `Array path`: Computed path between the nodes
	   *    - `Number cost`: Cost of the path
	   */
	  path (start, goal, options) {
	    options = options || {}

	    // Don't run when we don't have nodes set
	    if (!this.graph.size) {
	      if (options.cost) return { path: null, cost: 0 }

	      return null
	    }

	    let explored = new Set()
	    let frontier = new Queue()
	    let previous = new Map()

	    let path = []
	    let totalCost = 0

	    // Add the starting point to the frontier, it will be the first node visited
	    frontier.set(start, 0)

	    // Run until we have visited every node in the frontier
	    while (!frontier.isEmpty()) {
	      // Get the node in the frontier with the lowest cost (`priority`)
	      let node = frontier.next()

	      // When the node with the lowest cost in the frontier in our goal node,
	      // we can compute the path and exit the loop
	      if (node.key === goal) {
	        // Set the total cost to the current value
	        totalCost = node.priority

	        let _nodeKey = node.key
	        while (previous.has(_nodeKey)) {
	          path.push(_nodeKey)
	          _nodeKey = previous.get(_nodeKey)
	        }

	        break
	      }

	      // Add the current node to the explored set
	      explored.add(node.key)

	      // Loop all the neighboring nodes
	      let neighbors = this.graph.get(node.key) || new Map()
	      neighbors.forEach(function (_cost, _node) {
	        // If we already explored the node, skip it
	        if (explored.has(_node)) return false

	        // If the neighboring node is not yet in the frontier, we add it with
	        // the correct cost
	        if (!frontier.has(_node)) {
	          previous.set(_node, node.key)
	          return frontier.set(_node, node.priority + _cost)
	        }

	        var frontierPriority = frontier.get(_node).priority
	        var nodeCost = node.priority + _cost

	        // Othewhise we only update the cost of this node in the frontier when
	        // it's below what's currently set
	        if (nodeCost < frontierPriority) {
	          previous.set(_node, node.key)
	          frontier.set(_node, nodeCost)
	        }
	      })
	    }

	    // Return null when no path can be found
	    if (!path.length) {
	      if (options.cost) return { path: null, cost: 0 }

	      return null
	    }

	    // From now on, keep in mind that `path` is populated in reverse order,
	    // from destination to origin

	    // Remove the first value (the goal node) if we want a trimmed result
	    if (options.trim) {
	      path.shift()
	    } else {
	      // Add the origin waypoint at the end of the array
	      path = path.concat([ start ])
	    }

	    // Reverse the path if we don't want it reversed, so the result will be
	    // from `start` to `goal`
	    if (!options.reverse) {
	      path = path.reverse()
	    }

	    // Return an object if we also want the cost
	    if (options.cost) {
	      return {
	        path: path,
	        cost: totalCost
	      }
	    }

	    return path
	  }

	  /**
	   * Alias of `path`
	   */
	  shortestPath () {
	    console.log('Graph#shortestPath is deprecated, use Graph#path instead')

	    return this.path.apply(this, arguments)
	  }

	}

	module.exports = Graph


/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict'

	class PriorityQueue {

	  /**
	   * Creates a new queue:
	   */
	  constructor () {
	    this._keys = new Set()
	    this._queue = []
	  }

	  /**
	   * Sort the queue to oderd them based on the priority
	   *
	   * @private
	   */
	  _sort () {
	    this._queue.sort(function (a, b) {
	      return a.priority - b.priority
	    })
	  }

	  /**
	   * Add or update the priority of a key
	   *
	   * @param {any}    key      - Key to insert
	   * @param {number} priority - Priority of the key
	   *
	   * @return {nunber} Size of the queue
	   */
	  set (key, priority) {
	    priority = Number(priority)
	    if (isNaN(priority)) {
	      throw new TypeError('"priority" must be a valid number')
	    }

	    if (!this._keys.has(key)) {
	      // If the `_keys` set does not have this key, we are inserting a new one
	      this._keys.add(key)
	      this._queue.push({ key, priority })
	    } else {
	      // Update the priority of an existing key
	      this._queue.map(function (element) {
	        if (element.key === key) {
	          element.priority = priority
	        }

	        return element
	      })
	    }

	    this._sort()

	    return this._queue.length
	  }

	  /**
	   * Remove the first element from the priority queue and returns it
	   *
	   * @return {object} The object as of the priority queue
	   */
	  next () {
	    const element = this._queue.shift()

	    // Remove the key from the `_keys` set
	    this._keys.delete(element.key)

	    return element
	  }

	  /**
	   * Return true if the queue is empty
	   *
	   * @return {boolean}
	   */
	  isEmpty () {
	    return Boolean(!this._queue.length)
	  }

	  /**
	   * Returns true if the queue contains the specified key
	   *
	   * @param {any} key - Key to check
	   * @return {boolean}
	   */
	  has (key) {
	    return this._keys.has(key)
	  }

	  /**
	   * Return the priority for a key
	   *
	   * @param {string} key - The key to search
	   */
	  get (key) {
	    let result
	    this._queue.forEach(function (element) {
	      if (element.key === key) result = element
	    })

	    return result
	  }

	}

	module.exports = PriorityQueue


/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict'

	/**
	 * Assert that the cost is a positive number
	 *
	 * @private
	 * @param {number} cost - The cost to validate
	 * @return {number}
	 */
	function validateNode (cost) {
	  let _cost = Number(cost)

	  if (isNaN(_cost)) {
	    throw new TypeError(`Cost must be a number, istead got ${cost}`)
	  }

	  if (_cost <= 0) {
	    throw new TypeError(`The cost must be a number above 0, instead got ${cost}`)
	  }

	  return _cost
	}

	/**
	 * Populate a map with the values of an object with nested maps
	 *
	 * @param {Map}    map    - Map to populate
	 * @param {object} object - Object to use for the population
	 * @param {array}  keys   - Array of keys of the object
	 *
	 * @return {Map} Populated map
	 */
	function populateMap (map, object, keys) {
	  // Return the map once all the keys have been populated
	  if (!keys.length) return map

	  let key = keys.shift()
	  let value = object[key]

	  if (value !== null && typeof value === 'object') {
	    // When value is an object, we transform every key of it into a map
	    value = populateMap(new Map(), value, Object.keys(value))
	  } else {
	    // Ensure the node is a positive number
	    value = validateNode(value)
	  }

	  // Set the value into the map
	  map.set(key, value)

	  // Recursive call
	  return populateMap(map, object, keys)
	}

	module.exports = populateMap


/***/ }
/******/ ]);