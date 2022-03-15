import axios from 'axios'

export default {
    _getDBGeoJSON: () =>
    axios({
        'method':'GET',
        'url':'/realestate',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'},
        'params': {
            'search':'parameter',
        },
    })
}