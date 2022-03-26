import requests from "../helpers/requests";
import axios from 'axios';
import plantUML from '../helpers/plantuml'

export default {
    request(params) {
        params.url = window.origin + params.url.slice(19);
        return requests.axios(params);
    },
    renderPlantUML(uml) {
        return axios({url: plantUML.svgURL(uml)});
    },
    getChangeIndex: function () {
        return new Promise(function (resolve) {
            resolve(1);
        });
    },
    showDebugger: function() {
        // eslint-disable-next-line no-debugger
        debugger;
    },
    reload() {
        window.location.reload();
    }
}