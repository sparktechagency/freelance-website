import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import axios from 'axios';
import config from '../../config';

const createProperty = async () => {
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
    console.error('Error creating property:', error.message);

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
const propertyData = {
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

createProperty(propertyData)
  .then(result => console.log('Created property:', result))
  .catch(error => console.error('Error:', error));
*/



//  const getAllPropertyQuery = async (query: Record<string, unknown>) => {
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


const getAllPropertyQuery = async (query: Record<string, unknown>) => {
  const allProperties = [];
  const page = query.page || 1;
  const limit = query.limit || 10;
  const arrival = query.arrival; // Expecting ISO date string
  const departure = query.departure; // Expecting ISO date string
  const guests = query.guests || 1; // Default to 1 guest if not provided

  try {
    while (true) {
      const response = await axios.get(
        `${config.hospitable_api_url}/properties?page=${page}&per_page=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${config.hospitable_api_key}`,
          },
        },
      );

      // console.log('response', response);

      const { data, meta } = response.data;
      // console.log('data', data);
      // console.log('meta', meta);
      if (arrival && departure && guests) {
        console.log('arrival', arrival);
        console.log('departure', departure);
        console.log('guests', guests);

        for (const property of data) {
          if (property.capacity.max < guests) continue;
          try {
            const calendarResponse = await axios.get(
              `${config.hospitable_api_url}/properties/${property.id}/calendar`,
              {
                params: {
                  start_date: arrival,
                  end_date: departure,
                },
                headers: {
                  Authorization: `Bearer ${config.hospitable_api_key}`,
                },
              },
            );

            // console.log('calendarResponse', calendarResponse);
            console.log('calendarResponse===data', calendarResponse.data.data);
            // console.log('calendarResponse===', calendarResponse.data?.days);

            // // Check if the `days` array exists and is an array
            // const days = calendarResponse.data?.data?.days;
            // if (!Array.isArray(days)) {
            //   console.warn(
            //     `No availability data found for property ${property.id}`,
            //   );
            //   continue;
            // }

            // // console.log('days', days);

            // const isAvailable = days.every((day: any) => {
            //   // console.log('Checking day:', day);

            //   const available = day?.status?.available;
            //   return available === true;
            // });
            // // console.log('isAvailable', isAvailable);

           
              allProperties.push(property);
            
            
          } catch (err) {
            console.error(
              `Error fetching calendar for property ${property.id}:`,
              err,
            );
          }
        }
      } else {
        allProperties.push(...data);
      }
      // console.log('allProperties', allProperties);

      return { meta, result: allProperties };
    }

  
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.message || 'Unknown error occurred';

    console.error('Error fetching all properties:', message);
    throw new Error(`Error fetching all properties: ${message}`);
  }
};

const getSinglePropertyQuery = async (id: string) => {

  try {

    const response = await axios.get(
      `${config.hospitable_api_url}/properties/${id}`,
      {
        headers: {
          Authorization: `Bearer ${config.hospitable_api_key}`,
        },
      },
    );

   const calendarResponse = await axios.get(
      `${config.hospitable_api_url}/properties/${id}/calendar`,
      {
        headers: {
          Authorization: `Bearer ${config.hospitable_api_key}`,
        },
      },
    );
    const reviewsResponse = await axios.get(
      `${config.hospitable_api_url}/properties/${id}/reviews`,
      {
        headers: {
          Authorization: `Bearer ${config.hospitable_api_key}`,
        },
      },
    );

    console.log('response', calendarResponse.data.data);
    // console.log('response', response);

    return {...response.data, availability: calendarResponse.data.data, reviews: reviewsResponse.data.data};
    
  } catch (error:any) {

    console.error('Error fetching single property:', error.message);
    throw new Error(`Error fetching single property: ${error.message}`);
    
  }

 
};

const updateSinglePropertyQuery = async (id: string, payload: any) => {


  return 'result';
};

const deletedPropertyQuery = async (id: string) => {


  return 'result';
};

export const propertyService = {
  createProperty,
  getAllPropertyQuery,
  getSinglePropertyQuery,
  updateSinglePropertyQuery,
  deletedPropertyQuery,
};
