---
title: Assets
uuid: assets
---
#### Assets

## Configuration

```json
"assets": {
    "default" : "local",
    "tmpdir" : "{absolute path to tmp directory}",
    "engines": {
        "local":{
            "path":"{absolute path to public asset folder}",
            "urlbase":"{full url base to serve files from}"
        }
    }
}
```

* default :
    * This determines which engine will serve assets
* tmpdir :
    * Absolute path on your local system where temporary files will be saved. Make sure it has correct permissions.
* engines :
    * Each engine listed will be used for creating and updating assets, but only the one listed in `default` will be used for serving assets.


## Known Issues

* Each engine will be used. If you dont need both, remove the one you dont need.
* You receive and error upon upload, but the file gets uploaded.
    * If you have both local and amazon set in engines, and amazon is the default, then the local is probably failing due to permissions on the `path` you set in your local engine.
