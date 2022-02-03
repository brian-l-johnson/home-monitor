import React, { Component } from 'react';

class Sensor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            edit: false
        }
    }
    toggleEdit = event => {
        console.log("in toggleEdit");
        this.setState({edit: true});
    }

    updateField = event => {
        console.log(event);
        let room = event.target.form[1].value;
        let highAlert = event.target.form[2].value;
        let lowAlert = event.target.form[3].value;
        fetch(window.API_URL+"/climate/sensors/"+this.props.data.address, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "highAlert": highAlert,
                "lowAlert": lowAlert,
                "room": room 
            })
            

        })
        this.setState({edit: false});
    }
    render() {
        return (
            <div className="card">
                <form>
                <div className="card-header">
                    Sensor: {this.props.data.address}
                    {
                        this.state.edit ? 
                            <button className="btn btn-primary" type="button" onClick={this.updateField}>
                                <i className="bi bi-save"></i> Save
                            </button>:
                            <button className="btn btn-primary" type="button" onClick={this.toggleEdit}>
                                <i className="bi bi-pencil"></i> Edit
                            </button>
                    }

                </div>
                <div className="card-body">
                    <div className="card-text">
                        Temperature: {this.props.data.lastTemp} <br />
                        Humidity: {this.props.data.lastHumidity} <br />
                        Battery: {this.props.data.lastBattery} <br />
                        Room: {
                            this.state.edit ?
                                <input type="text" name="room" defaultValue={this.props.data.room}/> :
                                this.props.data.room 
                        }
                        <br/>
                        Alert if over: {
                            this.state.edit ? 
                                <input type="text" name="highAlert" defaultValue={this.props.data.highAlert} />:
                                this.props.data.highAlert
                        } 
                        <br />
                        Alert if under: {
                            this.state.edit ?
                                <input type="text" name="lowAlert" defaultValue={this.props.data.lowAlert} />:
                                this.props.data.lowAlert
                        }
                    </div>
                    
                </div>
                </form>
            </div>
        )
    }
}

export default Sensor