import React from 'react';
import Sensor from './Sensor';

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sensors: []
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => fetch(window.API_URL+"/climate/sensors")
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data);
            this.setState({sensors: data});
        })
        ,3000)
    }

    render() {
        return (
            <div>
            {
                this.state.sensors.map( sensor => (
                   <Sensor data={sensor} key={sensor.address}/>
                ))
            }
            </div>
        )
    }
}

export default Main;