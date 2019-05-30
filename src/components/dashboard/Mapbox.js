import React, {Component} from 'react';
import MapGL, { Marker } from 'react-map-gl';
import moment from 'moment';
const TOKEN = 'pk.eyJ1Ijoiam9uYXRoYW5yYXkxNyIsImEiOiJjanZ3aHd1ZzM0Y3B5NDlxcjRsbnIzcTAxIn0.ygYs-iXNclW8pJeuknEvJA';

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 37.785164,
        longitude: 0,
        zoom: 1.25,
        bearing: 0,
        pitch: 0,
        width: 500,
        height: 500,
      }
    };
  }
  componentDidMount(){
    this._assignMapDimensions();
    window.addEventListener('resize', this._assignMapDimensions);
  }
  componentWillUnmount(){
    window.removeEventListener('resize', this._assignMapDimensions);
  }
  render() {
      const {viewport} = this.state;
      const { trips, selectedTrip, clickedTrip, } = this.props;
      let today = moment(new Date()).format();
      const arrayOfMarkers = trips && trips.map(({id, trip_location, trip_date, trip_details, lat, lon, photos}) => {
        let selected = '';
        selectedTrip === id ? selected = 'fa-map-pin-hover' : selected = '';
        let tripDate = moment(trip_date.split("T").shift()).format()
        return(
          <div key={id} onClick={()=>clickedTrip(id)} onMouseEnter={()=>{this.props.tripSelector(id)}} onMouseLeave={this.props.tripDeselector}>
              <Marker
                latitude={parseFloat(lat)}
                longitude={parseFloat(lon)} 
                offsetTop={-12}
                key={id}
                >
                { tripDate > today ? <i style={{color:"#2196f3"}} className={`fas fa-map-pin ${selected}`}></i> : <i style={{color:"#c62828"}} className={`fas fa-map-pin ${selected}`}></i> }
              </Marker>
          </div>
        )});
    return (
          <MapGL
            className='mapbox-gl'
            {...viewport}
            mapStyle="mapbox://styles/mapbox/satellite-streets-v9"
            onViewportChange={this._onChangeHandler}
            mapboxApiAccessToken={TOKEN}>
            {arrayOfMarkers}
          </MapGL>
    );
  }
  _onChangeHandler = (viewport) => {
    this.setState({
      viewport: {
        ...viewport,
      }
    });
  }
  _assignMapDimensions = () => {
    const width = document.getElementById("mapbox").offsetWidth;
    const height = document.getElementById("mapbox").offsetHeight;
    this.setState({
      viewport: {
        ...this.state.viewport,
        width,
        height,
      }
    });
  }
}