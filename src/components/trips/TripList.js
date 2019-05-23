import React from 'react';
import TripDetails from './TripDetails';

export default function TripList({trips, tripSelector, tripDeselector, selectedTrip, updateApp}) {
    return (
        <div className='trip-list section'>
            <ul>
                    {trips && trips.map(({id, trip_location, trip_date, trip_details, lat, lon, photos}) => {
                        let selected = '';
                        selectedTrip === id ? selected = 'trip-list-item-hover' : selected = '';
                        return(
                            <li key={id} onClick={()=>tripSelector(id)} className='trip-list-item'>
                                <TripDetails 
                                    name={trip_location}
                                    id={id}
                                    details={trip_details}
                                    date={trip_date}
                                    lat={lat}
                                    lon={lon}
                                    photos={photos}
                                    updateApp={updateApp}
                                />
                                <a href={`#${id}`} onClick={()=>console.log("TripList id:", id)} onMouseEnter={()=>{tripSelector(id)}} onMouseLeave={tripDeselector} className={`modal-trigger ${selected}`} style={{color:"black"}} >
                                    {trip_location}
                                </a>
                            </li>
                        )
                    })}
            </ul>
        </div>
    )
}
