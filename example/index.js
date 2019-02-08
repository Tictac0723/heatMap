import React from 'react';
import { render } from 'react-dom';
import { Map, TileLayer } from 'react-leaflet';
import HeatmapLayer from '../src/HeatmapLayer';
import L from 'leaflet';

class MapExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mapHidden: false,
      layerHidden: false,
      addressPoints: [],
      radius: 8,
      blur: 8,
      max: 0.5,
      limitAddressPoints: true,
      currentLat: '',
      currentLong: '',
      currentIntensity: '',
      currentZip: '',
      currentCountry: '',
      newestCustomer: ''
    };
    this.handleLat = this.handleLat.bind(this);
    this.handleLong = this.handleLong.bind(this);
    this.handleIntensity = this.handleIntensity.bind(this);
    this.handleCustomer = this.handleCustomer.bind(this);
    this.addLocation = this.addLocation.bind(this);
  }
  componentDidMount() {
    var config = {
      apiKey: "AIzaSyCywYzUpH-aiqk75zgbUbCKDtpoWxqkbnk",
      authDomain: "heatmap-229017.firebaseapp.com",
      databaseURL: "https://heatmap-229017.firebaseio.com",
      projectId: "heatmap-229017",
      storageBucket: "heatmap-229017.appspot.com",
      messagingSenderId: "537439470300"
    };

    var map = L.map('map', {
      center: [0, 0],
      zoom: 1
  });
  console.log(map);

    firebase.initializeApp(config);
    var database = firebase.database();

    database.ref().on("child_added", (childSnapshot, prevChildKey) => {
      const locations = [...this.state.addressPoints, childSnapshot.val().newLocation];
      this.setState({
        addressPoints: locations,
      });

    });

    database.ref().on("child_changed", (childSnapshot, prevChildKey) => {
      M.toast({html: 'I am a toast!', displayLength: 30000})
    });
  }

  // shouldComponentUpdate() {
  //   M.toast({html: 'I am a toast!', displayLength: 30000});
  // }

  handleLat = e => {
    this.setState({
      currentLat: e.target.value
    });
  }
  handleLong = e => {
    this.setState({
      currentLong: e.target.value
    });
  }
  handleIntensity = e => {
    this.setState({
      currentIntensity: e.target.value
    });
  }
  handleCountry = e => {
    this.setState({
      currentCountry: e.target.value
    });
  }
  handleZip = e => {
    this.setState({
      currentZip: e.target.value
    });
  }
  handleCustomer = e => {
    this.setState({
      newestCustomer: e.target.value
    });
  }

  addLocation = e => {
    e.preventDefault();
    axios.get('http://dev.virtualearth.net/REST/v1/Locations?countryRegion=' + this.state.currentCountry + '&postalCode=' + this.state.currentZip + '}&key=Aghhp9HLUJjhSewSb-Q-cf-b0Wy-_mkJ53RWq3iKfCBH2piEb60Konpo5aAGadfW').then(result => {
      const coordinates = result.data.resourceSets[0].resources[0].geocodePoints[0].coordinates;
      this.setState({
        currentLat: coordinates[0],
        currentLong: coordinates[1]
      });
      const newLocation = [this.state.currentLat, this.state.currentLong, parseFloat(this.state.currentIntensity)];
    if (newLocation !== '') {
      var database = firebase.database();
      database.ref().push({
        newLocation: newLocation,
        name: this.state.newestCustomer
    });
    // var map = new L.Map('map', {
    //   zoomControl: false,
    //   center: [this.state.currentLat, this.state.currentLong],
    //   zoom: 15
    // });
    L.Map.flyTo([this.state.currentLat, this.state.currentLong], 10, {
      animate: true,
      duration: 2 // in seconds
    });
      this.setState({
        currentLat: '',
        currentLong: '',
        currentIntensity: ''
      });
      M.toast({html: this.state.newestCustomer + ' ordered a ProPlus 36!'})
    };
    });
  }
  /**
   * Toggle limiting the address points to test behavior with refocusing/zooming when data points change
   */
  toggleLimitedAddressPoints() {
    if (this.state.limitAddressPoints) {
      this.setState({ addressPoints: addressPoints.slice(500, 1000), limitAddressPoints: false });
    } else {
      this.setState({ addressPoints, limitAddressPoints: true });
    }
  }

  render() {
    if (this.state.mapHidden) {
      return (
        <div>
          <input
            type="button"
            value="Toggle Map"
            onClick={() => this.setState({ mapHidden: !this.state.mapHidden })}
          />
        </div>
      );
    }

    const gradient = {
      0.1: '#89BDE0', 0.2: '#96E3E6', 0.4: '#82CEB6',
      0.6: '#FAF3A5', 0.8: '#F5D98B', '1.0': '#DE9A96'
    };

    return (
      <div className="container">
      <div id="map">
        {/* <Map ref={(e) => { this.map = e; }} center={[0, 0]} zoom={1}>
          {!this.state.layerHidden &&
              <HeatmapLayer
                fitBoundsOnLoad
                points={this.state.addressPoints}
                longitudeExtractor={m => {
                  return parseFloat(m[1]);
                } }
                latitudeExtractor={m => {
                  return parseFloat(m[0]);
                }}
                gradient={gradient}
                intensityExtractor={m => {
                  return m[2];
                }}
                radius={Number(this.state.radius)}
                blur={Number(this.state.blur)}
                max={Number.parseFloat(this.state.max)}
              />
            }
          <TileLayer
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </Map> */}
        </div>
        <input
          type="button"
          value="Toggle Map"
          onClick={() => this.setState({ mapHidden: !this.state.mapHidden })}
        />
        <input
          type="button"
          value="Toggle Layer"
          onClick={() => this.setState({ layerHidden: !this.state.layerHidden })}
        />
        <input
          type="button"
          value="Toggle Limited Data"
          onClick={this.toggleLimitedAddressPoints.bind(this)}
        />

        <div>
          Radius
          <input
            type="range"
            min={1}
            max={40}
            value={this.state.radius}
            onChange={(e) => this.setState({ radius: e.currentTarget.value })}
          /> {this.state.radius}
        </div>

        <div>
          Blur
          <input
            type="range"
            min={1}
            max={20}
            value={this.state.blur}
            onChange={(e) => this.setState({ blur: e.currentTarget.value })}
          /> {this.state.blur}
        </div>

        <div>
          Max
          <input
            type="range"
            min={0.1}
            max={3}
            step={0.1}
            value={this.state.max}
            onChange={(e) => this.setState({ max: e.currentTarget.value })}
          /> {this.state.max}
        </div>
        <br />
        <br />
        <div>
          Intensity:
          <input
            type="text"
            placeholder="486"
            onChange={this.handleIntensity}
            value= {this.state.currentIntensity}
          />
        </div>
        <div>
          Country:
          <input
            type="text"
            placeholder="US"
            onChange={this.handleCountry}
            value= {this.state.currentCountry}
          />
        </div>
        <div>
          Zip Code:
          <input
            type="text"
            placeholder="76226"
            onChange={this.handleZip}
            value= {this.state.currentZip}
          />
        </div>
        <div>
          Name:
          <input
            type="text"
            placeholder="tictac"
            onChange={this.handleCustomer}
            value= {this.state.newestCustomer}
          />
        </div>
        <button
            onClick={this.addLocation}
          >
          NEW PLACE
          </button>
      </div>
    );
  }

}

render(<MapExample />, document.getElementById('app'));
