/*
    Source, Epic resource structure:
    https://www.pivotaltracker.com/help/api/rest/v5#epic_resource
*/

var activity = require('./activity'),
    comment = require('./comment'),
    label = require('./label'),
    ptutil = require('./utils');

function Epic(data) {
    
    if (!(this instanceof Epic)){
        return new Epic(data);
    }
    
    data = data || {};
    
    var _kind = null,
        _id = null,
        _name = null,
        _url = null,
        _projectId = null,
        _beforeId = null,
        _afterId = null,
        _labelId = null,
        _label = null,
        _createdAt = null,
        _updatedAt = null,
        _commentIds = null,
        _comments = null;
    
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
        "id": {
            enumerable: true,
            configurable: false,
            get: function(val) {
                return _id;
            },
            set: function(val) {
                _id = ptutil.intOrNull(val);
            }
        },
        "name": {
            enumerable: true,
            configurable: false,
            get: function(val) {
                return _name;
            },
            set: function(val) {
                _name = ptutil.stringOrNull(val);
            }
        },
        "url": {
            enumerable: true,
            configurable: false,
            get: function(val) {
                return _url;
            },
            set: function(val) {
                _url = ptutil.stringOrNull(val);
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
        "beforeId": {
            enumerable: true,
            configurable: false,
            get: function(val) {
                return _beforeId;
            },
            set: function(val) {
                _beforeId = ptutil.intOrNull(val);
            }
        },
        "afterId": {
            enumerable: true,
            configurable: false,
            get: function(val) {
                return _afterId;
            },
            set: function(val) {
                _afterId = ptutil.intOrNull(val);
            }
        },
        "createdAt": {
            enumerable: true,
            configurable: false,
            get: function(val) {
                return _createdAt;
            },
            set: function(val) {
                _createdAt = ptutil.dateOrNull(val);
            }
        },
        "updatedAt": {
            enumerable: true,
            configurable: false,
            get: function(val) {
                return _updatedAt;
            },
            set: function(val) {
                _updatedAt = ptutil.dateOrNull(val);
            }
        },
        "description": {
            enumerable: true,
            configurable: false,
            get: function(val) {
                return _description;
            },
            set: function(val) {
                _description = ptutil.intOrNull(val);
            }
        },
        "labelId": {
            enumerable: true,
            configurable: false,
            get: function(val) {
                return _labelId;
            },
            set: function(val) {
                _labelId = ptutil.intOrNull(val);
            }
        },
        "label": {
            enumerable: true,
            configurable: false,
            get: function(val) {
                return _label;
            },
            set: function(val) {
                _label = ptutil.objOrNull(val);
            }
        },
        "commentIds": {
            enumerable: true,
            configurable: false,
            get: function(val) {
                return _commentIds;
            },
            set: function(val) {
                _commentIds = ptutil.arrayOrNull(val);
            }
        },
        "comments": {
            enumerable: true,
            configurable: false,
            get: function(val) {
                return _comments;
            },
            set: function(val) {
                _comments = ptutil.arrayOrNull(val);
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

Epic.prototype.toString = function() {
    return '[Object Epic (ID: '+(this.id || 'None')+')]';
};

function Service(config, projectId, epicId) {
    
    if (!(this instanceof Service)){
        return new Service(config, projectId, epicId);
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
        },
        "epicId": {
            enumerable: true,
            configurable: false,
            writable: true,
            value: ptutil.intOrNull(epicId)
        },
        "activity": {
            enumerable: true,
            set: function(){},
            get: function(){
                return new activity.Service(config, 'epic', projectId, epicId);
            }
        },
        "comments": {
            enumerable: true,
            set: function(){},
            get: function(){
                return new comment.Service(config, 'epic', projectId, epicId);
            }
        }
    });
    
    Object.seal(this);
}

Service.prototype.comment = function(commentId) {
       return new comment.Service(this.config, 'epic', this.projectId, this.epicId, commentId);
};

Service.prototype.all = function(cb) { // cb(err, stories[])
    if (!this.projectId) {
        cb(new Error('Invalid project ID'), null);
    }
    else {
        utils.api.get(
            this.config.trackerToken,
            this.pathSegments(),
            null, // query
            null, // options
            function(error, res) {
                _callbackWithEpics(error, res, cb);
            });
    }
};

Service.prototype.get = function(cb) { // cb(err, epic)
    if (!this.projectId) {
        cb(new Error('Invalid project ID'), null);
    }
    else if (!this.epicId) {
        cb(new Error('Invalid epic ID'), null);
    }
    else {
        utils.api.get(
            this.config.trackerToken,
            this.pathSegments(),
            null, // query
            null, // options
            function(error, res) {
                _callbackWithEpic(error, res, cb);
            });
    }
};

Service.prototype.create = function(data, cb) { // cb(err, epic)
    if (!this.projectId) {
        cb(new Error('Invalid project ID'), null);
    }
    else if (!this.epicId) {
        cb(new Error('Invalid epic ID'), null);
    }
    else {
        utils.api.post(
            this.config.trackerToken,
            this.pathSegments(),
            null, //query
            data,
            null, //options
            function(error, res) {
                _callbackWithEpic(error, res, cb);
            });
    }
};

Service.prototype.update = function(data, cb) { // cb(err, epic)
    if (!this.projectId) {
        cb(new Error('Invalid project ID'), null);
    }
    else if (!this.epicId) {
        cb(new Error('Invalid epic ID'), null);
    }
    else {
        utils.api.put(
            this.config.trackerToken,
            this.pathSegments(), 
            null, //query
            data,
            null, //options
            function(error, res) {
                _callbackWithEpic(error, res, cb);
            });
    }
};

Service.prototype.delete = function(data, cb) { // cb(err)
    if (!this.projectId) {
        cb(new Error('Invalid project ID'), null);
    }
    else if (!this.epicId) {
        cb(new Error('Invalid epic ID'), null);
    }
    else {
        utils.api.delete(
            this.config.trackerToken,
            this.pathSegments(),
            null, //query
            null, //options
            function(error) {
                cb(error);
            });
    }
};

Service.prototype.pathSegments = function() {
    /*
    
    /projects/{project_id}/epics[/{epic_id}]
    
    */
    var segs = ['projects',this.projectId,'epics'];
    if (typeof this.epicId === 'number') {
        segs.push(this.epicId);
    }
    return segs;
};

function _callbackWithEpic(error, res, cb) {
    if (error) {
        cb(error, null);
    }
    else if (!res || !res.data) {
        cb(error, null);
    }
    else if (!res.data) {
        cb(null, null);
    }
    else {
        cb(null, new Epic(res.data));
    }
}

function _callbackWithStories(error, res, cb) {
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
            arr.push(new Epic(ele));
        });
        cb(null, arr);
    }
}

module.exports = {
    Service : Service,
    Epic : Epic
};