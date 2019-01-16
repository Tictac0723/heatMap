import React from 'react';
import { render } from 'react-dom';
import { Map, TileLayer } from 'react-leaflet';
import HeatmapLayer from '../src/HeatmapLayer';

class MapExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mapHidden: false,
      layerHidden: false,
      addressPoints: [],
      radius: 4,
      blur: 8,
      max: 0.5,
      limitAddressPoints: true,
      currentLat: '',
      currentLong: '',
      currentIntensity: ''
    };
    this.handleLat = this.handleLat.bind(this);
    this.handleLong = this.handleLong.bind(this);
    this.handleIntensity = this.handleIntensity.bind(this);
    this.addLocation = this.addLocation.bind(this);
  }

  handleLat = e => {
    console.log('handled');
    this.setState({
      currentLat: parseFloat(e.target.value)
    });
    console.log(this.state, 'state');
  }
  handleLong = e => {
    console.log('handled');
    this.setState({
      currentLong: parseFloat(e.target.value)
    });
    console.log(this.state, 'state');
  }
  handleIntensity = e => {
    console.log('handled');
    this.setState({
      currentIntensity: parseFloat(e.target.value)
    });
    console.log(this.state, 'state');
  }

  addLocation = e => {
    e.preventDefault();
    const newLocation = [this.state.currentLat, this.state.currentLong, this.state.currentIntensity];
    console.log(newLocation, 'new');
    if (newLocation !== '') {
      const locations = [...this.state.addressPoints, newLocation];
      console.log(locations, 'locations');
      this.setState({
        addressPoints: locations,
        currentLat: '',
        currentLong: '',
        currentIntensity: ''
      });
      console.log(this.state, 'the state');
    }
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
      <div>
        <Map center={[47.5902566, -122.2418204]} zoom={10}>
          {!this.state.layerHidden &&
              <HeatmapLayer
                fitBoundsOnLoad
                fitBoundsOnUpdate
                points={this.state.addressPoints}
                longitudeExtractor={m => {
                  console.log(m[1]);
                  return m[1];
                } }
                latitudeExtractor={m => m[0]}
                gradient={gradient}
                intensityExtractor={m => m[2]}
                radius={Number(this.state.radius)}
                blur={Number(this.state.blur)}
                max={Number.parseFloat(this.state.max)}
              />
            }
          <TileLayer
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </Map>
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
        <div>
        47.6205063
        <br />
        -122.3514661
        <br />
          Latitude:
          <input
            type="text"
            placeholder="32.9376974"
            onChange={this.handleLat}
            value= {this.state.currentLat}
          />
          <button
            onClick={this.addLocation}
          >
          NEW PLACE
          </button>
        </div>
        <br />
        <div>
          Longitude:
          <input
            type="text"
            placeholder="-96.996854"
            onChange={this.handleLong}
            value= {this.state.currentLong}
          />
        </div>
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
      </div>
    );
  }

}

render(<MapExample />, document.getElementById('app'));
