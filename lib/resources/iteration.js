/*
    Source, Iteration resource structure:
    https://www.pivotaltracker.com/help/api/rest/v5#iteration_resource
*/

var ptutil = require('./utils');

function Iteration(data) {
    
    if (!(this instanceof Iteration)){
        return new Iteration(data);
    }
    
    data = data || {};
    
    var _kind = null,
        _projectId = null,
        _number = null,
        _teamStrength = null,
        _length = null,
        _planned = null,
        _storyIds = null,
        _stories = null,
        _start = null,
        _finish = null;
    
    Object.defineProperties(this, {
        
        "kind": {
            enumerable: true,
            configurable: false,
            get: function(val) {
                return _kind;
            },
            set: function(val) {
                _kind = ptutil.stringOrNull(val);
            }
        },
        "number": {
            enumerable: true,
            configurable: false,
            get: function(val) {
                return _number;
            },
            set: function(val) {
                _number = ptutil.intOrNull(val);
            }
        },
        "projectId": {
            enumerable: true,
            configurable: false,
            get: function(val) {
                return _projectId;
            },
            set: function(val) {
                _projectId = ptutil.intOrNull(val);
            }
        },
        "teamStrength": {
            enumerable: true,
            configurable: false,
            get: function(val) {
                return _teamStrength;
            },
            set: function(val) {
                _teamStrength = ptutil.floatOrNull(val);
            }
        },
        "length": {
            enumerable: true,
            configurable: false,
            get: function(val) {
                return _length;
            },
            set: function(val) {
                _length = ptutil.intOrNull(val);
            }
        },
        "planned": {
            enumerable: true,
            configurable: false,
            get: function(val) {
                return _planned;
            },
            set: function(val) {
                _planned = ptutil.booleanOrNull(val);
            }
        },
        "storyIds": {
            enumerable: true,
            configurable: false,
            get: function(val) {
                return _storyIds;
            },
            set: function(val) {
                _storyIds = ptutil.arrayOrNull(val);
            }
        },
        "stories": {
            enumerable: true,
            configurable: false,
            get: function(val) {
                return _stories;
            },
            set: function(val) {
                _stories = ptutil.arrayOrNull(val);
            }
        },
        "start": {
            enumerable: true,
            configurable: false,
            get: function(val) {
                return _start;
            },
            set: function(val) {
                _start = ptutil.dateOrNull(val);
            }
        },
        "finish": {
            enumerable: true,
            configurable: false,
            get: function(val) {
                return _finish;
            },
            set: function(val) {
                _finish = ptutil.dateOrNull(val);
            }
        }
    });
    
    Object.seal(this);
    
    for (var key in data) {
        if (data.hasOwnProperty(key) && this.hasOwnProperty(key)) {
            this[key] = data[key];
        }
    }
}

Iteration.prototype.toString = function() {
    return '[Object Iteration (Number: '+(this.number || 'None')+')]';
};

function Service(config, projectId) {
    
    if (!(this instanceof Service)){
        return new Service(config, projectId);
    }
    
    config = config || {};

    Object.defineProperties(this, {
        
        "config": {
            enumerable: true,
            configurable: false,
            writable: false,
            value: config
        },
        "projectId": {
            enumerable: true,
            configurable: false,
            writable: false,
            value: ptutil.intOrNull(projectId)
        }
    });
    
    Object.seal(this);
}

Service.prototype.all = function(cb) { // cb(err, tasks[])
    var err = this.configError();
    if (err) {
        cb(err, null);
    }
    else {
       ptutil.api.get(
            this.config.trackerToken,
            this.pathSegments(),
            null, // query
            null, // options
            function(error, res) {
                _callbackWithIterations(error, res, cb);
            });
    }
};

Service.prototype.pathSegments = function() {
    /*
    
    /projects/{project_id}/iterations
    
    */
    return ['projects',this.projectId,'iterations'];
};

Service.prototype.configError = function() {
    if (typeof this.projectId !== 'number') {
        return new Error('Invalid project ID');
    }
    else {
        return null;
    }
};

function _callbackWithIterations(error, res, cb) {
    if (error) {
        cb(error, null);
    }
    else if (!res || !res.data) {
        cb(error, null);
    }
    else if (!Array.isArray(res.data) || !res.data.length) {
        cb(null, []);
    }
    else {
        var arr = [];
        res.data.forEach(function(ele) {
            arr.push(new Iteration(ele));
        });
        cb(null, arr);
    }
}

module.exports = {
    Service : Service,
    Iteration : Iteration
};