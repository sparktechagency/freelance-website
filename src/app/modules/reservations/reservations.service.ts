import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import axios from 'axios';
import config from '../../config';

const createReservation = async () => {
  const apiUrl = 'https://public.api.hospitable.com/v2/properties';
  const accessToken = 'YOUR_ACCESS_TOKEN'; 

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data; // Axios automatically parses JSON
  } catch (error:any) {
    console.error('Error creating ResercreateReservation:', error.message);

    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
      });
    }

    throw error;
  }
};

// Example usage:
/*
const ResercreateReservationData = {
  name: "Beautiful Vacation Home",
  address: {
    street: "123 Main St",
    city: "San Francisco",
    state: "CA",
    postal_code: "94105",
    country: "US"
  },
  // other required fields according to Hospitable API docs
};

createReservation(ResercreateReservationData)
  .then(result => console.log('Created ResercreateReservation:', result))
  .catch(error => console.error('Error:', error));
*/



//  const getAllResercreateReservationQuery = async (query: Record<string, unknown>) => {
//   const allProperties = [];
//   const page = query.page || 1;
//   const limit = query.limit || 10;

//   try {
//     while (true) {
//       const response = await axios.get(
//         `${config.hospitable_api_url}/properties?page=${page}&per_page=${limit}`,
//         {
//           headers: {
//             Authorization: `Bearer ${config.hospitable_api_key}`,
//           },
//         },
//       );

//       console.log('response', response);

//       const { data, meta } = response.data;
//       console.log('data', data);
//       console.log('meta', meta);
//       allProperties.push(...data);
//       console.log('allProperties', allProperties);

  

//       return {meta, result:allProperties};
//     }

    
//   } catch (error: any) {
//     const status = error.response?.status || 500;
//     const message = error.message || 'Unknown error occurred';

//     console.error('Error fetching all properties:', message);
//     throw new AppError(status, message);
//   }
// };


const getAllResercreateReservationQuery = async (query: Record<string, unknown>) => {
  const allReservations = [];
  const page = query.page || 1;
  const limit = query.limit || 10;
  const properties:any= query.properties || [];

  // const properties = [
  //   'aa898909-da36-4b3e-ac19-ff0d3f1f3c42',
  //   '76e113f5-92e2-43b7-b5f9-0bead5f5b605'
  // ];

  try {
    if (properties.length > 0) {
      console.log('hoise');
      const propertiesQuery = properties
        .map((propertyId: string) => `properties[]=${propertyId}`)
        .join('&');
      console.log('propertiesQuery', propertiesQuery);
      const response = await axios.get(
        `${config.hospitable_api_url}/reservations?page=${page}&per_page=${limit}&${propertiesQuery}`,
        {
          headers: {
            Authorization: `Bearer ${config.hospitable_api_key}`,
          },
        },
      );

      console.log('response', response);

      const { data, meta } = response.data;
      allReservations.push(...data);

      // console.log('data', data);
      // console.log('meta', meta);
      // if (arrival && departure && guests) {
      //   console.log('arrival', arrival);
      //   console.log('departure', departure);
      //   console.log('guests', guests);

      //   for (const ResercreateReservation of data) {
      //     if (ResercreateReservation.capacity.max < guests) continue;
      //     try {
      //       const calendarResponse = await axios.get(
      //         `${config.hospitable_api_url}/properties/${ResercreateReservation.id}/calendar`,
      //         {
      //           params: {
      //             start_date: arrival,
      //             end_date: departure,
      //           },
      //           headers: {
      //             Authorization: `Bearer ${config.hospitable_api_key}`,
      //           },
      //         },
      //       );

      //       // console.log('calendarResponse', calendarResponse);
      //       console.log('calendarResponse===data', calendarResponse.data.data);
      //       // console.log('calendarResponse===', calendarResponse.data?.days);

      //       // // Check if the `days` array exists and is an array
      //       // const days = calendarResponse.data?.data?.days;
      //       // if (!Array.isArray(days)) {
      //       //   console.warn(
      //       //     `No availability data found for ResercreateReservation ${ResercreateReservation.id}`,
      //       //   );
      //       //   continue;
      //       // }

      //       // // console.log('days', days);

      //       // const isAvailable = days.every((day: any) => {
      //       //   // console.log('Checking day:', day);

      //       //   const available = day?.status?.available;
      //       //   return available === true;
      //       // });
      //       // // console.log('isAvailable', isAvailable);

      //         allProperties.push(ResercreateReservation);

      //     } catch (err) {
      //       console.error(
      //         `Error fetching calendar for ResercreateReservation ${ResercreateReservation.id}:`,
      //         err,
      //       );
      //     }
      //   }
      // } else {
      //   allProperties.push(...data);
      // }
      // console.log('allProperties', allProperties);

      return { meta, result: allReservations };
    }else{
      console.log('akhane hit hoise');
       const allProperties = await axios.get(
              `${config.hospitable_api_url}/properties`,
              {
                headers: {
                  Authorization: `Bearer ${config.hospitable_api_key}`,
                },
              },
            );

      const properties = allProperties.data.data.map((property: any) => property.id);

      const propertiesQuery = properties
        .map((propertyId: string) => `properties[]=${propertyId}`)
        .join('&');
      console.log('propertiesQuery', propertiesQuery);
      const response = await axios.get(
        `${config.hospitable_api_url}/reservations?page=${page}&per_page=${limit}&${propertiesQuery}`,
        {
          headers: {
            Authorization: `Bearer ${config.hospitable_api_key}`,
          },
        },
      );

      console.log('response', response);

      const { data, meta } = response.data;
      allReservations.push(...data);

      return { meta, result: allReservations };

    }
  } catch (error: any) {
    console.log('error', error);
    const status = error.response?.status || 500;
    const message = error.message || 'Unknown error occurred';

    console.error('Error fetching all properties:', message);
    throw new Error(`Error fetching all properties: ${message}`);
  }
};

const getSingleResercreateReservationQuery = async (id: string) => {

  try {

    const response = await axios.get(
      `${config.hospitable_api_url}/reservations/${id}`,
      {
        headers: {
          Authorization: `Bearer ${config.hospitable_api_key}`,
        },
      },
    );

    return response.data;
    
  } catch (error:any) {

    console.error('Error fetching single ResercreateReservation:', error.message);
    throw new Error(`Error fetching single ResercreateReservation: ${error.message}`);
    
  }

 
};

const updateSingleResercreateReservationQuery = async (id: string, payload: any) => {


  return 'result';
};

const deletedResercreateReservationQuery = async (id: string) => {


  return 'result';
};

export const resercreateReservationService = {
  createReservation,
  getAllResercreateReservationQuery,
  getSingleResercreateReservationQuery,
  updateSingleResercreateReservationQuery,
  deletedResercreateReservationQuery,
};
