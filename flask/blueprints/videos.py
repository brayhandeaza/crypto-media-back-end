import requests
from flask import jsonify, request, Blueprint
import json
from helpers import fetch_vikiporn, fetch_xxxbule, fetch_xxxbule_single_video,fetch_vikiporn_single_video, SOURCES
import random
from flask_caching import Cache

videos = Blueprint('videos', __name__, url_prefix="/videos")
cache = Cache()


# Fetch videos from multiple sources
@videos.route('/')
@cache.cached(timeout=60)
def get_feed_videos():
    query = request.args.get('q')

    vikiporn = fetch_vikiporn(query)
    xxxbule = fetch_xxxbule(query)

    results = vikiporn + xxxbule
    random.shuffle(results)

    return jsonify({
        "status": 200,
        "data": results
    })


# Fetcch single video from expecify source
@videos.route('/play', methods=['GET'])
# @cache.cached(timeout=60)
def get_video_to_play():
    title_id = request.args.get('title_id')
    source_id = request.args.get('source_id')
    video_id = request.args.get('video_id')
    box_id = request.args.get('box_id')

    video = None
    if (SOURCES[source_id] == "xxxbule"):
        video = fetch_xxxbule_single_video(title_id)
    
        if video == False:
            return jsonify({
                "status": 404,
                "data": {},
                "error": True
            })
        else:
            return jsonify({
                "status": 200,
                "data": video,
                "error": False
            })
            
    elif (SOURCES[source_id] == "vikiporn"):
        video = fetch_vikiporn_single_video(box_id, video_id, title_id)
        if video == False:
            return jsonify({
                "status": 404,
                "data": {},
                "error": True
            })
        else:
            return jsonify({
                    "status": 200,
                    "data": video,
                    "error": False
                })


# Register Blueprints
def register_blueprints(app):
    app.register_blueprint(videos)
    cache.init_app(app)
